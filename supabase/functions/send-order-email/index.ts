import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
};

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function money(value: unknown) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return Response.json({ error: 'Método não permitido' }, { status: 405, headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const brevoApiKey = Deno.env.get('BREVO_API_KEY') || '';
  const emailFrom = Deno.env.get('EMAIL_FROM') || '';
  const authorization = request.headers.get('Authorization') || '';

  if (!brevoApiKey || !emailFrom) {
    return Response.json({ error: 'Serviço de e-mail ainda não configurado' }, { status: 503, headers: corsHeaders });
  }

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return Response.json({ error: 'Sessão inválida' }, { status: 401, headers: corsHeaders });

  const { data: admin } = await serviceClient
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('active', true)
    .maybeSingle();
  if (!admin) return Response.json({ error: 'Acesso administrativo negado' }, { status: 403, headers: corsHeaders });

  const { orderId } = await request.json().catch(() => ({ orderId: '' }));
  if (!orderId) return Response.json({ error: 'Pedido não informado' }, { status: 400, headers: corsHeaders });

  const { data: order, error: orderError } = await serviceClient
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
  if (orderError || !order) return Response.json({ error: 'Pedido não encontrado' }, { status: 404, headers: corsHeaders });
  if (order.payment_status !== 'approved') {
    return Response.json({ error: 'O pagamento ainda não está confirmado' }, { status: 409, headers: corsHeaders });
  }

  const eventType = 'payment_confirmed';
  const { data: existing } = await serviceClient
    .from('order_email_notifications')
    .select('*')
    .eq('order_id', order.id)
    .eq('event_type', eventType)
    .maybeSingle();
  if (existing?.status === 'sent') return Response.json({ ok: true, alreadySent: true }, { headers: corsHeaders });
  if (existing?.status === 'pending'
      && Date.now() - new Date(existing.updated_at).getTime() < 5 * 60 * 1000) {
    return Response.json({ ok: true, processing: true }, { headers: corsHeaders });
  }

  if (existing) {
    await serviceClient.from('order_email_notifications').update({
      status: 'pending', attempts: existing.attempts + 1, last_error: null,
    }).eq('id', existing.id);
  } else {
    const { error: insertError } = await serviceClient.from('order_email_notifications').insert({
      order_id: order.id,
      event_type: eventType,
      recipient_email: order.account_email,
      status: 'pending',
    });
    if (insertError?.code === '23505') return Response.json({ ok: true, processing: true }, { headers: corsHeaders });
    if (insertError) return Response.json({ error: 'Não foi possível registrar a notificação' }, { status: 500, headers: corsHeaders });
  }

  const orderData = order.order_data || {};
  const customerName = orderData.customer?.name || order.account_email.split('@')[0];
  const items = Array.isArray(orderData.items) ? orderData.items : [];
  const itemRows = items.map((item: Record<string, unknown>) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(item.name)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(item.color)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(item.size)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${escapeHtml(item.qty)}</td>
    </tr>`).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#222">
      <div style="background:#111;color:#fff;padding:24px;text-align:center"><h1 style="margin:0;font-size:24px">MARILENE</h1></div>
      <div style="padding:28px;border:1px solid #eee">
        <h2 style="margin-top:0">Pagamento confirmado</h2>
        <p>Olá, ${escapeHtml(customerName)}!</p>
        <p>Recebemos o pagamento do pedido <strong>${escapeHtml(order.id)}</strong>. Agora ele seguirá para preparação.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <thead><tr><th style="padding:8px;text-align:left">Produto</th><th>Cor</th><th>Tamanho</th><th>Qtd.</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p style="font-size:18px"><strong>Total: ${money(orderData.totalPrice)}</strong></p>
        <p>Você pode acompanhar o andamento em <strong>Meus Pedidos</strong> no site.</p>
        <p style="color:#666;font-size:12px;margin-top:28px">Este é um e-mail automático sobre uma compra realizada na loja Marilene.</p>
      </div>
    </div>`;

  const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': brevoApiKey },
    body: JSON.stringify({
      sender: { name: 'Marilene', email: emailFrom },
      replyTo: { name: 'Marilene', email: emailFrom },
      to: [{ email: order.account_email, name: customerName }],
      subject: `Pagamento confirmado — pedido ${order.id}`,
      htmlContent: html,
      tags: ['pagamento-confirmado'],
    }),
  });
  const providerData = await brevoResponse.json().catch(() => ({}));

  if (!brevoResponse.ok) {
    const providerError = String(providerData?.message || 'Falha no provedor de e-mail').slice(0, 1000);
    await serviceClient.from('order_email_notifications').update({ status: 'failed', last_error: providerError })
      .eq('order_id', order.id).eq('event_type', eventType);
    return Response.json({ error: 'Pagamento confirmado, mas o e-mail não foi enviado' }, { status: 502, headers: corsHeaders });
  }

  await serviceClient.from('order_email_notifications').update({
    status: 'sent', provider_message_id: providerData?.messageId || null, sent_at: new Date().toISOString(), last_error: null,
  }).eq('order_id', order.id).eq('event_type', eventType);

  return Response.json({ ok: true }, { headers: corsHeaders });
});
