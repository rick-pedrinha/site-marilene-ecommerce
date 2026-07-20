# E-commerce Marilene Naumebore 🛍️

E-commerce de moda autoral completo e responsivo, desenvolvido com tecnologias nativas de alta performance, incluindo um Painel Administrativo integrado para controle de vendas, estoque e pedidos.

🔗 **Link do Site Publicado**: [https://rick-pedrinha.github.io/site-marilene-ecommerce/](https://rick-pedrinha.github.io/site-marilene-ecommerce/)

---

## 🌟 Funcionalidades Principais

### 🛒 Loja & Experiência do Cliente
- **Vitrine Interativa**: Catálogo moderno com fotos dos moletons premium **MARIA** e **Quem Protege Não Dorme** (com a estampa da planta Espada de São Jorge).
- **Modal de Detalhes**: Escolha de cor (Branco/Preto) com atualização da imagem de visualização em tempo real, seleção de tamanhos (P, M, G, GG) e controle dinâmico de quantidade baseado no estoque disponível.
- **Carrinho Lateral (Drawer)**: Gerenciador de itens interativo.
- **Carrinho sempre visível**: atalho flutuante com quantidade e valor total em qualquer tela do site.
- **Cálculo de Frete Nacional**: Integração de CEP brasileiro. O site identifica o estado automaticamente e calcula prazos e preços realistas de PAC e SEDEX para todo o Brasil.
- **Checkout Pix**: o cliente finaliza o pedido, copia a chave Pix da loja e acompanha a confirmação do pagamento em sua conta.
- **Meus Pedidos**: clientes conectados recebem um atalho próprio; administradores usam **Minhas Compras** para separar seus pedidos pessoais da gestão geral da loja.
- **Cadastro completo**: nome, contato, CPF e endereço de entrega ficam salvos com segurança na conta e preenchem automaticamente o checkout.

### 📊 Painel Administrativo
- **Dashboard**: Painel geral exibindo Faturamento Bruto, Total de Pedidos, Ticket Médio, Alertas de Estoque Baixo e Gráfico SVG de evolução diária de vendas.
- **Gerenciador de Pedidos**: Tabela com histórico detalhado de compras e alteração de status (Pendente, Preparando, Enviado, Entregue) ou exclusão de registros.
- **Arquivo para Produção**: exportação CSV com uma linha por peça, pronta para abrir no Excel e repassar à equipe que confecciona os casacos.
- **Cancelamentos e Devoluções**: o cliente solicita pelo próprio pedido; produção é bloqueada, devolução e reembolso são acompanhados separadamente e todas as mudanças ficam registradas.
- **Controle de Estoque & Preços**: Edição em tempo real do estoque físico e valor de venda de cada variação (cor + tamanho).

---

## 📁 Tecnologias Utilizadas
- **HTML5** & **CSS3** (CSS Variables, Flexbox, Grid, Glassmorphism, Micro-animações).
- **JavaScript (ES6+)** nativo para gerenciamento de rotas (SPA) e estado de dados.
- **Node.js** (Apenas para o servidor local de desenvolvimento sem dependências externas).
- **Persistência de Dados**: pedidos e contas no Supabase; o `localStorage` mantém apenas cache do catálogo e do carrinho.

---

## 🚀 Como Rodar o Projeto

### Rodar Localmente (Fácil)
1. Certifique-se de ter o **Node.js** instalado na sua máquina.
2. No diretório do projeto, execute o comando:
   ```bash
   npm start
   ```
3. O servidor iniciará na porta `3000` e abrirá automaticamente o navegador no endereço `http://localhost:3000`.

### Publicar Online (GitHub Pages)
1. Suba os arquivos para seu repositório no GitHub.
2. Vá nas configurações do repositório (**Settings**) > **Pages**.
3. Em **Build and deployment**, selecione a branch **`main`** e clique em **Save**.
4. O link público ficará disponível em instantes.

---

## Pagamento direto por Pix

Não há intermediador de pagamento nem taxa de integração. O cliente cria o pedido, copia a chave Pix e paga no aplicativo do próprio banco. O administrador confere a entrada na conta e muda o pagamento para **Pix confirmado** no painel de pedidos.

Antes de publicar, configure no `<head>` do `index.html`:

```html
<meta name="pix-key" content="SUA-CHAVE-PIX">
<meta name="pix-recipient" content="NOME-DO-FAVORECIDO">
```

A chave Pix é pública porque será exibida aos compradores. Senhas bancárias nunca devem ser colocadas no site.

O pagamento é confirmado manualmente; o site não entra na conta Nubank e não consulta o extrato bancário.

## Pedidos compartilhados e múltiplos administradores

1. Abra o projeto `jlmzisqtashbdsppryso` no Supabase.
2. Em **Authentication > Users**, confirme que `rickpedrinha@sempreceub.com` já existe e está com o e-mail confirmado. Se não existir, crie esse usuário antes de continuar.
3. Entre em **SQL Editor**, cole todo o arquivo `supabase/migrations/20260720_shared_orders_and_admins.sql` e execute uma vez. A migração encontra o usuário do passo anterior e ativa o acesso administrativo principal.
4. Em **Authentication > URL Configuration**, use a URL publicada da loja como `Site URL` e adicione a mesma URL em `Redirect URLs`.
5. Cada cliente cria sua própria conta na loja. Os pedidos ficam ligados ao usuário autenticado e só podem ser vistos por ele ou por um administrador ativo.
6. Para liberar o amigo: ele cria uma conta comum, Rick entra no painel, informa o nome e e-mail em **Administradores da Loja** e clica em **Adicionar administrador**.
7. O amigo entra usando a senha dele. Nunca compartilhe a senha principal do Rick.

As alterações de pedido usam Supabase Realtime. Quando um administrador confirma o Pix ou muda o envio, as telas autenticadas abertas recebem a atualização automaticamente.

### Migrações automáticas sem erro técnico no site

O arquivo `.github/workflows/supabase-migrations.yml` aplica automaticamente as migrações pendentes quando uma alteração do banco chega à branch `main`. A automação fica desativada com segurança até os acessos serem configurados uma única vez no GitHub:

1. Em **Settings > Secrets and variables > Actions > Secrets**, crie `SUPABASE_ACCESS_TOKEN` e `SUPABASE_DB_PASSWORD`.
2. Em **Variables**, crie `SUPABASE_AUTOMATION_ENABLED` com o valor `true`.
3. Abra **Actions > Atualizar banco Supabase** e execute **Run workflow** na primeira ativação.

Depois disso, novas migrações são aplicadas automaticamente a cada publicação. Os segredos ficam apenas no GitHub Actions e nunca são enviados ao navegador. Se a atualização ainda estiver em andamento, o formulário de login mostra uma mensagem amigável em vez de detalhes técnicos do banco.

## Cancelamentos, devoluções e reembolsos

A migração `supabase/migrations/20260720_order_cancellations.sql` adiciona o fluxo rastreável de pós-venda. Se a automação do GitHub ainda não estiver ativa, execute esse arquivo uma vez no **SQL Editor** do Supabase depois da migração principal.

- O cliente solicita em **Minha Conta > Meus Pedidos**, com motivo opcional.
- Pedido sem Pix confirmado é cancelado sem gerar reembolso.
- Pedido pago gera reembolso pendente; se já saiu para entrega, a devolução é acompanhada em paralelo.
- Qualquer solicitação sai imediatamente do CSV de produção.
- O administrador registra o recebimento da devolução e o identificador do Pix de reembolso.
- Pedidos não podem ser excluídos; mudanças de estado são gravadas em `order_events`.
- A data de entrega é registrada para controlar a janela de sete dias. Casos de defeito continuam direcionados ao atendimento mesmo depois desse prazo.

## E-mail automático de pagamento confirmado

Quando o administrador marca **Pix confirmado**, a Edge Function `send-order-email` envia uma mensagem transacional ao e-mail da conta que fez o pedido. O envio é idempotente: o mesmo evento não dispara duas mensagens, e cada tentativa fica registrada em `order_email_notifications`.

Configuração única:

1. Crie uma conta gratuita no [Brevo](https://www.brevo.com/) e verifique `Contato.marilene.bore@gmail.com` como remetente.
2. Gere uma chave de API transacional.
3. No GitHub Actions, crie o segredo `BREVO_API_KEY`.
4. Crie as variáveis `EMAIL_FROM` = `Contato.marilene.bore@gmail.com` e `EMAIL_NOTIFICATIONS_ENABLED` = `true`.
5. Execute a migração `supabase/migrations/20260720_order_email_notifications.sql` ou deixe o workflow aplicar automaticamente.
6. Publique novamente o workflow. Ele salva os segredos no Supabase e implanta a Edge Function sem expor a chave no navegador.

Se o provedor estiver indisponível, o Pix permanece confirmado e o administrador recebe um aviso de e-mail pendente. Nunca coloque `BREVO_API_KEY` no `app.js`, no HTML ou em commits.

## Checklist para entregar ao cliente

- Configurar a chave Pix no `index.html`.
- Executar a migração SQL do Supabase.
- Confirmar que o e-mail administrativo principal está em `admin_users`.
- Criar e promover a conta do segundo administrador.
- Publicar os arquivos no GitHub Pages.
- Testar um pedido real de baixo valor: cliente cria conta, fecha pedido, ADM confirma Pix, muda para Preparando e depois Enviado.
- Entregar ao cliente apenas a URL da loja, os acessos individuais e um procedimento de backup; nunca entregar chaves de serviço do Supabase.
