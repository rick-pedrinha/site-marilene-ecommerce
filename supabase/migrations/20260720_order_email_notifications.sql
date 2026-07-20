-- Registro idempotente dos e-mails transacionais dos pedidos.

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

create index if not exists order_email_notifications_status_idx
on public.order_email_notifications(status, created_at desc);

alter table public.order_email_notifications enable row level security;

drop policy if exists "admins_read_order_email_notifications" on public.order_email_notifications;
create policy "admins_read_order_email_notifications"
on public.order_email_notifications for select
to authenticated
using ((select private.is_admin((select auth.uid()))));

grant select on public.order_email_notifications to authenticated;
revoke insert, update, delete on public.order_email_notifications from authenticated;

drop trigger if exists order_email_notifications_touch_updated_at on public.order_email_notifications;
create trigger order_email_notifications_touch_updated_at
before update on public.order_email_notifications
for each row execute function public.touch_updated_at();
