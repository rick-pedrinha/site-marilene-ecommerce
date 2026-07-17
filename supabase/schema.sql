-- Marilene: autenticação, equipe, pedidos e chat compartilhado
-- Execute este arquivo uma vez no SQL Editor do projeto Supabase.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('customer', 'seller', 'admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default '',
  phone text not null default '',
  cpf text not null default '',
  cep text not null default '',
  state text not null default '',
  city text not null default '',
  street text not null default '',
  number text not null default '',
  neighborhood text not null default '',
  complement text not null default '',
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, phone, cpf, role)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'cpf', ''),
    case
      when lower(coalesce(new.email, '')) in (
        'contato.marilene.bore@gmail.com',
        'rickpedrinha@sempreceub.com'
      )
        then 'admin'::public.app_role
      else 'customer'::public.app_role
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    name = excluded.name,
    phone = excluded.phone,
    cpf = excluded.cpf;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email, raw_user_meta_data on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.profiles (id, email, name, phone, cpf, role)
select
  id,
  lower(coalesce(email, '')),
  coalesce(raw_user_meta_data ->> 'name', ''),
  coalesce(raw_user_meta_data ->> 'phone', ''),
  coalesce(raw_user_meta_data ->> 'cpf', ''),
  case
    when lower(coalesce(email, '')) in (
      'contato.marilene.bore@gmail.com',
      'rickpedrinha@sempreceub.com'
    )
      then 'admin'::public.app_role
    else 'customer'::public.app_role
  end
from auth.users
on conflict (id) do nothing;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'seller')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_user_role(target_user_id uuid, new_role public.app_role)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Apenas administradores podem alterar funções.';
  end if;
  update public.profiles
  set role = new_role, updated_at = now()
  where id = target_user_id;
end;
$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  user_id uuid not null references auth.users(id) on delete restrict,
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric(12,2) not null default 0,
  shipping_cost numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  total_price numeric(12,2) not null default 0,
  shipping_method text not null default '',
  payment_method text not null default '',
  status text not null default 'pending' check (status in ('pending', 'preparing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  customer_name text not null default '',
  customer_email text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_updated_at_idx on public.conversations(updated_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete restrict,
  sender_type text not null check (sender_type in ('client', 'staff')),
  sender_name text not null default '',
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_created_idx
  on public.messages(conversation_id, created_at);

create or replace function public.touch_conversation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists on_message_created on public.messages;
create trigger on_message_created
  after insert on public.messages
  for each row execute procedure public.touch_conversation();

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
using (id = auth.uid() or public.is_staff());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders for select to authenticated
using (user_id = auth.uid() or public.is_staff());

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists orders_update_staff on public.orders;
create policy orders_update_staff on public.orders for update to authenticated
using (public.is_staff()) with check (public.is_staff());

drop policy if exists conversations_select on public.conversations;
create policy conversations_select on public.conversations for select to authenticated
using (user_id = auth.uid() or public.is_staff());

drop policy if exists conversations_insert on public.conversations;
create policy conversations_insert on public.conversations for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists conversations_update on public.conversations;
create policy conversations_update on public.conversations for update to authenticated
using (user_id = auth.uid() or public.is_staff())
with check (user_id = auth.uid() or public.is_staff());

drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages for select to authenticated
using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id
      and (c.user_id = auth.uid() or public.is_staff())
  )
);

drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert to authenticated
with check (
  sender_id = auth.uid()
  and (
    (sender_type = 'client' and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    ))
    or (sender_type = 'staff' and public.is_staff())
  )
);

revoke all on public.profiles, public.orders, public.conversations, public.messages from anon;
grant select on public.profiles, public.orders, public.conversations, public.messages to authenticated;
grant insert on public.orders, public.conversations, public.messages to authenticated;
grant update (name, phone, cpf, cep, state, city, street, number, neighborhood, complement, updated_at)
  on public.profiles to authenticated;
grant update (status, updated_at) on public.orders to authenticated;
grant update (customer_name, customer_email, updated_at) on public.conversations to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.set_user_role(uuid, public.app_role) to authenticated;

do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter publication supabase_realtime add table public.conversations;
exception when duplicate_object then null;
end $$;
