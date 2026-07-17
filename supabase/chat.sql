-- Chat compartilhado da loja Marilene com administrador autenticado.
-- Execute todo este arquivo no SQL Editor do Supabase.

create table if not exists public.chat_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.chat_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.chat_profiles (id, email, role)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    case
      when lower(coalesce(new.email, '')) = 'rickpedrinha@sempreceub.com'
        then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    role = excluded.role;
  return new;
end;
$$;

drop trigger if exists on_chat_auth_user_created on auth.users;
create trigger on_chat_auth_user_created
  after insert or update of email on auth.users
  for each row execute procedure public.chat_handle_new_user();

insert into public.chat_profiles (id, email, role)
select
  id,
  lower(coalesce(email, '')),
  case
    when lower(coalesce(email, '')) = 'rickpedrinha@sempreceub.com'
      then 'admin'
    else 'customer'
  end
from auth.users
on conflict (id) do update set
  email = excluded.email,
  role = excluded.role;

create or replace function public.chat_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  client_token uuid not null unique,
  customer_name text not null default 'Cliente',
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('client', 'admin')),
  sender_name text not null default '',
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists chat_conversations_updated_idx
  on public.chat_conversations(updated_at desc);
create index if not exists chat_messages_conversation_idx
  on public.chat_messages(conversation_id, created_at);

alter table public.chat_profiles enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists chat_profiles_own_select on public.chat_profiles;
create policy chat_profiles_own_select
  on public.chat_profiles for select to authenticated
  using (id = auth.uid());

revoke all on public.chat_profiles from anon;
revoke all on public.chat_conversations from anon, authenticated;
revoke all on public.chat_messages from anon, authenticated;
grant select on public.chat_profiles to authenticated;

create or replace function public.chat_start(
  p_client_token uuid,
  p_customer_name text default 'Cliente'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conversation_id uuid;
begin
  if p_client_token is null then
    raise exception 'Token do cliente inválido.';
  end if;

  insert into public.chat_conversations (client_token, customer_name)
  values (
    p_client_token,
    left(coalesce(nullif(trim(p_customer_name), ''), 'Cliente'), 100)
  )
  on conflict (client_token) do update set
    customer_name = coalesce(
      nullif(trim(excluded.customer_name), ''),
      public.chat_conversations.customer_name
    ),
    updated_at = now()
  returning id into v_conversation_id;

  return v_conversation_id;
end;
$$;

create or replace function public.chat_send_client(
  p_client_token uuid,
  p_customer_name text,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conversation_id uuid;
  v_message_id uuid;
  v_body text := trim(coalesce(p_body, ''));
begin
  if char_length(v_body) < 1 or char_length(v_body) > 1000 then
    raise exception 'A mensagem deve ter entre 1 e 1000 caracteres.';
  end if;

  v_conversation_id := public.chat_start(p_client_token, p_customer_name);

  insert into public.chat_messages (
    conversation_id, sender_type, sender_name, body
  ) values (
    v_conversation_id,
    'client',
    left(coalesce(nullif(trim(p_customer_name), ''), 'Cliente'), 100),
    v_body
  ) returning id into v_message_id;

  update public.chat_conversations
  set updated_at = now(), status = 'open'
  where id = v_conversation_id;

  return v_message_id;
end;
$$;

create or replace function public.chat_get_client(p_client_token uuid)
returns table (
  message_id uuid,
  sender_type text,
  sender_name text,
  body text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select m.id, m.sender_type, m.sender_name, m.body, m.created_at
  from public.chat_messages m
  join public.chat_conversations c on c.id = m.conversation_id
  where c.client_token = p_client_token
  order by m.created_at asc;
$$;

create or replace function public.chat_admin_conversations()
returns table (
  conversation_id uuid,
  customer_name text,
  status text,
  created_at timestamptz,
  updated_at timestamptz,
  last_message text
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.chat_is_admin() then
    raise exception 'Acesso administrativo negado.' using errcode = '42501';
  end if;

  return query
  select
    c.id,
    c.customer_name,
    c.status,
    c.created_at,
    c.updated_at,
    coalesce((
      select m.body
      from public.chat_messages m
      where m.conversation_id = c.id
      order by m.created_at desc
      limit 1
    ), '')
  from public.chat_conversations c
  order by c.updated_at desc;
end;
$$;

create or replace function public.chat_admin_messages(p_conversation_id uuid)
returns table (
  message_id uuid,
  sender_type text,
  sender_name text,
  body text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.chat_is_admin() then
    raise exception 'Acesso administrativo negado.' using errcode = '42501';
  end if;

  return query
  select m.id, m.sender_type, m.sender_name, m.body, m.created_at
  from public.chat_messages m
  where m.conversation_id = p_conversation_id
  order by m.created_at asc;
end;
$$;

create or replace function public.chat_send_admin(
  p_conversation_id uuid,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_message_id uuid;
  v_body text := trim(coalesce(p_body, ''));
begin
  if not public.chat_is_admin() then
    raise exception 'Acesso administrativo negado.' using errcode = '42501';
  end if;

  if char_length(v_body) < 1 or char_length(v_body) > 1000 then
    raise exception 'A mensagem deve ter entre 1 e 1000 caracteres.';
  end if;

  if not exists (
    select 1 from public.chat_conversations c where c.id = p_conversation_id
  ) then
    raise exception 'Conversa não encontrada.';
  end if;

  insert into public.chat_messages (
    conversation_id, sender_type, sender_name, body
  ) values (
    p_conversation_id, 'admin', 'Rick', v_body
  ) returning id into v_message_id;

  update public.chat_conversations
  set updated_at = now()
  where id = p_conversation_id;

  return v_message_id;
end;
$$;

revoke all on function public.chat_is_admin() from public;
revoke all on function public.chat_start(uuid, text) from public;
revoke all on function public.chat_send_client(uuid, text, text) from public;
revoke all on function public.chat_get_client(uuid) from public;
revoke all on function public.chat_admin_conversations() from public;
revoke all on function public.chat_admin_messages(uuid) from public;
revoke all on function public.chat_send_admin(uuid, text) from public;

grant execute on function public.chat_is_admin() to authenticated;
grant execute on function public.chat_start(uuid, text) to anon, authenticated;
grant execute on function public.chat_send_client(uuid, text, text) to anon, authenticated;
grant execute on function public.chat_get_client(uuid) to anon, authenticated;
grant execute on function public.chat_admin_conversations() to authenticated;
grant execute on function public.chat_admin_messages(uuid) to authenticated;
grant execute on function public.chat_send_admin(uuid, text) to authenticated;
