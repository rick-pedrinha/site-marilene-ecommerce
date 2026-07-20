-- Cancelamentos, devoluções e reembolsos rastreáveis.

alter table public.orders
  add column if not exists delivered_at timestamptz,
  add column if not exists cancellation_status text,
  add column if not exists cancellation_requested_at timestamptz,
  add column if not exists cancellation_reason text,
  add column if not exists return_status text,
  add column if not exists refund_status text,
  add column if not exists refund_amount numeric(12,2),
  add column if not exists refund_reference text,
  add column if not exists refunded_at timestamptz;

alter table public.orders
  drop constraint if exists orders_cancellation_status_check;

alter table public.orders
  add constraint orders_cancellation_status_check
  check (
    cancellation_status is null
    or cancellation_status in (
      'requested', 'awaiting_return', 'returned', 'refund_pending',
      'refunded', 'rejected', 'cancelled'
    )
  );

alter table public.orders
  drop constraint if exists orders_cancellation_reason_length_check;

alter table public.orders
  add constraint orders_cancellation_reason_length_check
  check (cancellation_reason is null or char_length(cancellation_reason) <= 1000);

alter table public.orders
  drop constraint if exists orders_return_status_check;

alter table public.orders
  add constraint orders_return_status_check
  check (return_status is null or return_status in ('not_required', 'awaiting_return', 'returned'));

alter table public.orders
  drop constraint if exists orders_refund_status_check;

alter table public.orders
  add constraint orders_refund_status_check
  check (refund_status is null or refund_status in ('not_required', 'pending', 'refunded'));

create index if not exists orders_cancellation_status_idx
on public.orders(cancellation_status)
where cancellation_status is not null;

update public.orders
set delivered_at = coalesce(delivered_at, updated_at, created_at)
where status = 'delivered' and delivered_at is null;

create table if not exists public.order_events (
  id bigint generated always as identity primary key,
  order_id text not null references public.orders(id) on delete restrict,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists order_events_order_id_idx
on public.order_events(order_id, created_at desc);

alter table public.order_events enable row level security;

drop policy if exists "customers_or_admins_read_order_events" on public.order_events;
create policy "customers_or_admins_read_order_events"
on public.order_events for select
to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_events.order_id
      and (
        orders.user_id = (select auth.uid())
        or (select private.is_admin((select auth.uid())))
      )
  )
);

grant select on public.order_events to authenticated;
revoke insert, update, delete on public.order_events from authenticated;

create or replace function private.log_order_state_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status
     or new.payment_status is distinct from old.payment_status
     or new.cancellation_status is distinct from old.cancellation_status
     or new.return_status is distinct from old.return_status
     or new.refund_status is distinct from old.refund_status
     or new.delivered_at is distinct from old.delivered_at then
    insert into public.order_events (order_id, actor_user_id, event_type, details)
    values (
      new.id,
      auth.uid(),
      'order_state_changed',
      jsonb_build_object(
        'status', jsonb_build_object('from', old.status, 'to', new.status),
        'payment_status', jsonb_build_object('from', old.payment_status, 'to', new.payment_status),
        'cancellation_status', jsonb_build_object('from', old.cancellation_status, 'to', new.cancellation_status),
        'return_status', jsonb_build_object('from', old.return_status, 'to', new.return_status),
        'refund_status', jsonb_build_object('from', old.refund_status, 'to', new.refund_status)
      )
    );
  end if;
  return new;
end;
$$;

revoke all on function private.log_order_state_change() from public, anon, authenticated;

drop trigger if exists orders_log_state_change on public.orders;
create trigger orders_log_state_change
after update on public.orders
for each row execute function private.log_order_state_change();

create or replace function public.request_order_cancellation(
  target_order_id text,
  reason text default null
)
returns setof public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_order public.orders%rowtype;
  next_cancellation_status text;
begin
  select * into target_order
  from public.orders
  where id = target_order_id
  for update;

  if target_order.id is null or target_order.user_id <> auth.uid() then
    raise exception 'Pedido não encontrado para esta conta';
  end if;

  if target_order.cancellation_status is not null
     and target_order.cancellation_status <> 'rejected' then
    raise exception 'Este pedido já possui uma solicitação de cancelamento';
  end if;

  if target_order.status = 'cancelled' or target_order.payment_status = 'refunded' then
    raise exception 'Este pedido já foi cancelado ou reembolsado';
  end if;

  if target_order.status = 'delivered'
     and target_order.delivered_at is not null
     and now() > target_order.delivered_at + interval '7 days' then
    raise exception 'O prazo de arrependimento deste pedido terminou. Use o atendimento para relatar defeito ou outro problema';
  end if;

  next_cancellation_status := case
    when target_order.payment_status = 'pending'
         and target_order.status in ('pending', 'preparing') then 'cancelled'
    else 'requested'
  end;

  update public.orders
  set cancellation_status = next_cancellation_status,
      cancellation_requested_at = now(),
      cancellation_reason = nullif(trim(reason), ''),
      return_status = case
        when target_order.status in ('shipped', 'delivered') then 'awaiting_return'
        else 'not_required'
      end,
      refund_status = case
        when target_order.payment_status = 'approved' then 'pending'
        else 'not_required'
      end,
      status = case when next_cancellation_status = 'cancelled' then 'cancelled' else status end
  where id = target_order_id;

  return query
  select * from public.orders where id = target_order_id;
end;
$$;

revoke all on function public.request_order_cancellation(text, text) from public, anon;
grant execute on function public.request_order_cancellation(text, text) to authenticated;

-- Pedidos são registros comerciais e não devem ser apagados pelo painel.
drop policy if exists "admins_delete_orders" on public.orders;
revoke delete on public.orders from authenticated;
