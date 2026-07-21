-- Shared product content and administrator-managed photo/video uploads.

create table if not exists public.catalog_products (
  id text primary key,
  sku text not null unique,
  name text not null check (length(trim(name)) between 3 and 150),
  description text not null check (length(trim(description)) between 10 and 2000),
  tag text not null default '',
  base_price numeric(10,2) not null check (base_price > 0),
  image_white_url text not null,
  image_black_url text not null,
  video_url text,
  colors text[] not null default array['Branco', 'Preto'],
  sizes text[] not null default array['P', 'M', 'G', 'GG'],
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists catalog_products_touch_updated_at on public.catalog_products;
create trigger catalog_products_touch_updated_at
before update on public.catalog_products
for each row execute function public.touch_catalog_updated_at();

alter table public.catalog_products enable row level security;

drop policy if exists "public_read_active_catalog_products" on public.catalog_products;
create policy "public_read_active_catalog_products"
on public.catalog_products for select
to anon, authenticated
using (active = true or (select private.is_admin((select auth.uid()))));

drop policy if exists "admins_manage_catalog_products" on public.catalog_products;
create policy "admins_manage_catalog_products"
on public.catalog_products for all
to authenticated
using ((select private.is_admin((select auth.uid()))))
with check ((select private.is_admin((select auth.uid()))));

grant select on public.catalog_products to anon, authenticated;
grant insert, update, delete on public.catalog_products to authenticated;

insert into public.catalog_products (
  id, sku, name, description, tag, base_price,
  image_white_url, image_black_url, video_url, colors, sizes, active
) values
  (
    'quem-protege', 'MAR-0001', 'Moletom "Quem Protege Não Dorme"',
    'Moletom premium com capuz e bolso canguru, produzido em algodão de alta gramatura de toque macio. Estampa frontal artística combinando folhas de Espada de São Jorge em tons verdes orgânicos com tipografia autoral exclusiva. Símbolo de proteção, pertencimento e força espiritual que expressa a cultura popular brasileira.',
    'Mais Vendido', 289.90,
    'assets/hoodie_quem_protege_branco.jpg', 'assets/hoodie_quem_protege_preto.jpg', null,
    array['Branco', 'Preto'], array['P', 'M', 'G', 'GG'], true
  ),
  (
    'maria', 'MAR-0002', 'Moletom "MARIA"',
    'Moletom de alta qualidade com corte streetwear contemporâneo. A estampa traz a icônica silhueta de uma mulher negra com cabelo afro e flor vermelha exuberante, celebrando a identidade, força e legado das mulheres brasileiras. Uma peça de alta costura com significado social e estético.',
    'Coleção Raízes', 299.90,
    'assets/hoodie_maria_branco.jpg', 'assets/hoodie_maria_preto.jpg', null,
    array['Branco', 'Preto'], array['P', 'M', 'G', 'GG'], true
  )
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'catalog_products'
  ) then
    alter publication supabase_realtime add table public.catalog_products;
  end if;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-media', 'product-media', true, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_read_product_media" on storage.objects;
create policy "public_read_product_media"
on storage.objects for select
to public
using (bucket_id = 'product-media');

drop policy if exists "admins_upload_product_media" on storage.objects;
create policy "admins_upload_product_media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-media' and (select private.is_admin((select auth.uid()))));

drop policy if exists "admins_update_product_media" on storage.objects;
create policy "admins_update_product_media"
on storage.objects for update
to authenticated
using (bucket_id = 'product-media' and (select private.is_admin((select auth.uid()))))
with check (bucket_id = 'product-media' and (select private.is_admin((select auth.uid()))));

drop policy if exists "admins_delete_product_media" on storage.objects;
create policy "admins_delete_product_media"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-media' and (select private.is_admin((select auth.uid()))));

-- Orders keep the product name that was active when the purchase was created.
create or replace function private.sync_order_product_names()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item jsonb;
  v_items jsonb := '[]'::jsonb;
  v_name text;
begin
  if jsonb_typeof(new.order_data -> 'items') = 'array' then
    for v_item in select value from jsonb_array_elements(new.order_data -> 'items') loop
      select name into v_name
      from public.catalog_products
      where id = v_item ->> 'productId' and active = true;
      if v_name is not null then
        v_item := jsonb_set(v_item, '{name}', to_jsonb(v_name), true);
      end if;
      v_items := v_items || jsonb_build_array(v_item);
    end loop;
    new.order_data := jsonb_set(new.order_data, '{items}', v_items, true);
  end if;
  return new;
end;
$$;

revoke all on function private.sync_order_product_names() from public, anon, authenticated;
drop trigger if exists orders_sync_product_names on public.orders;
create trigger orders_sync_product_names
before insert on public.orders
for each row execute function private.sync_order_product_names();
