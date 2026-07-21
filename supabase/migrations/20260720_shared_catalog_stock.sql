-- Catálogo de produtos e preços compartilhado com Realtime para todos os usuários e administradores.
-- Execute este arquivo no SQL Editor do projeto Supabase.

create table if not exists public.catalog_stock (
  key text primary key,
  product_id text not null,
  color text not null,
  size text not null,
  price numeric(10, 2) not null check (price > 0),
  qty integer not null check (qty >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_stock_product_id_idx on public.catalog_stock(product_id);

create or replace function public.touch_catalog_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists catalog_stock_touch_updated_at on public.catalog_stock;
create trigger catalog_stock_touch_updated_at
before update on public.catalog_stock
for each row execute function public.touch_catalog_updated_at();

alter table public.catalog_stock enable row level security;

-- Qualquer usuário (visitante ou autenticado) pode ver os preços e estoque atualizados em tempo real
drop policy if exists "public_read_catalog_stock" on public.catalog_stock;
create policy "public_read_catalog_stock"
on public.catalog_stock for select
to anon, authenticated
using (true);

-- Apenas administradores ativos podem alterar preços e estoque
drop policy if exists "admins_manage_catalog_stock" on public.catalog_stock;
create policy "admins_manage_catalog_stock"
on public.catalog_stock for all
to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));

grant usage on schema public to anon, authenticated;
grant select on public.catalog_stock to anon, authenticated;
grant select, insert, update, delete on public.catalog_stock to authenticated;

-- Habilita eventos de alteração de preço e estoque no Supabase Realtime
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'catalog_stock'
  ) then
    alter publication supabase_realtime add table public.catalog_stock;
  end if;
end $$;

-- Carga inicial das 16 variações de casacos se a tabela estiver vazia
insert into public.catalog_stock (key, product_id, color, size, price, qty) values
  ('quem-protege_Branco_P', 'quem-protege', 'Branco', 'P', 289.90, 15),
  ('quem-protege_Branco_M', 'quem-protege', 'Branco', 'M', 289.90, 15),
  ('quem-protege_Branco_G', 'quem-protege', 'Branco', 'G', 289.90, 15),
  ('quem-protege_Branco_GG', 'quem-protege', 'Branco', 'GG', 289.90, 15),
  ('quem-protege_Preto_P', 'quem-protege', 'Preto', 'P', 289.90, 15),
  ('quem-protege_Preto_M', 'quem-protege', 'Preto', 'M', 289.90, 15),
  ('quem-protege_Preto_G', 'quem-protege', 'Preto', 'G', 289.90, 15),
  ('quem-protege_Preto_GG', 'quem-protege', 'Preto', 'GG', 289.90, 15),
  ('maria_Branco_P', 'maria', 'Branco', 'P', 299.90, 15),
  ('maria_Branco_M', 'maria', 'Branco', 'M', 299.90, 15),
  ('maria_Branco_G', 'maria', 'Branco', 'G', 299.90, 15),
  ('maria_Branco_GG', 'maria', 'Branco', 'GG', 299.90, 15),
  ('maria_Preto_P', 'maria', 'Preto', 'P', 299.90, 15),
  ('maria_Preto_M', 'maria', 'Preto', 'M', 299.90, 15),
  ('maria_Preto_G', 'maria', 'Preto', 'G', 299.90, 15),
  ('maria_Preto_GG', 'maria', 'Preto', 'GG', 299.90, 15)
on conflict (key) do nothing;
