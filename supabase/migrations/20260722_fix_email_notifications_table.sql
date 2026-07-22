-- Garante que a tabela order_email_notifications existe e corrige a função de exclusão.
-- Execute este script no Supabase Dashboard → SQL Editor caso o erro
-- "relation public.order_email_notifications does not exist" apareça.

-- 1. Recria a tabela de forma segura (IF NOT EXISTS)
create table if not exists public.order_email_notifications (
  id uuid primary key default gen_random_uuid(),
  order_id text not null references public.orders(id) on delete restrict,
  event_type text not null check (event_type in ('payment_confirmed')),
  recipient_email text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  attempts integer not null default 1 check (attempts > 0),
  provider_message_id text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  unique (order_id, event_type)
);

-- 2. Índice de performance
create index if not exists order_email_notifications_status_idx
on public.order_email_notifications(status, created_at desc);

-- 3. RLS
alter table public.order_email_notifications enable row level security;

drop policy if exists "admins_read_order_email_notifications" on public.order_email_notifications;
create policy "admins_read_order_email_notifications"
on public.order_email_notifications for select
to authenticated
using ((select private.is_admin((select auth.uid()))));

-- 4. Grants explícitos (service_role precisa inserir/atualizar via Edge Function)
grant select on public.order_email_notifications to authenticated;
revoke insert, update, delete on public.order_email_notifications from authenticated;
grant all on public.order_email_notifications to service_role;

-- 5. Trigger de updated_at
drop trigger if exists order_email_notifications_touch_updated_at on public.order_email_notifications;
create trigger order_email_notifications_touch_updated_at
before update on public.order_email_notifications
for each row execute function public.touch_updated_at();

-- 6. Recria a função admin_delete_order com tratamento seguro de erro
--    caso a tabela ainda não exista em algum ambiente legado.
create or replace function public.admin_delete_order(target_order_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_order public.orders%rowtype;
  v_item jsonb;
  v_key text;
  v_qty integer;
  restored_items integer := 0;
begin
  if not private.is_admin(auth.uid()) then
    raise exception 'Apenas administradores podem excluir pedidos';
  end if;

  select * into target_order
  from public.orders
  where id = target_order_id
  for update;

  if target_order.id is null then
    raise exception 'Pedido não encontrado';
  end if;

  if target_order.payment_status = 'approved' then
    for v_item in select value from jsonb_array_elements(target_order.order_data -> 'items') loop
      v_key := (v_item ->> 'productId') || '_' || (v_item ->> 'color') || '_' || (v_item ->> 'size');
      v_qty := greatest(0, coalesce((v_item ->> 'qty')::integer, 0));
      update public.catalog_stock
      set qty = qty + v_qty
      where key = v_key;
      if found then restored_items := restored_items + v_qty; end if;
    end loop;
  end if;

  -- Remove notificações de e-mail com tratamento seguro
  begin
    delete from public.order_email_notifications where order_id = target_order.id;
  exception
    when undefined_table then
      -- tabela ainda não existe neste ambiente; prossegue sem erro
      null;
  end;

  delete from public.order_events where order_id = target_order.id;
  delete from public.orders where id = target_order.id;

  return jsonb_build_object(
    'deleted', true,
    'order_id', target_order.id,
    'restored_items', restored_items
  );
end;
$$;

revoke all on function public.admin_delete_order(text) from public, anon;
grant execute on function public.admin_delete_order(text) to authenticated;
