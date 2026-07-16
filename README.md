# E-commerce Marilene Naumebore 🛍️

E-commerce de moda autoral completo e responsivo, desenvolvido com tecnologias nativas de alta performance, incluindo um Painel Administrativo integrado para controle de vendas, estoque e pedidos.

---

## 🌟 Funcionalidades Principais

### 🛒 Loja & Experiência do Cliente
- **Vitrine Interativa**: Catálogo moderno com fotos dos moletons premium **MARIA** e **Quem Protege Não Dorme** (com a estampa da planta Espada de São Jorge).
- **Modal de Detalhes**: Escolha de cor (Branco/Preto) com atualização da imagem de visualização em tempo real, seleção de tamanhos (P, M, G, GG) e controle dinâmico de quantidade baseado no estoque disponível.
- **Carrinho Lateral (Drawer)**: Gerenciador de itens interativo.
- **Cálculo de Frete Nacional**: Integração de CEP brasileiro. O site identifica o estado automaticamente e calcula prazos e preços realistas de PAC e SEDEX para todo o Brasil.
- **Checkout Completo**: Formulário de faturamento e simulação de métodos de pagamento:
  - **Pix**: Geração de QR Code Pix e Chave Copia e Cola funcional, com aplicação de **5% de desconto** automático.
  - **Cartão de Crédito**: Formulário com campos de validação e parcelamento.
  - **Boleto**: Informações de processamento bancário.

### 📊 Painel Administrativo
- **Dashboard**: Painel geral exibindo Faturamento Bruto, Total de Pedidos, Ticket Médio, Alertas de Estoque Baixo e Gráfico SVG de evolução diária de vendas.
- **Gerenciador de Pedidos**: Tabela com histórico detalhado de compras e alteração de status (Pendente, Preparando, Enviado, Entregue) ou exclusão de registros.
- **Controle de Estoque & Preços**: Edição em tempo real do estoque físico e valor de venda de cada variação (cor + tamanho).

---

## 📁 Tecnologias Utilizadas
- **HTML5** & **CSS3** (CSS Variables, Flexbox, Grid, Glassmorphism, Micro-animações).
- **JavaScript (ES6+)** nativo para gerenciamento de rotas (SPA) e estado de dados.
- **Node.js** (Apenas para o servidor local de desenvolvimento sem dependências externas).
- **Persistência de Dados**: Integração com `localStorage` do navegador para manter o estado de vendas, estoque e pedidos mesmo após a recarga da página.

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
