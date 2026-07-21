-- Administração autônoma e transferência segura de responsabilidade.
-- Remove o administrador fixo original e permite que um ADM transfira o acesso,
-- sem jamais deixar a loja sem pelo menos um administrador ativo.

drop trigger if exists bootstrap_primary_admin_after_auth_user on auth.users;
drop function if exists private.bootstrap_primary_admin();

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
  target_is_self boolean;
  remaining_admins integer;
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

  target_is_self := target_user.id = auth.uid();

  if enabled then
    insert into public.admin_users (user_id, email, name, active)
    values (
      target_user.id,
      lower(target_user.email),
      coalesce(nullif(trim(target_name), ''), 'Administrador'),
      true
    )
    on conflict (user_id) do update
      set email = excluded.email, name = excluded.name, active = true;
  else
    select count(*) into remaining_admins
    from public.admin_users
    where active = true and user_id <> target_user.id;

    if remaining_admins < 1 then
      raise exception 'Cadastre outro administrador antes de remover o último acesso da loja';
    end if;

    delete from public.admin_users where user_id = target_user.id;
  end if;

  return jsonb_build_object(
    'email', lower(target_user.email),
    'enabled', enabled,
    'self_removed', (not enabled and target_is_self)
  );
end;
$$;

revoke all on function public.set_admin_by_email(text, text, boolean) from public, anon;
grant execute on function public.set_admin_by_email(text, text, boolean) to authenticated;

create or replace function private.only_admin_changes_payment_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.payment_status is distinct from old.payment_status
     and coalesce(auth.role(), '') = 'authenticated'
     and not private.is_admin(auth.uid()) then
    raise exception 'Apenas administradores podem confirmar ou alterar pagamentos';
  end if;
  return new;
end;
$$;

revoke all on function private.only_admin_changes_payment_status() from public, anon, authenticated;
drop trigger if exists orders_only_admin_changes_payment on public.orders;
create trigger orders_only_admin_changes_payment
before update of payment_status on public.orders
for each row execute function private.only_admin_changes_payment_status();
