-- Criação segura de pedidos e baixa automática de estoque após confirmação do Pix.

create table if not exists public.shipping_rates (
  state text primary key check (state ~ '^[A-Z]{2}$'),
  pac_price numeric(10,2) not null check (pac_price >= 0),
  sedex_price numeric(10,2) not null check (sedex_price >= 0),
  pac_days integer not null check (pac_days > 0),
  sedex_days integer not null check (sedex_days > 0)
);

alter table public.shipping_rates enable row level security;
drop policy if exists "public_read_shipping_rates" on public.shipping_rates;
create policy "public_read_shipping_rates"
on public.shipping_rates for select to anon, authenticated using (true);
grant select on public.shipping_rates to anon, authenticated;
revoke insert, update, delete on public.shipping_rates from anon, authenticated;

insert into public.shipping_rates (state, pac_price, sedex_price, pac_days, sedex_days) values
  ('DF',12.00,18.00,2,1), ('SP',21.50,37.90,5,2), ('RJ',22.90,39.50,6,2),
  ('MG',20.80,36.20,5,2), ('ES',23.00,41.00,6,3), ('PR',24.50,44.00,6,3),
  ('SC',25.10,46.50,7,3), ('RS',26.80,49.00,7,3), ('GO',17.50,31.00,4,2),
  ('MT',19.90,35.80,5,2), ('MS',18.70,33.40,5,2), ('BA',26.00,46.00,6,3),
  ('PE',28.50,51.00,7,3), ('CE',29.20,53.00,7,3), ('RN',29.80,54.50,8,4),
  ('PB',28.90,52.00,7,3), ('AL',28.10,50.50,7,3), ('SE',27.60,49.80,7,3),
  ('PI',29.90,54.00,8,4), ('MA',31.20,56.50,8,4), ('AM',35.00,62.00,10,4),
  ('PA',33.50,59.80,9,4), ('AC',37.00,66.50,11,5), ('RO',34.20,61.00,9,4),
  ('RR',39.00,71.00,12,5), ('AP',36.50,64.80,10,4), ('TO',25.80,44.50,7,3)
on conflict (state) do update set
  pac_price = excluded.pac_price, sedex_price = excluded.sedex_price,
  pac_days = excluded.pac_days, sedex_days = excluded.sedex_days;

create sequence if not exists public.order_number_seq start with 50000;
revoke all on sequence public.order_number_seq from public, anon, authenticated;

create or replace function public.create_store_order(
  p_customer jsonb,
  p_items jsonb,
  p_shipping_method text
)
returns setof public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_state text := upper(trim(coalesce(p_customer ->> 'state', '')));
  v_method text := upper(trim(coalesce(p_shipping_method, '')));
  v_shipping numeric(10,2);
  v_subtotal numeric(12,2) := 0;
  v_total numeric(12,2);
  v_order_id text;
  v_items jsonb := '[]'::jsonb;
  v_customer jsonb;
  v_raw jsonb;
  v_product_id text;
  v_color text;
  v_size text;
  v_key text;
  v_name text;
  v_qty integer;
  v_price numeric(10,2);
  v_available integer;
  v_digits text;
begin
  if v_user_id is null or v_email = '' then
    raise exception 'Faça login antes de finalizar o pedido';
  end if;
  if jsonb_typeof(p_customer) <> 'object' or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 20 then
    raise exception 'Dados do pedido inválidos';
  end if;
  if v_method not in ('PAC', 'SEDEX') then raise exception 'Forma de envio inválida'; end if;

  select case when v_method = 'PAC' then pac_price else sedex_price end
  into v_shipping from public.shipping_rates where state = v_state;
  if v_shipping is null then raise exception 'Estado de entrega inválido'; end if;

  if length(trim(coalesce(p_customer ->> 'name', ''))) < 3
     or length(trim(coalesce(p_customer ->> 'street', ''))) < 2
     or length(trim(coalesce(p_customer ->> 'number', ''))) < 1
     or length(trim(coalesce(p_customer ->> 'neighborhood', ''))) < 2
     or length(trim(coalesce(p_customer ->> 'city', ''))) < 2 then
    raise exception 'Preencha os dados de entrega corretamente';
  end if;
  v_digits := regexp_replace(coalesce(p_customer ->> 'cep', ''), '[^0-9]', '', 'g');
  if length(v_digits) <> 8 then raise exception 'CEP inválido'; end if;
  v_digits := regexp_replace(coalesce(p_customer ->> 'phone', ''), '[^0-9]', '', 'g');
  if length(v_digits) not in (10, 11) then raise exception 'Telefone inválido'; end if;
  v_digits := regexp_replace(coalesce(p_customer ->> 'cpf', ''), '[^0-9]', '', 'g');
  if length(v_digits) <> 11 or v_digits ~ '^([0-9])\1{10}$' then raise exception 'CPF inválido'; end if;

  for v_raw in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := trim(coalesce(v_raw ->> 'productId', ''));
    v_color := trim(coalesce(v_raw ->> 'color', ''));
    v_size := trim(coalesce(v_raw ->> 'size', ''));
    begin v_qty := (v_raw ->> 'qty')::integer;
    exception when others then raise exception 'Quantidade inválida'; end;
    if v_qty < 1 or v_qty > 10 then raise exception 'Quantidade inválida'; end if;
    v_key := v_product_id || '_' || v_color || '_' || v_size;

    select price, qty into v_price, v_available
    from public.catalog_stock where key = v_key for update;
    if v_price is null then raise exception 'Variação de produto inválida'; end if;
    if v_available < v_qty then raise exception 'Estoque insuficiente para %', v_key; end if;

    v_name := case v_product_id
      when 'quem-protege' then 'Moletom "Quem Protege Não Dorme"'
      when 'maria' then 'Moletom "MARIA"'
      else null
    end;
    if v_name is null then raise exception 'Produto inválido'; end if;
    v_subtotal := v_subtotal + (v_price * v_qty);
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'productId', v_product_id, 'name', v_name, 'color', v_color,
      'size', v_size, 'qty', v_qty, 'price', v_price
    ));
  end loop;

  v_total := v_subtotal + v_shipping;
  loop
    v_order_id := '#MN-' || lpad(nextval('public.order_number_seq')::text, 5, '0');
    exit when not exists (select 1 from public.orders where id = v_order_id);
  end loop;

  v_customer := jsonb_build_object(
    'name', left(trim(p_customer ->> 'name'), 150), 'email', v_email,
    'phone', left(trim(p_customer ->> 'phone'), 30), 'cpf', left(trim(p_customer ->> 'cpf'), 20),
    'cep', left(trim(p_customer ->> 'cep'), 12), 'state', v_state,
    'city', left(trim(p_customer ->> 'city'), 120), 'street', left(trim(p_customer ->> 'street'), 200),
    'number', left(trim(p_customer ->> 'number'), 30),
    'neighborhood', left(trim(p_customer ->> 'neighborhood'), 120),
    'complement', left(trim(coalesce(p_customer ->> 'complement', '')), 200)
  );

  insert into public.orders (id, user_id, account_email, order_data, payment_status, status)
  values (
    v_order_id, v_user_id, v_email,
    jsonb_build_object(
      'id', v_order_id, 'accountEmail', v_email, 'customer', v_customer,
      'items', v_items, 'subtotal', v_subtotal, 'shippingCost', v_shipping,
      'discount', 0, 'totalPrice', v_total, 'shippingMethod', v_method,
      'paymentMethod', 'pix', 'paymentStatus', 'pending',
      'date', now(), 'status', 'pending'
    ),
    'pending', 'pending'
  );

  return query select * from public.orders where id = v_order_id;
end;
$$;

revoke all on function public.create_store_order(jsonb, jsonb, text) from public, anon;
grant execute on function public.create_store_order(jsonb, jsonb, text) to authenticated;
revoke insert on public.orders from authenticated;

create or replace function private.sync_inventory_on_payment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_item jsonb;
  v_key text;
  v_qty integer;
begin
  if old.payment_status is distinct from 'approved' and new.payment_status = 'approved' then
    for v_item in select value from jsonb_array_elements(new.order_data -> 'items') loop
      v_key := (v_item ->> 'productId') || '_' || (v_item ->> 'color') || '_' || (v_item ->> 'size');
      v_qty := (v_item ->> 'qty')::integer;
      update public.catalog_stock set qty = qty - v_qty where key = v_key and qty >= v_qty;
      if not found then raise exception 'Estoque insuficiente para confirmar o Pix de %', v_key; end if;
    end loop;
  elsif old.payment_status = 'approved' and new.payment_status is distinct from 'approved' then
    for v_item in select value from jsonb_array_elements(old.order_data -> 'items') loop
      v_key := (v_item ->> 'productId') || '_' || (v_item ->> 'color') || '_' || (v_item ->> 'size');
      v_qty := (v_item ->> 'qty')::integer;
      update public.catalog_stock set qty = qty + v_qty where key = v_key;
    end loop;
  end if;
  return new;
end;
$$;

revoke all on function private.sync_inventory_on_payment() from public, anon, authenticated;
drop trigger if exists orders_sync_inventory_on_payment on public.orders;
create trigger orders_sync_inventory_on_payment
before update of payment_status on public.orders
for each row execute function private.sync_inventory_on_payment();

create or replace function private.protect_paid_order_contents()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.id is distinct from old.id or new.user_id is distinct from old.user_id
     or new.account_email is distinct from old.account_email then
    raise exception 'Identidade do pedido não pode ser alterada';
  end if;
  if old.payment_status = 'approved' and new.payment_status = 'approved' and (
     new.order_data -> 'items' is distinct from old.order_data -> 'items'
     or new.order_data -> 'customer' is distinct from old.order_data -> 'customer'
     or new.order_data -> 'subtotal' is distinct from old.order_data -> 'subtotal'
     or new.order_data -> 'shippingCost' is distinct from old.order_data -> 'shippingCost'
     or new.order_data -> 'discount' is distinct from old.order_data -> 'discount'
     or new.order_data -> 'totalPrice' is distinct from old.order_data -> 'totalPrice'
  ) then
    raise exception 'Pedido pago não pode ter itens ou valores alterados';
  end if;
  return new;
end;
$$;

revoke all on function private.protect_paid_order_contents() from public, anon, authenticated;
drop trigger if exists orders_protect_paid_contents on public.orders;
create trigger orders_protect_paid_contents
before update on public.orders
for each row execute function private.protect_paid_order_contents();
