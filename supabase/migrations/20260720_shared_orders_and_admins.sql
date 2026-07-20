-- Pedidos compartilhados, acesso por cliente e múltiplos administradores.
-- Execute este arquivo uma vez no SQL Editor do projeto Supabase.
-- Antes de executar, confirme em Authentication > Users que
-- rickpedrinha@sempreceub.com existe e está com o e-mail confirmado.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default 'Administrador',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete restrict,
  account_email text not null,
  order_data jsonb not null,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'approved', 'cancelled', 'refunded')),
  status text not null default 'pending'
    check (status in ('pending', 'preparing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

create or replace function private.is_admin(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = check_user_id and active = true
  );
$$;

revoke all on function private.is_admin(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_admin(uuid) to authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_updated_at();

alter table public.admin_users enable row level security;
alter table public.orders enable row level security;

drop policy if exists "admins_read_admin_users" on public.admin_users;
create policy "admins_read_admin_users"
on public.admin_users for select
to authenticated
using (
  (select auth.uid()) = user_id
  or (select private.is_admin((select auth.uid())))
);

drop policy if exists "customers_insert_own_orders" on public.orders;
create policy "customers_insert_own_orders"
on public.orders for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and lower(account_email) = lower((select auth.jwt() ->> 'email'))
);

drop policy if exists "customers_or_admins_read_orders" on public.orders;
create policy "customers_or_admins_read_orders"
on public.orders for select
to authenticated
using (
  (select auth.uid()) = user_id
  or (select private.is_admin((select auth.uid())))
);

drop policy if exists "admins_update_orders" on public.orders;
create policy "admins_update_orders"
on public.orders for update
to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));

drop policy if exists "admins_delete_orders" on public.orders;
create policy "admins_delete_orders"
on public.orders for delete
to authenticated
using ((select private.is_admin((select auth.uid()))));

grant usage on schema public to anon, authenticated;
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.orders to authenticated;

-- Promove ou remove um administrador. Apenas um administrador ativo pode chamar.
create or replace function public.set_admin_by_email(
  target_email text,
  target_name text default 'Administrador',
  enabled boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_user auth.users%rowtype;
begin
  if not private.is_admin(auth.uid()) then
    raise exception 'Acesso administrativo negado';
  end if;

  select * into target_user
  from auth.users
  where lower(email) = lower(trim(target_email));

  if target_user.id is null then
    raise exception 'Este e-mail precisa criar uma conta na loja antes de virar administrador';
  end if;

  if enabled then
    insert into public.admin_users (user_id, email, name, active)
    values (target_user.id, lower(target_user.email), coalesce(nullif(trim(target_name), ''), 'Administrador'), true)
    on conflict (user_id) do update
      set email = excluded.email, name = excluded.name, active = true;
  else
    if target_user.id = auth.uid() then
      raise exception 'Você não pode remover o próprio acesso';
    end if;
    delete from public.admin_users where user_id = target_user.id;
  end if;

  return jsonb_build_object('email', lower(target_user.email), 'enabled', enabled);
end;
$$;

revoke all on function public.set_admin_by_email(text, text, boolean) from public, anon;
grant execute on function public.set_admin_by_email(text, text, boolean) to authenticated;

-- Ativa automaticamente o administrador principal, mesmo quando a conta
-- for criada depois que esta migração já tiver sido aplicada.
create or replace function private.bootstrap_primary_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(new.email) = 'rickpedrinha@sempreceub.com' then
    insert into public.admin_users (user_id, email, name, active)
    values (new.id, lower(new.email), 'Rick Pedrinha', true)
    on conflict (user_id) do update
      set email = excluded.email, name = excluded.name, active = true;
  end if;
  return new;
end;
$$;

revoke all on function private.bootstrap_primary_admin() from public, anon, authenticated;

drop trigger if exists bootstrap_primary_admin_after_auth_user on auth.users;
create trigger bootstrap_primary_admin_after_auth_user
after insert or update of email on auth.users
for each row execute function private.bootstrap_primary_admin();

-- Mantém a conta administrativa original ativa.
insert into public.admin_users (user_id, email, name, active)
select id, lower(email), 'Rick Pedrinha', true
from auth.users
where lower(email) = 'rickpedrinha@sempreceub.com'
on conflict (user_id) do update set active = true;

-- Habilita eventos de INSERT/UPDATE/DELETE dos pedidos no Realtime.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;
