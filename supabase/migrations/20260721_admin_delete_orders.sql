-- Permanent order deletion is exposed only through an administrator-only RPC.
-- Confirmed orders return their reserved inventory before removal.

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

  delete from public.order_email_notifications where order_id = target_order.id;
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
