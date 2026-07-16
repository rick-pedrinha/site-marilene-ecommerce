/* ==========================================================================
   BANCO DE DADOS LOCAL & ESTRUTURA DE ESTADO (LOCALSTORAGE)
   ========================================================================== */

// Configurações e seed dos produtos
const initialProducts = [
    {
        id: 'quem-protege',
        name: 'Moletom "Quem Protege Não Dorme"',
        basePrice: 289.90,
        description: 'Moletom premium com capuz e bolso canguru, produzido em algodão de alta gramatura de toque macio. Estampa frontal artística combinando folhas de Espada de São Jorge em tons verdes orgânicos com tipografia autoral exclusiva. Símbolo de proteção, pertencimento e força espiritual que expressa a cultura popular brasileira.',
        imagePrefix: 'assets/hoodie_quem_protege',
        colors: ['Branco', 'Preto'],
        sizes: ['P', 'M', 'G', 'GG'],
        tag: 'Mais Vendido'
    },
    {
        id: 'maria',
        name: 'Moletom "MARIA"',
        basePrice: 299.90,
        description: 'Moletom de alta qualidade com corte streetwear contemporâneo. A estampa traz a icônica silhueta de uma mulher negra com cabelo afro e flor vermelha exuberante, celebrando a identidade, força e legado das mulheres brasileiras. Uma peça de alta costura com significado social e estético.',
        imagePrefix: 'assets/hoodie_maria',
        colors: ['Branco', 'Preto'],
        sizes: ['P', 'M', 'G', 'GG'],
        tag: 'Coleção Raízes'
    }
];

// Regras de cálculo de frete por estado do Brasil
const shippingRates = {
    'DF': { region: 'Distrito Federal', pac: { price: 12.00, days: 2 }, sedex: { price: 18.00, days: 1 } },
    'SP': { region: 'Sudeste', pac: { price: 21.50, days: 5 }, sedex: { price: 37.90, days: 2 } },
    'RJ': { region: 'Sudeste', pac: { price: 22.90, days: 6 }, sedex: { price: 39.50, days: 2 } },
    'MG': { region: 'Sudeste', pac: { price: 20.80, days: 5 }, sedex: { price: 36.20, days: 2 } },
    'ES': { region: 'Sudeste', pac: { price: 23.00, days: 6 }, sedex: { price: 41.00, days: 3 } },
    'PR': { region: 'Sul', pac: { price: 24.50, days: 6 }, sedex: { price: 44.00, days: 3 } },
    'SC': { region: 'Sul', pac: { price: 25.10, days: 7 }, sedex: { price: 46.50, days: 3 } },
    'RS': { region: 'Sul', pac: { price: 26.80, days: 7 }, sedex: { price: 49.00, days: 3 } },
    'GO': { region: 'Centro-Oeste', pac: { price: 17.50, days: 4 }, sedex: { price: 31.00, days: 2 } },
    'MT': { region: 'Centro-Oeste', pac: { price: 19.90, days: 5 }, sedex: { price: 35.80, days: 2 } },
    'MS': { region: 'Centro-Oeste', pac: { price: 18.70, days: 5 }, sedex: { price: 33.40, days: 2 } },
    'BA': { region: 'Nordeste', pac: { price: 26.00, days: 6 }, sedex: { price: 46.00, days: 3 } },
    'PE': { region: 'Nordeste', pac: { price: 28.50, days: 7 }, sedex: { price: 51.00, days: 3 } },
    'CE': { region: 'Nordeste', pac: { price: 29.20, days: 7 }, sedex: { price: 53.00, days: 3 } },
    'RN': { region: 'Nordeste', pac: { price: 29.80, days: 8 }, sedex: { price: 54.50, days: 4 } },
    'PB': { region: 'Nordeste', pac: { price: 28.90, days: 7 }, sedex: { price: 52.00, days: 3 } },
    'AL': { region: 'Nordeste', pac: { price: 28.10, days: 7 }, sedex: { price: 50.50, days: 3 } },
    'SE': { region: 'Nordeste', pac: { price: 27.60, days: 7 }, sedex: { price: 49.80, days: 3 } },
    'PI': { region: 'Nordeste', pac: { price: 29.90, days: 8 }, sedex: { price: 54.00, days: 4 } },
    'MA': { region: 'Nordeste', pac: { price: 31.20, days: 8 }, sedex: { price: 56.50, days: 4 } },
    'AM': { region: 'Norte', pac: { price: 35.00, days: 10 }, sedex: { price: 62.00, days: 4 } },
    'PA': { region: 'Norte', pac: { price: 33.50, days: 9 }, sedex: { price: 59.80, days: 4 } },
    'AC': { region: 'Norte', pac: { price: 37.00, days: 11 }, sedex: { price: 66.50, days: 5 } },
    'RO': { region: 'Norte', pac: { price: 34.20, days: 9 }, sedex: { price: 61.00, days: 4 } },
    'RR': { region: 'Norte', pac: { price: 39.00, days: 12 }, sedex: { price: 71.00, days: 5 } },
    'AP': { region: 'Norte', pac: { price: 36.50, days: 10 }, sedex: { price: 64.80, days: 4 } },
    'TO': { region: 'Norte', pac: { price: 25.80, days: 7 }, sedex: { price: 44.50, days: 3 } }
};

// Histórico de pedidos seed para alimentar o painel admin inicialmente
const initialOrders = [
    {
        id: '#MN-48291',
        customer: {
            name: 'Clara Rodrigues Mendes',
            email: 'clara.mendes@email.com',
            phone: '(11) 98765-4321',
            cpf: '123.456.789-00',
            cep: '01311-200',
            state: 'SP',
            city: 'São Paulo',
            street: 'Avenida Paulista',
            number: '1000',
            neighborhood: 'Bela Vista',
            complement: 'Apto 54'
        },
        items: [
            { productId: 'quem-protege', name: 'Moletom "Quem Protege Não Dorme"', color: 'Preto', size: 'G', qty: 1, price: 289.90 }
        ],
        subtotal: 289.90,
        shippingCost: 37.90,
        discount: 0.00,
        totalPrice: 327.80,
        shippingMethod: 'SEDEX',
        paymentMethod: 'credit_card',
        date: '2026-07-14T14:32:00.000Z',
        status: 'shipped'
    },
    {
        id: '#MN-48305',
        customer: {
            name: 'Luiz Fernando Souza',
            email: 'luiz.souza@email.com',
            phone: '(61) 99123-4567',
            cpf: '987.654.321-00',
            cep: '70233-010',
            state: 'DF',
            city: 'Brasília',
            street: 'CLS 405 Bloco A',
            number: '12',
            neighborhood: 'Asa Sul',
            complement: 'Apto 302'
        },
        items: [
            { productId: 'maria', name: 'Moletom "MARIA"', color: 'Branco', size: 'M', qty: 1, price: 299.90 },
            { productId: 'quem-protege', name: 'Moletom "Quem Protege Não Dorme"', color: 'Branco', size: 'M', qty: 1, price: 289.90 }
        ],
        subtotal: 589.80,
        shippingCost: 12.00,
        discount: 29.49,
        totalPrice: 572.31,
        shippingMethod: 'PAC',
        paymentMethod: 'pix',
        date: '2026-07-15T18:15:00.000Z',
        status: 'preparing'
    },
    {
        id: '#MN-48312',
        customer: {
            name: 'Aline de Oliveira Santos',
            email: 'aline.santos@email.com',
            phone: '(71) 98888-2222',
            cpf: '456.789.123-11',
            cep: '40015-000',
            state: 'BA',
            city: 'Salvador',
            street: 'Rua do Passo',
            number: '45',
            neighborhood: 'Pelourinho',
            complement: ''
        },
        items: [
            { productId: 'maria', name: 'Moletom "MARIA"', color: 'Preto', size: 'GG', qty: 1, price: 299.90 }
        ],
        subtotal: 299.90,
        shippingCost: 26.00,
        discount: 0.00,
        totalPrice: 325.90,
        shippingMethod: 'PAC',
        paymentMethod: 'boleto',
        date: '2026-07-16T10:05:00.000Z',
        status: 'pending'
    }
];

// Seed do usuário inicial para testes
const initialUsers = [
    {
        name: 'Clara Rodrigues Mendes',
        email: 'clara.mendes@email.com',
        password: '123',
        phone: '(11) 98765-4321',
        cpf: '123.456.789-00',
        cep: '01311-200',
        state: 'SP',
        city: 'São Paulo',
        street: 'Avenida Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        complement: 'Apto 54'
    }
];

// Estado global da aplicação
let products = [];
let stock = {};
let cart = [];
let orders = [];

// Autenticação
let users = [];
let currentUser = null;

// Chat
let chats = {};
let activeChatId = null; // ID da conversa selecionada no admin
let clientChatId = null; // ID da conversa do cliente atual (Email ou ID Visitante)

// Estado da compra atual (Checkout)
let checkoutShippingState = null; // DF, SP, etc.
let checkoutShippingCost = 0;
let checkoutShippingMethod = '';
let checkoutDiscount = 0;

/* ==========================================================================
   FUNÇÕES DE INICIALIZAÇÃO E PERSISTÊNCIA
   ========================================================================== */

function initApp() {
    // 1. Carregar ou inicializar produtos
    if (localStorage.getItem('mn_products')) {
        products = JSON.parse(localStorage.getItem('mn_products'));
    } else {
        products = initialProducts;
        localStorage.setItem('mn_products', JSON.stringify(products));
    }

    // 2. Inicializar ou carregar estoque
    if (localStorage.getItem('mn_stock')) {
        stock = JSON.parse(localStorage.getItem('mn_stock'));
    } else {
        products.forEach(p => {
            p.colors.forEach(color => {
                p.sizes.forEach(size => {
                    const key = `${p.id}_${color}_${size}`;
                    stock[key] = {
                        qty: 15,
                        price: p.basePrice
                    };
                });
            });
        });
        saveStockToStorage();
    }

    // 3. Inicializar ou carregar pedidos
    if (localStorage.getItem('mn_orders')) {
        orders = JSON.parse(localStorage.getItem('mn_orders'));
    } else {
        orders = initialOrders;
        saveOrdersToStorage();
    }

    // 4. Inicializar ou carregar usuários cadastrados
    if (localStorage.getItem('mn_users')) {
        users = JSON.parse(localStorage.getItem('mn_users'));
    } else {
        users = initialUsers;
        localStorage.setItem('mn_users', JSON.stringify(users));
    }

    // 5. Carregar usuário logado
    if (localStorage.getItem('mn_current_user')) {
        currentUser = JSON.parse(localStorage.getItem('mn_current_user'));
    }

    // 6. Carregar carrinho
    if (localStorage.getItem('mn_cart')) {
        cart = JSON.parse(localStorage.getItem('mn_cart'));
    }

    // 7. Carregar conversas do Chat
    if (localStorage.getItem('mn_chats')) {
        chats = JSON.parse(localStorage.getItem('mn_chats'));
    }

    // Gerar ou carregar ID de chat de visitante se não logado
    if (currentUser) {
        clientChatId = currentUser.email;
    } else {
        if (localStorage.getItem('mn_visitor_id')) {
            clientChatId = localStorage.getItem('mn_visitor_id');
        } else {
            clientChatId = 'visitante_' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('mn_visitor_id', clientChatId);
        }
    }

    // Renderizações Iniciais
    renderProductGrid();
    updateCartUI();
    updateAuthUI();
    renderClientChat();
    
    // Configurar listeners gerais
    setupEventListeners();

    // Sincronizar chat e dados entre abas em tempo real
    setInterval(syncRealTimeData, 1500);
}

function saveStockToStorage() {
    localStorage.setItem('mn_stock', JSON.stringify(stock));
}

function saveOrdersToStorage() {
    localStorage.setItem('mn_orders', JSON.stringify(orders));
}

function saveCartToStorage() {
    localStorage.setItem('mn_cart', JSON.stringify(cart));
}

function saveChatsToStorage() {
    localStorage.setItem('mn_chats', JSON.stringify(chats));
}

function syncRealTimeData() {
    // Recarregar chats para atualizar mensagens novas enviadas pelo admin/cliente na outra aba
    if (localStorage.getItem('mn_chats')) {
        const localChats = JSON.parse(localStorage.getItem('mn_chats'));
        // Verificar se houve mudança no tamanho das conversas
        if (JSON.stringify(localChats) !== JSON.stringify(chats)) {
            chats = localChats;
            renderClientChat();
            
            // Se estiver na aba Admin de Chat, recarregar visualizações
            const adminChatTab = document.getElementById('admin-chat');
            if (adminChatTab && adminChatTab.classList.contains('active')) {
                renderAdminChatThreads();
                if (activeChatId) {
                    renderAdminActiveChat(activeChatId);
                }
            }
        }
    }
}

/* ==========================================================================
   ROTEAMENTO (SPA) E EVENT LISTENERS
   ========================================================================== */

function navigateTo(viewId) {
    const views = document.querySelectorAll('.view-section');
    views.forEach(view => {
        view.classList.remove('active');
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
        window.scrollTo(0, 0);
    }
}

function setupEventListeners() {
    // Navegação Cabeçalho
    document.getElementById('nav-logo').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('store-view');
    });

    const navLinks = document.querySelectorAll('.main-nav .nav-link:not(.admin-btn-nav)');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            navigateTo('store-view');
            
            const targetSection = this.getAttribute('href');
            if (targetSection.startsWith('#')) {
                const el = document.getElementById(targetSection.substring(1));
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Abrir/Fechar Carrinho Lateral
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-drawer-overlay');

    const openCart = () => {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    };

    const closeCart = () => {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
    };

    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    continueShoppingBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Detalhes do Produto - Fechar Modal
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        document.getElementById('product-modal').classList.remove('active');
    });

    // Gatilho do Checkout
    document.getElementById('checkout-trigger-btn').addEventListener('click', () => {
        closeCart();
        renderCheckoutSummary();
        navigateTo('checkout-view');
    });

    document.getElementById('back-to-store-btn').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('store-view');
    });

    // Checkout - Tipo de pagamento
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.payment-method-option').forEach(opt => opt.classList.remove('active'));
            this.closest('.payment-method-option').classList.add('active');
            
            document.querySelectorAll('.payment-details-box').forEach(box => box.classList.remove('active'));
            const detailBoxId = `payment-${this.value}-details`;
            const box = document.getElementById(detailBoxId);
            if (box) box.classList.add('active');

            calculateTotalCheckout();
        });
    });

    // Checkout - CEP e Cálculo de Frete
    document.getElementById('calculate-shipping-btn').addEventListener('click', calculateFreight);
    document.getElementById('cust-cep').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateFreight();
        }
    });

    // Copiar PIX
    document.getElementById('copy-pix-btn').addEventListener('click', () => {
        const copyText = document.getElementById('pix-key-input');
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);
        
        const btn = document.getElementById('copy-pix-btn');
        btn.innerText = 'Copiado!';
        setTimeout(() => {
            btn.innerText = 'Copiar Chave';
        }, 2000);
    });

    // Submissão do Pedido
    document.getElementById('submit-order-btn').addEventListener('click', submitOrder);

    // Botões de Confirmação
    document.getElementById('conf-back-to-store-btn').addEventListener('click', () => {
        navigateTo('store-view');
    });

    document.getElementById('conf-admin-view-btn').addEventListener('click', () => {
        enterAdminPanel();
    });

    // Acesso ao Painel Admin
    document.getElementById('go-to-admin-btn').addEventListener('click', (e) => {
        e.preventDefault();
        enterAdminPanel();
    });
    
    document.getElementById('footer-admin-link').addEventListener('click', (e) => {
        e.preventDefault();
        enterAdminPanel();
    });

    // Admin Sidebar Tabs
    const adminNavItems = document.querySelectorAll('.admin-nav-item:not(.exit-btn)');
    adminNavItems.forEach(item => {
        item.addEventListener('click', function() {
            adminNavItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            const targetTab = this.getAttribute('data-tab');
            document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');
            
            const titleEl = document.getElementById('admin-tab-title');
            if (targetTab === 'admin-dashboard') {
                titleEl.innerText = 'Dashboard de Controle';
                renderAdminDashboard();
            } else if (targetTab === 'admin-orders') {
                titleEl.innerText = 'Gerenciamento de Pedidos';
                renderAdminOrders();
            } else if (targetTab === 'admin-stock') {
                titleEl.innerText = 'Estoque e Preços';
                renderAdminStock();
            } else if (targetTab === 'admin-products') {
                titleEl.innerText = 'Catálogo de Produtos';
                renderAdminProducts();
            } else if (targetTab === 'admin-chat') {
                titleEl.innerText = 'Mensagens do Chat';
                renderAdminChatThreads();
            }
        });
    });

    // Salvar Estoque Admin
    document.getElementById('save-stock-changes-btn').addEventListener('click', saveAdminStockChanges);

    // Sair do Painel Admin
    document.getElementById('exit-admin-btn').addEventListener('click', () => {
        navigateTo('store-view');
    });

    // Atalho Dashboard -> Pedidos
    document.getElementById('view-all-orders-shortcut').addEventListener('click', () => {
        const orderTabBtn = document.querySelector('[data-tab="admin-orders"]');
        if (orderTabBtn) orderTabBtn.click();
    });

    // Filtro de Status na tabela de pedidos
    document.getElementById('filter-order-status').addEventListener('change', renderAdminOrders);

    // ==========================================
    // LISTENERS FASE 2 (AUTENTICAÇÃO & CHAT)
    // ==========================================
    
    // Abrir/Fechar Modal de Auth
    document.getElementById('user-btn').addEventListener('click', () => {
        if (currentUser) {
            // Abrir Painel Minha Conta
            renderAccountProfile();
            navigateTo('account-view');
        } else {
            // Abrir Modal de Login
            openAuthModal();
        }
    });

    document.getElementById('close-auth-modal-btn').addEventListener('click', closeAuthModal);
    
    // Alternar entre login e cadastro
    document.getElementById('go-to-register-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('register-container').style.display = 'block';
    });

    document.getElementById('go-to-login-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
    });

    // Ações de Login e Cadastro
    document.getElementById('submit-login-btn').addEventListener('click', submitLogin);
    document.getElementById('submit-register-btn').addEventListener('click', submitRegister);
    
    // Sair da conta e Voltar ao perfil
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
    document.getElementById('account-back-to-store-btn').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('store-view');
    });

    // Salvar edições do Perfil
    document.getElementById('save-profile-btn').addEventListener('click', saveUserProfile);

    // Widget Chat Cliente - Abrir/Fechar
    const chatTrigger = document.getElementById('chat-widget-trigger');
    const chatClose = document.getElementById('chat-widget-close-btn');
    const chatBox = document.getElementById('chat-widget-box');

    chatTrigger.addEventListener('click', () => {
        chatBox.classList.toggle('open');
        // Resetar notificações ao abrir
        document.getElementById('chat-client-badge').style.display = 'none';
    });

    chatClose.addEventListener('click', () => {
        chatBox.classList.remove('open');
    });

    // Enviar mensagem no Chat Cliente
    document.getElementById('chat-widget-send-btn').addEventListener('click', sendClientChatMessage);
    document.getElementById('chat-widget-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendClientChatMessage();
    });

    // Cadastrar Novo Produto
    document.getElementById('submit-new-product-btn').addEventListener('click', addProductToCatalog);

    // Enviar mensagem Chat Admin
    document.getElementById('admin-chat-send-btn').addEventListener('click', sendAdminChatMessage);
    document.getElementById('admin-chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAdminChatMessage();
    });

    // Mobile Bottom Navigation Links
    document.getElementById('mob-nav-home').addEventListener('click', function(e) {
        e.preventDefault();
        setActiveMobileTab(this);
        navigateTo('store-view');
        const el = document.getElementById('home');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('mob-nav-products').addEventListener('click', function(e) {
        e.preventDefault();
        setActiveMobileTab(this);
        navigateTo('store-view');
        const el = document.getElementById('produtos');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('mob-nav-cart').addEventListener('click', function(e) {
        e.preventDefault();
        setActiveMobileTab(this);
        document.getElementById('cart-drawer').classList.add('open');
        document.getElementById('cart-drawer-overlay').classList.add('open');
    });

    document.getElementById('mob-nav-user').addEventListener('click', function(e) {
        e.preventDefault();
        setActiveMobileTab(this);
        if (currentUser) {
            renderAccountProfile();
            navigateTo('account-view');
        } else {
            openAuthModal();
        }
    });
}

function setActiveMobileTab(activeEl) {
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    activeEl.classList.add('active');
}

/* ==========================================================================
   APRESENTAÇÃO DOS PRODUTOS (VITRINE)
   ========================================================================== */

function renderProductGrid() {
    const container = document.getElementById('products-list-container');
    if (!container) return;

    container.innerHTML = '';
    products.forEach(p => {
        // Encontrar preço mínimo nas variações de estoque
        let minPrice = p.basePrice;
        p.colors.forEach(col => {
            p.sizes.forEach(sz => {
                const item = stock[`${p.id}_${col}_${sz}`];
                if (item && item.price < minPrice) {
                    minPrice = item.price;
                }
            });
        });

        p.colors.forEach(color => {
            const displayImage = `${p.imagePrefix}_${color.toLowerCase()}.jpg`;
            const card = document.createElement('article');
            card.className = 'product-card';
            card.innerHTML = `
                <button class="product-card-image-box" onclick="openProductModal('${p.id}', '${color}')" aria-label="Ver ${p.name} na cor ${color}">
                    <img src="${displayImage}" alt="${p.name} na cor ${color}" class="product-card-img" onerror="this.src='https://placehold.co/400x400?text=Moletom+Marilene'">
                    <span class="product-card-badge">${p.tag || 'Exclusivo'}</span>
                    <span class="product-card-color">${color}</span>
                </button>
                <div class="product-card-content">
                    <span class="product-eyebrow">CASACO COM CAPUZ · ${color.toUpperCase()}</span>
                    <h3 class="product-card-title">${p.name}</h3>
                    <p class="product-card-desc">${p.description}</p>
                    <div class="product-payment-note">PIX com 5% OFF ou cartão em até 6x</div>
                    <div class="product-card-footer">
                        <div><small>A partir de</small><span class="product-card-price">R$ ${minPrice.toFixed(2).replace('.', ',')}</span></div>
                        <button class="btn btn-primary btn-small" onclick="openProductModal('${p.id}', '${color}')">Fazer pedido</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    });
}

function openProductModal(productId, preferredColor = null) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    const modalContent = document.getElementById('modal-product-detail-container');
    
    // Estado do produto atual no Modal
    let selectedColor = preferredColor && p.colors.includes(preferredColor) ? preferredColor : p.colors[0];
    let selectedSize = p.sizes[1]; // Inicia no tamanho M por padrão
    
    const updateModalView = () => {
        const stockKey = `${p.id}_${selectedColor}_${selectedSize}`;
        const currentStock = stock[stockKey] ? stock[stockKey].qty : 0;
        const currentPrice = stock[stockKey] ? stock[stockKey].price : p.basePrice;
        const imgPath = `${p.imagePrefix}_${selectedColor.toLowerCase()}.jpg`;

        modalContent.innerHTML = `
            <!-- Lado Imagem -->
            <div class="modal-image-side">
                <img src="${imgPath}" alt="${p.name}" class="modal-product-img" id="modal-display-img" onerror="this.src='https://placehold.co/600x600?text=Moletom+${selectedColor}'">
            </div>
            
            <!-- Lado Informações -->
            <div class="modal-content-side">
                <div>
                    <span class="modal-product-tag">${p.tag || 'Novidade'}</span>
                    <h2 class="modal-product-title">${p.name}</h2>
                </div>
                <div class="modal-product-price" id="modal-price-display">R$ ${currentPrice.toFixed(2).replace('.', ',')}</div>
                <p class="modal-product-desc">${p.description}</p>
                
                <!-- Escolha da Cor -->
                <div>
                    <span class="option-label">Cor: <strong id="selected-color-text">${selectedColor}</strong></span>
                    <div class="color-picker-grid">
                        ${p.colors.map(c => `
                            <div class="color-option color-${c === 'Branco' ? 'white' : 'black'} ${c === selectedColor ? 'active' : ''}" 
                                 data-color="${c}" title="${c}"></div>
                        `).join('')}
                    </div>
                </div>

                <!-- Escolha do Tamanho -->
                <div>
                    <span class="option-label">Tamanho:</span>
                    <div class="choice-picker-grid">
                        ${p.sizes.map(s => {
                            const variationKey = `${p.id}_${selectedColor}_${s}`;
                            const varStock = stock[variationKey] ? stock[variationKey].qty : 0;
                            const isOut = varStock <= 0;
                            return `
                                <button class="choice-option ${s === selectedSize ? 'active' : ''}" 
                                        data-size="${s}" 
                                        ${isOut ? 'disabled' : ''}>
                                    ${s} ${isOut ? '(Esgotado)' : ''}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Quantidade -->
                <div>
                    <span class="option-label">Quantidade:</span>
                    <div class="quantity-selector">
                        <button class="qty-btn" id="qty-minus">-</button>
                        <input type="number" class="qty-input" id="qty-number-input" value="1" min="1" max="${currentStock}">
                        <button class="qty-btn" id="qty-plus">+</button>
                    </div>
                    
                    <!-- Status de Estoque -->
                    <div class="stock-status-container" id="modal-stock-status">
                        ${getQtyStatusHtml(currentStock)}
                    </div>
                </div>

                <!-- Botão de Carrinho -->
                <button class="btn btn-primary btn-block" id="modal-add-to-cart-btn" ${currentStock <= 0 ? 'disabled' : ''}>
                    ${currentStock <= 0 ? 'Sem Estoque Disponível' : 'Adicionar ao carrinho e pedir'}
                </button>
                <p class="modal-payment-hint">Pague com PIX (5% OFF), cartão de crédito ou boleto no checkout.</p>
            </div>
        `;

        // Ativar Listeners Internos do Modal
        modalContent.querySelectorAll('.color-option').forEach(el => {
            el.addEventListener('click', function() {
                selectedColor = this.getAttribute('data-color');
                const testKey = `${p.id}_${selectedColor}_${selectedSize}`;
                if (!stock[testKey] || stock[testKey].qty <= 0) {
                    const firstAvail = p.sizes.find(s => stock[`${p.id}_${selectedColor}_${s}`] && stock[`${p.id}_${selectedColor}_${s}`].qty > 0);
                    if (firstAvail) selectedSize = firstAvail;
                }
                updateModalView();
            });
        });

        modalContent.querySelectorAll('.choice-option').forEach(el => {
            el.addEventListener('click', function() {
                selectedSize = this.getAttribute('data-size');
                updateModalView();
            });
        });

        const qtyInput = modalContent.querySelector('#qty-number-input');
        
        modalContent.querySelector('#qty-minus').addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
        });

        modalContent.querySelector('#qty-plus').addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val < currentStock) qtyInput.value = val + 1;
        });

        qtyInput.addEventListener('change', function() {
            let val = parseInt(this.value) || 1;
            if (val < 1) val = 1;
            if (val > currentStock) val = currentStock;
            this.value = val;
        });

        modalContent.querySelector('#modal-add-to-cart-btn').addEventListener('click', () => {
            const qty = parseInt(qtyInput.value) || 1;
            addToCart(p.id, p.name, selectedColor, selectedSize, qty, currentPrice);
            document.getElementById('product-modal').classList.remove('active');
        });
    };

    updateModalView();
    document.getElementById('product-modal').classList.add('active');
}

function getQtyStatusHtml(qty) {
    if (qty <= 0) {
        return `<span class="stock-status-info out-of-stock">❌ Esgotado no momento</span>`;
    } else if (qty < 5) {
        return `<span class="stock-status-info low-stock">⚠️ Estoque Crítico! Apenas ${qty} unidades restantes.</span>`;
    } else {
        return `<span class="stock-status-info in-stock">✓ Em estoque (${qty} unidades disponíveis)</span>`;
    }
}

/* ==========================================================================
   LÓGICA DO CARRINHO DE COMPRAS
   ========================================================================== */

function addToCart(productId, name, color, size, qty, price) {
    const existingIndex = cart.findIndex(item => 
        item.productId === productId && item.color === color && item.size === size
    );

    const stockKey = `${productId}_${color}_${size}`;
    const maxStock = stock[stockKey] ? stock[stockKey].qty : 0;

    if (existingIndex > -1) {
        let newQty = cart[existingIndex].qty + qty;
        if (newQty > maxStock) newQty = maxStock;
        cart[existingIndex].qty = newQty;
    } else {
        cart.push({
            productId,
            name,
            color,
            size,
            qty: Math.min(qty, maxStock),
            price
        });
    }

    saveCartToStorage();
    updateCartUI();
    
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-drawer-overlay').classList.add('open');
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-trigger-btn');

    if (!badge || !container) return;

    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    badge.innerText = totalItems;
    
    const mobBadge = document.getElementById('mob-cart-badge');
    if (mobBadge) mobBadge.innerText = totalItems;

    if (cart.length === 0) {
        container.innerHTML = `<p class="placeholder-text">Seu carrinho está vazio. Adicione um moletom autoral!</p>`;
        subtotalEl.innerText = 'R$ 0,00';
        checkoutBtn.disabled = true;
        return;
    }

    checkoutBtn.disabled = false;
    container.innerHTML = '';
    
    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        const imgPath = `assets/hoodie_${item.productId === 'maria' ? 'maria' : (item.productId === 'quem-protege' ? 'quem_protege' : 'quem_protege')}_${item.color.toLowerCase()}.jpg`;
        const stockKey = `${item.productId}_${item.color}_${item.size}`;
        const maxStock = stock[stockKey] ? stock[stockKey].qty : 0;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div class="cart-item-img-box">
                <img src="${imgPath}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://placehold.co/100x100?text=MN'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-meta">
                    <h4>${item.name}</h4>
                    <span class="cart-item-variation-text">Cor: ${item.color} | Tam: ${item.size}</span>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-item-qty-selector">
                        <button class="cart-item-qty-btn" onclick="adjustCartQty(${index}, -1)">-</button>
                        <span class="cart-item-qty-input">${item.qty}</span>
                        <button class="cart-item-qty-btn" onclick="adjustCartQty(${index}, 1)" ${item.qty >= maxStock ? 'disabled' : ''}>+</button>
                    </div>
                    <span class="cart-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                    <span class="cart-item-remove-btn" onclick="removeFromCart(${index})">Remover</span>
                </div>
            </div>
        `;
        container.appendChild(row);
    });

    subtotalEl.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

function adjustCartQty(index, direction) {
    if (!cart[index]) return;

    const item = cart[index];
    const stockKey = `${item.productId}_${item.color}_${item.size}`;
    const maxStock = stock[stockKey] ? stock[stockKey].qty : 0;

    let newQty = item.qty + direction;
    if (newQty < 1) newQty = 1;
    if (newQty > maxStock) newQty = maxStock;

    cart[index].qty = newQty;
    saveCartToStorage();
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartUI();
}

/* ==========================================================================
   CHECKOUT & CÁLCULO DE FRETE BRASILEIRO
   ========================================================================== */

function calculateFreight() {
    const cepInput = document.getElementById('cust-cep').value.replace(/\D/g, '');
    const stateInput = document.getElementById('cust-state');
    const container = document.getElementById('shipping-options-container');

    if (cepInput.length !== 8) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }

    const cepNum = parseInt(cepInput);
    let state = '';

    if (cepNum >= 1000000 && cepNum <= 19999999) state = 'SP';
    else if (cepNum >= 20000000 && cepNum <= 28999999) state = 'RJ';
    else if (cepNum >= 29000000 && cepNum <= 29999999) state = 'ES';
    else if (cepNum >= 30000000 && cepNum <= 39999999) state = 'MG';
    else if (cepNum >= 40000000 && cepNum <= 48999999) state = 'BA';
    else if (cepNum >= 49000000 && cepNum <= 49999999) state = 'SE';
    else if (cepNum >= 50000000 && cepNum <= 56999999) state = 'PE';
    else if (cepNum >= 57000000 && cepNum <= 57999999) state = 'AL';
    else if (cepNum >= 58000000 && cepNum <= 58999999) state = 'PB';
    else if (cepNum >= 59000000 && cepNum <= 59999999) state = 'RN';
    else if (cepNum >= 60000000 && cepNum <= 63999999) state = 'CE';
    else if (cepNum >= 64000000 && cepNum <= 64999999) state = 'PI';
    else if (cepNum >= 65000000 && cepNum <= 65999999) state = 'MA';
    else if (cepNum >= 66000000 && cepNum <= 68899999) state = 'PA';
    else if (cepNum >= 68900000 && cepNum <= 68999999) state = 'AP';
    else if (cepNum >= 69000000 && cepNum <= 69299999) state = 'AM';
    else if (cepNum >= 69400000 && cepNum <= 69899999) state = 'AM';
    else if (cepNum >= 69300000 && cepNum <= 69399999) state = 'RR';
    else if (cepNum >= 69900000 && cepNum <= 69999999) state = 'AC';
    else if (cepNum >= 70000000 && cepNum <= 72999999) state = 'DF';
    else if (cepNum >= 73000000 && cepNum <= 76799999) state = 'GO';
    else if (cepNum >= 76800000 && cepNum <= 76999999) state = 'RO';
    else if (cepNum >= 77000000 && cepNum <= 77999999) state = 'TO';
    else if (cepNum >= 78000000 && cepNum <= 78899999) state = 'MT';
    else if (cepNum >= 78900000 && cepNum <= 78999999) state = 'RO';
    else if (cepNum >= 79000000 && cepNum <= 79999999) state = 'MS';
    else if (cepNum >= 80000000 && cepNum <= 87999999) state = 'PR';
    else if (cepNum >= 88000000 && cepNum <= 89999999) state = 'SC';
    else if (cepNum >= 90000000 && cepNum <= 99999999) state = 'RS';
    else state = 'DF';

    checkoutShippingState = state;
    const rule = shippingRates[state];
    stateInput.value = `${state} - ${rule.region}`;

    container.innerHTML = `
        <div class="shipping-option-card active" onclick="selectShippingOption('PAC', ${rule.pac.price})">
            <div class="shipping-option-left">
                <input type="radio" name="shipping-type" value="PAC" checked>
                <div class="shipping-option-details">
                    <span class="shipping-option-title">PAC Correios</span>
                    <span class="shipping-option-time">Entrega estimada em até ${rule.pac.days} dias úteis</span>
                </div>
            </div>
            <span class="shipping-option-price">R$ ${rule.pac.price.toFixed(2).replace('.', ',')}</span>
        </div>
        
        <div class="shipping-option-card" onclick="selectShippingOption('SEDEX', ${rule.sedex.price})">
            <div class="shipping-option-left">
                <input type="radio" name="shipping-type" value="SEDEX">
                <div class="shipping-option-details">
                    <span class="shipping-option-title">SEDEX Expresso</span>
                    <span class="shipping-option-time">Entrega estimada em até ${rule.sedex.days} dias úteis</span>
                </div>
            </div>
            <span class="shipping-option-price">R$ ${rule.sedex.price.toFixed(2).replace('.', ',')}</span>
        </div>
    `;

    selectShippingOption('PAC', rule.pac.price);
}

function selectShippingOption(method, price) {
    checkoutShippingMethod = method;
    checkoutShippingCost = price;
    
    const cards = document.querySelectorAll('.shipping-option-card');
    cards.forEach(card => {
        card.classList.remove('active');
        const input = card.querySelector('input');
        if (input && input.value === method) {
            card.classList.add('active');
            input.checked = true;
        }
    });

    calculateTotalCheckout();
}

function renderCheckoutSummary() {
    const container = document.getElementById('checkout-summary-items');
    if (!container) return;

    container.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const row = document.createElement('div');
        row.className = 'checkout-item-summary-row';
        row.innerHTML = `
            <div class="checkout-item-summary-info">
                <span class="checkout-item-summary-title">${item.name} (x${item.qty})</span>
                <span class="checkout-item-summary-variant">Cor: ${item.color} | Tam: ${item.size}</span>
            </div>
            <span class="checkout-item-summary-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
        `;
        container.appendChild(row);
    });

    document.getElementById('checkout-subtotal').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

    // Autopreenchimento se o usuário estiver logado
    if (currentUser) {
        document.getElementById('cust-name').value = currentUser.name || '';
        document.getElementById('cust-email').value = currentUser.email || '';
        document.getElementById('cust-phone').value = currentUser.phone || '';
        document.getElementById('cust-cpf').value = currentUser.cpf || '';
        document.getElementById('cust-cep').value = currentUser.cep || '';
        document.getElementById('cust-street').value = currentUser.street || '';
        document.getElementById('cust-number').value = currentUser.number || '';
        document.getElementById('cust-neighborhood').value = currentUser.neighborhood || '';
        document.getElementById('cust-city').value = currentUser.city || '';
        
        // Se tem CEP cadastrado, calcula frete
        if (currentUser.cep) {
            calculateFreight();
        }
    }

    calculateTotalCheckout();
}

function calculateTotalCheckout() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    const discountRow = document.getElementById('discount-row');
    if (paymentMethod === 'pix') {
        checkoutDiscount = subtotal * 0.05;
        document.getElementById('checkout-discount').innerText = `- R$ ${checkoutDiscount.toFixed(2).replace('.', ',')}`;
        discountRow.style.display = 'flex';
    } else {
        checkoutDiscount = 0;
        discountRow.style.display = 'none';
    }

    const total = subtotal + checkoutShippingCost - checkoutDiscount;

    document.getElementById('checkout-shipping').innerText = checkoutShippingCost > 0 ? `R$ ${checkoutShippingCost.toFixed(2).replace('.', ',')}` : 'A calcular';
    document.getElementById('shipping-method-name').innerText = checkoutShippingMethod || 'Não selecionado';
    document.getElementById('checkout-total-price').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

/* ==========================================================================
   FINALIZAÇÃO E SUBMISSÃO DO PEDIDO
   ========================================================================== */

function submitOrder() {
    const name = document.getElementById('cust-name').value;
    const email = document.getElementById('cust-email').value;
    const phone = document.getElementById('cust-phone').value;
    const cpf = document.getElementById('cust-cpf').value;
    const cep = document.getElementById('cust-cep').value;
    const state = document.getElementById('cust-state').value;
    const street = document.getElementById('cust-street').value;
    const number = document.getElementById('cust-number').value;
    const neighborhood = document.getElementById('cust-neighborhood').value;
    const city = document.getElementById('cust-city').value;
    const complement = document.getElementById('cust-complement').value;

    if (!name || !email || !phone || !cpf || !cep || !state || !street || !number || !neighborhood || !city) {
        alert('Por favor, preencha todos os campos obrigatórios do endereço e dados pessoais.');
        return;
    }

    if (!checkoutShippingMethod) {
        alert('Por favor, insira o CEP e selecione uma forma de envio.');
        return;
    }

    let stockValid = true;
    cart.forEach(item => {
        const key = `${item.productId}_${item.color}_${item.size}`;
        if (!stock[key] || stock[key].qty < item.qty) {
            alert(`Desculpe, o item ${item.name} (${item.color} - ${item.size}) está sem estoque suficiente no momento. Estoque atual: ${stock[key] ? stock[key].qty : 0}`);
            stockValid = false;
        }
    });

    if (!stockValid) return;

    cart.forEach(item => {
        const key = `${item.productId}_${item.color}_${item.size}`;
        stock[key].qty -= item.qty;
    });
    saveStockToStorage();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const total = subtotal + checkoutShippingCost - checkoutDiscount;

    const orderId = `#MN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
        id: orderId,
        customer: {
            name, email, phone, cpf, cep, state: checkoutShippingState, city, street, number, neighborhood, complement
        },
        items: [...cart],
        subtotal,
        shippingCost: checkoutShippingCost,
        discount: checkoutDiscount,
        totalPrice: total,
        shippingMethod: checkoutShippingMethod,
        paymentMethod,
        date: new Date().toISOString(),
        status: 'pending'
    };

    orders.unshift(newOrder);
    saveOrdersToStorage();

    cart = [];
    saveCartToStorage();
    updateCartUI();

    document.getElementById('conf-order-id').innerText = orderId;
    document.getElementById('conf-payment-status').innerText = paymentMethod === 'pix' ? 'Aguardando Pagamento Pix' : (paymentMethod === 'boleto' ? 'Aguardando Compensação Boleto' : 'Confirmado (Cartão)');
    document.getElementById('conf-customer-address').innerText = `${street}, Nº ${number} ${complement ? '- ' + complement : ''} | ${neighborhood} - ${city}, ${checkoutShippingState} - CEP ${cep}`;

    navigateTo('confirmation-view');
}

/* ==========================================================================
   FASE 2: AUTENTICAÇÃO DE USUÁRIOS
   ========================================================================== */

function openAuthModal() {
    document.getElementById('auth-modal').classList.add('active');
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('register-container').style.display = 'none';
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}

function updateAuthUI() {
    const badge = document.getElementById('user-name-badge');
    if (currentUser) {
        const firstName = currentUser.name.split(' ')[0];
        badge.innerText = `Olá, ${firstName}`;
    } else {
        badge.innerText = 'Entrar';
    }
}

function submitRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const cpf = document.getElementById('reg-cpf').value;
    const phone = document.getElementById('reg-phone').value;

    if (!name || !email || !password || !cpf || !phone) {
        alert('Por favor, preencha todos os campos do cadastro.');
        return;
    }

    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
        alert('Este e-mail já está cadastrado.');
        return;
    }

    const newUser = {
        name, email, password, cpf, phone,
        cep: '', state: '', city: '', street: '', number: '', neighborhood: '', complement: ''
    };

    users.push(newUser);
    localStorage.setItem('mn_users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('mn_current_user', JSON.stringify(currentUser));
    
    // Associar chat ao e-mail
    const visitorId = localStorage.getItem('mn_visitor_id');
    if (visitorId && chats[visitorId]) {
        chats[email] = chats[visitorId];
        delete chats[visitorId];
        saveChatsToStorage();
    }
    clientChatId = email;

    updateAuthUI();
    closeAuthModal();
    alert('Cadastro realizado com sucesso!');
}

function submitLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Por favor, insira e-mail e senha.');
        return;
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('mn_current_user', JSON.stringify(currentUser));

        // Mesclar chat do visitante com o da conta logada
        const visitorId = localStorage.getItem('mn_visitor_id');
        if (visitorId && chats[visitorId]) {
            if (!chats[email]) chats[email] = [];
            chats[email] = [...chats[email], ...chats[visitorId]];
            delete chats[visitorId];
            saveChatsToStorage();
        }
        clientChatId = email;

        updateAuthUI();
        closeAuthModal();
    } else {
        alert('E-mail ou senha incorretos.');
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('mn_current_user');
    
    // Gerar novo ID de visitante para chat
    clientChatId = 'visitante_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('mn_visitor_id', clientChatId);

    updateAuthUI();
    navigateTo('store-view');
}

function renderAccountProfile() {
    if (!currentUser) return;

    document.getElementById('prof-name').value = currentUser.name || '';
    document.getElementById('prof-email').value = currentUser.email || '';
    document.getElementById('prof-phone').value = currentUser.phone || '';
    document.getElementById('prof-cpf').value = currentUser.cpf || '';
    document.getElementById('prof-cep').value = currentUser.cep || '';
    document.getElementById('prof-street').value = currentUser.street || '';
    document.getElementById('prof-number').value = currentUser.number || '';
    document.getElementById('prof-neighborhood').value = currentUser.neighborhood || '';
    document.getElementById('prof-city').value = currentUser.city || '';
    document.getElementById('prof-complement').value = currentUser.complement || '';
    document.getElementById('prof-state').value = currentUser.state || '';

    // Renderizar histórico de pedidos do cliente
    renderCustomerOrdersHistory();
}

function saveUserProfile() {
    if (!currentUser) return;

    currentUser.name = document.getElementById('prof-name').value;
    currentUser.phone = document.getElementById('prof-phone').value;
    currentUser.cpf = document.getElementById('prof-cpf').value;
    currentUser.cep = document.getElementById('prof-cep').value;
    currentUser.street = document.getElementById('prof-street').value;
    currentUser.number = document.getElementById('prof-number').value;
    currentUser.neighborhood = document.getElementById('prof-neighborhood').value;
    currentUser.city = document.getElementById('prof-city').value;
    currentUser.complement = document.getElementById('prof-complement').value;
    currentUser.state = document.getElementById('prof-state').value;

    // Atualizar na lista geral de usuários
    const idx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
    if (idx > -1) {
        users[idx] = currentUser;
    }
    
    localStorage.setItem('mn_users', JSON.stringify(users));
    localStorage.setItem('mn_current_user', JSON.stringify(currentUser));
    
    updateAuthUI();
    alert('Dados de perfil atualizados com sucesso!');
}

function renderCustomerOrdersHistory() {
    const container = document.getElementById('customer-orders-container');
    if (!container) return;

    // Filtrar pedidos pelo e-mail do cliente
    const myOrders = orders.filter(o => o.customer.email.toLowerCase() === currentUser.email.toLowerCase());

    if (myOrders.length === 0) {
        container.innerHTML = `<p class="placeholder-text" style="border:none;">Você ainda não realizou nenhum pedido.</p>`;
        return;
    }

    container.innerHTML = '';
    myOrders.forEach(o => {
        const dateObj = new Date(o.date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        
        const card = document.createElement('div');
        card.className = 'customer-order-card';
        card.innerHTML = `
            <div class="customer-order-header">
                <span class="order-id-label">${o.id}</span>
                <span>${formattedDate}</span>
            </div>
            <div class="customer-order-items">
                ${o.items.map(item => `
                    <div>${item.name} (${item.color} - ${item.size}) x${item.qty}</div>
                `).join('')}
            </div>
            <div class="customer-order-footer">
                <span>Total: <strong>R$ ${o.totalPrice.toFixed(2).replace('.', ',')}</strong></span>
                <span class="status-badge ${getStatusBadgeClass(o.status)}">${getStatusLabel(o.status)}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

/* ==========================================================================
   FASE 2: SISTEMA DE CHAT DE SUPORTE
   ========================================================================== */

function renderClientChat() {
    const container = document.getElementById('chat-widget-messages-container');
    if (!container) return;

    const thread = chats[clientChatId] || [];

    // Se estiver vazio, exibir boas-vindas inicial de Marilene
    if (thread.length === 0) {
        container.innerHTML = `
            <div class="chat-msg msg-left">
                Olá! Sou Marilene Naumebore. Agradecemos o contato! Como posso ajudar você hoje em relação aos moletons ou envio?
                <span class="chat-msg-time">${getCurrentTimeStr()}</span>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    thread.forEach(msg => {
        const msgType = msg.sender === 'client' ? 'msg-right' : 'msg-left';
        
        const div = document.createElement('div');
        div.className = `chat-msg ${msgType}`;
        div.innerHTML = `
            ${msg.text}
            <span class="chat-msg-time">${msg.time}</span>
        `;
        container.appendChild(div);
    });

    // Scroll para a última mensagem
    container.scrollTop = container.scrollHeight;
}

function sendClientChatMessage() {
    const input = document.getElementById('chat-widget-input');
    const text = input.value.trim();
    if (!text) return;

    if (!chats[clientChatId]) {
        chats[clientChatId] = [];
    }

    const newMsg = {
        sender: 'client',
        text: text,
        time: getCurrentTimeStr(),
        senderName: currentUser ? currentUser.name : 'Visitante'
    };

    chats[clientChatId].push(newMsg);
    saveChatsToStorage();
    renderClientChat();
    input.value = '';

    // Simular resposta automática no primeiro contato do cliente
    if (chats[clientChatId].filter(m => m.sender === 'client').length === 1) {
        setTimeout(() => {
            const supportReply = {
                sender: 'support',
                text: 'Recebemos sua mensagem! Um de nossos atendentes irá analisar sua solicitação e responderá o mais breve possível. Muito obrigada pelo contato!',
                time: getCurrentTimeStr(),
                senderName: 'Suporte Marilene'
            };
            chats[clientChatId].push(supportReply);
            saveChatsToStorage();
            renderClientChat();
            
            // Tocar som de notificação fictício ou animar widget
            document.getElementById('chat-client-badge').innerText = '1';
            document.getElementById('chat-client-badge').style.display = 'flex';
        }, 1500);
    }
}

function getCurrentTimeStr() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/* Chat Administrativo */
function renderAdminChatThreads() {
    const container = document.getElementById('admin-chat-threads-container');
    if (!container) return;

    container.innerHTML = '';
    const activeThreads = Object.keys(chats);

    if (activeThreads.length === 0) {
        container.innerHTML = `<p class="placeholder-text" style="border:none; margin: 20px;">Nenhuma conversa iniciada ainda.</p>`;
        return;
    }

    // Contagem total de threads não respondidas
    let totalUnreadChats = 0;

    activeThreads.forEach(chatId => {
        const messages = chats[chatId];
        const lastMsg = messages[messages.length - 1];
        if (!lastMsg) return;

        // Se a última mensagem veio do cliente, conta como unread para o admin
        const isUnread = lastMsg.sender === 'client';
        if (isUnread) totalUnreadChats++;

        const senderName = lastMsg.senderName || (chatId.startsWith('visitante_') ? 'Visitante Fictício' : chatId);

        const card = document.createElement('div');
        card.className = `thread-card ${chatId === activeChatId ? 'active' : ''}`;
        card.innerHTML = `
            <div class="thread-details">
                <span class="thread-name">${senderName}</span>
                <span class="thread-preview">${lastMsg.text}</span>
            </div>
            ${isUnread ? `<span class="thread-badge">!</span>` : ''}
        `;
        card.addEventListener('click', () => {
            activeChatId = chatId;
            renderAdminChatThreads();
            renderAdminActiveChat(chatId);
        });

        container.appendChild(card);
    });

    // Atualizar badge no menu admin
    const chatMenuBadge = document.getElementById('admin-chat-badge');
    chatMenuBadge.innerText = totalUnreadChats;
    chatMenuBadge.style.display = totalUnreadChats > 0 ? 'inline-block' : 'none';
}

function renderAdminActiveChat(chatId) {
    const header = document.getElementById('admin-chat-active-header');
    const container = document.getElementById('admin-chat-messages-container');
    const inputWrapper = document.getElementById('admin-chat-input-wrapper');

    if (!container || !header) return;

    const messages = chats[chatId] || [];
    const clientName = messages[0] ? (messages.find(m => m.sender === 'client')?.senderName || chatId) : chatId;

    header.innerText = `Atendimento: ${clientName} (${chatId})`;
    inputWrapper.style.display = 'flex';

    container.innerHTML = '';
    messages.forEach(msg => {
        const msgType = msg.sender === 'support' ? 'msg-right' : 'msg-left';
        
        const div = document.createElement('div');
        div.className = `chat-msg ${msgType}`;
        div.innerHTML = `
            <strong>${msg.sender === 'support' ? 'Suporte' : (msg.senderName || 'Cliente')}:</strong><br>
            ${msg.text}
            <span class="chat-msg-time">${msg.time}</span>
        `;
        container.appendChild(div);
    });

    container.scrollTop = container.scrollHeight;
}

function sendAdminChatMessage() {
    const input = document.getElementById('admin-chat-input');
    const text = input.value.trim();
    if (!text || !activeChatId) return;

    const newMsg = {
        sender: 'support',
        text: text,
        time: getCurrentTimeStr(),
        senderName: 'Suporte Marilene'
    };

    chats[activeChatId].push(newMsg);
    saveChatsToStorage();
    renderAdminActiveChat(activeChatId);
    input.value = '';
    
    // Atualizar threads da sidebar
    renderAdminChatThreads();
}

/* ==========================================================================
   FASE 2: GERENCIAMENTO DE PRODUTOS
   ========================================================================== */

function renderAdminProducts() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <img src="${p.imagePrefix}_branco.jpg" alt="${p.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: var(--radius-sm);" onerror="this.src='https://placehold.co/100x100?text=MN'">
            </td>
            <td><strong>${p.name}</strong></td>
            <td>R$ ${p.basePrice.toFixed(2).replace('.', ',')}</td>
            <td><span class="status-badge status-delivered">${p.tag || 'Comum'}</span></td>
            <td>
                <div class="actions-cell">
                    <button class="btn btn-secondary btn-small" onclick="deleteProductFromCatalog('${p.id}')" style="color:var(--accent-terracota); border-color:rgba(200,90,68,0.2);">Excluir</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function addProductToCatalog() {
    const name = document.getElementById('new-prod-name').value.trim();
    const price = parseFloat(document.getElementById('new-prod-price').value);
    const tag = document.getElementById('new-prod-tag').value.trim();
    const description = document.getElementById('new-prod-desc').value.trim();

    if (!name || isNaN(price) || !description) {
        alert('Por favor, preencha os campos obrigatórios (Nome, Preço de Venda e Descrição).');
        return;
    }

    // Cores selecionadas
    const colorEls = document.querySelectorAll('input[name="new-prod-colors"]:checked');
    const selectedColors = Array.from(colorEls).map(el => el.value);

    // Tamanhos selecionados
    const sizeEls = document.querySelectorAll('input[name="new-prod-sizes"]:checked');
    const selectedSizes = Array.from(sizeEls).map(el => el.value);

    if (selectedColors.length === 0 || selectedSizes.length === 0) {
        alert('Selecione pelo menos uma Cor e um Tamanho disponível para o produto.');
        return;
    }

    // Gerar ID simplificado a partir do nome
    const id = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const exists = products.some(p => p.id === id);
    if (exists) {
        alert('Já existe um produto cadastrado com este nome.');
        return;
    }

    // Criar Objeto Produto
    const newProduct = {
        id,
        name,
        basePrice: price,
        description,
        imagePrefix: 'assets/hoodie_quem_protege', // Fallback para moletom padrão
        colors: selectedColors,
        sizes: selectedSizes,
        tag: tag || 'Lançamento'
    };

    // Adicionar ao array global
    products.push(newProduct);
    localStorage.setItem('mn_products', JSON.stringify(products));

    // Inicializar estoque padrão (15 unidades) para as novas variações
    selectedColors.forEach(color => {
        selectedSizes.forEach(size => {
            const key = `${id}_${color}_${size}`;
            stock[key] = {
                qty: 15,
                price: price
            };
        });
    });
    saveStockToStorage();

    // Limpar formulário
    document.getElementById('add-product-form').reset();

    // Recarregar grids
    renderProductGrid();
    renderAdminProducts();
    alert(`Moletom "${name}" adicionado com sucesso ao catálogo!`);
}

function deleteProductFromCatalog(productId) {
    if (confirm('Deseja realmente excluir este produto e todas as suas variações de estoque?')) {
        // Remover produto
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('mn_products', JSON.stringify(products));

        // Limpar variações de estoque associadas a esse produto
        Object.keys(stock).forEach(key => {
            if (key.startsWith(productId + '_')) {
                delete stock[key];
            }
        });
        saveStockToStorage();

        // Recarregar
        renderProductGrid();
        renderAdminProducts();
    }
}

/* ==========================================================================
   PAINEL ADMINISTRATIVO (ADMIN CONTROL)
   ========================================================================== */

function enterAdminPanel() {
    navigateTo('admin-view');
    const dashboardTab = document.querySelector('[data-tab="admin-dashboard"]');
    if (dashboardTab) dashboardTab.click();
}

function renderAdminDashboard() {
    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalOrders = orders.length;
    const ticket = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
    
    let lowStockCount = 0;
    Object.keys(stock).forEach(key => {
        if (stock[key].qty < 5) lowStockCount++;
    });

    document.getElementById('metric-revenue').innerText = `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`;
    document.getElementById('metric-orders').innerText = totalOrders;
    document.getElementById('metric-ticket').innerText = `R$ ${ticket.toFixed(2).replace('.', ',')}`;
    document.getElementById('metric-low-stock').innerText = lowStockCount;

    const lowStockDesc = document.getElementById('low-stock-desc');
    if (lowStockCount > 0) {
        lowStockDesc.innerText = `Atenção: ${lowStockCount} variações críticas!`;
        lowStockDesc.className = 'metric-change negative';
    } else {
        lowStockDesc.innerText = 'Todos os produtos bem abastecidos';
        lowStockDesc.className = 'metric-change positive';
    }

    const recentSalesContainer = document.getElementById('recent-sales-container');
    recentSalesContainer.innerHTML = '';
    
    const lastFive = orders.slice(0, 5);
    if (lastFive.length === 0) {
        recentSalesContainer.innerHTML = `<p class="placeholder-text" style="margin: 20px;">Nenhuma venda realizada ainda.</p>`;
    } else {
        lastFive.forEach(o => {
            const dateObj = new Date(o.date);
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
            
            const row = document.createElement('div');
            row.className = 'recent-sale-row';
            row.innerHTML = `
                <div class="recent-sale-left">
                    <span class="recent-sale-cust">${o.customer.name}</span>
                    <span class="recent-sale-time">${formattedDate} | Envio: ${o.shippingMethod}</span>
                </div>
                <div class="recent-sale-right">
                    <span class="recent-sale-val">R$ ${o.totalPrice.toFixed(2).replace('.', ',')}</span>
                    <span class="recent-sale-status status-badge ${getStatusBadgeClass(o.status)}">${getStatusLabel(o.status)}</span>
                </div>
            `;
            recentSalesContainer.appendChild(row);
        });
    }

    renderDashboardChart();
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'pending': return 'status-pending';
        case 'preparing': return 'status-preparing';
        case 'shipped': return 'status-shipped';
        case 'delivered': return 'status-delivered';
        default: return 'status-pending';
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'pending': return 'Pendente';
        case 'preparing': return 'Preparando';
        case 'shipped': return 'Enviado';
        case 'delivered': return 'Entregue';
        default: return 'Pendente';
    }
}

function renderDashboardChart() {
    const container = document.getElementById('admin-chart-placeholder');
    if (!container) return;

    const chartData = [1200, 1850, 1500, 2400, 3100, 2800, 0];
    
    const today = new Date();
    let todaySum = 0;
    orders.forEach(o => {
        const orderDate = new Date(o.date);
        if (orderDate.toDateString() === today.toDateString()) {
            todaySum += o.totalPrice;
        }
    });
    chartData[6] = Math.max(todaySum, 150);

    const width = 500;
    const height = 200;
    const padding = 30;
    
    const maxVal = Math.max(...chartData) * 1.1;
    const points = chartData.map((val, idx) => {
        const x = padding + (idx * (width - (padding * 2)) / (chartData.length - 1));
        const y = height - padding - (val * (height - (padding * 2)) / maxVal);
        return { x, y, val };
    });

    const pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L ${points[points.length-1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    container.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">
            <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#d4af37" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#d4af37" stop-opacity="0.0"/>
                </linearGradient>
            </defs>
            <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" class="chart-grid-line" />
            <line x1="${padding}" y1="${(height - padding * 2) / 2 + padding}" x2="${width - padding}" y2="${(height - padding * 2) / 2 + padding}" class="chart-grid-line" />
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" class="chart-grid-line" style="stroke: rgba(255,255,255,0.15);" />
            
            <path d="${areaD}" fill="url(#chart-gradient)" />
            <path d="${pathD}" class="chart-line" />
            
            ${points.map((p, idx) => `
                <circle cx="${p.x}" cy="${p.y}" r="4" fill="#d4af37" stroke="#121216" stroke-width="2" />
                <text x="${p.x}" y="${height - 10}" text-anchor="middle" class="chart-label">${daysOfWeek[idx]}</text>
                <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" class="chart-label" style="font-size: 8px; fill: #d4af37; font-weight: 700;">R$ ${Math.round(p.val)}</text>
            `).join('')}
        </svg>
    `;
}

function renderAdminOrders() {
    const tbody = document.getElementById('admin-orders-tbody');
    const filterStatus = document.getElementById('filter-order-status').value;
    const pendingBadge = document.getElementById('admin-pending-badge');
    
    if (!tbody) return;

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    pendingBadge.innerText = pendingCount;
    pendingBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';

    tbody.innerHTML = '';

    const filtered = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="placeholder-text" style="text-align:center; padding: 40px;">Nenhum pedido encontrado.</td></tr>`;
        return;
    }

    filtered.forEach(o => {
        const dateObj = new Date(o.date);
        const dateStr = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="order-id-label">${o.id}</span></td>
            <td>
                <div class="order-customer-meta">
                    <strong>${o.customer.name}</strong>
                    <span>${o.customer.email}</span>
                    <span class="cust-phone-sub">${o.customer.phone}</span>
                </div>
            </td>
            <td>
                <div class="order-items-meta">
                    ${o.items.map(item => `
                        <span class="order-item-tag"><strong>${item.name}</strong> | Cor: ${item.color} | Tam: ${item.size} (x${item.qty})</span>
                    `).join('')}
                </div>
            </td>
            <td><strong>R$ ${o.totalPrice.toFixed(2).replace('.', ',')}</strong></td>
            <td>${o.shippingMethod} - ${o.customer.city}/${o.customer.state}</td>
            <td>${dateStr}</td>
            <td>
                <select class="admin-select" onchange="updateOrderStatus('${o.id}', this.value)">
                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pendente</option>
                    <option value="preparing" ${o.status === 'preparing' ? 'selected' : ''}>Preparando</option>
                    <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                    <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Entregue</option>
                </select>
            </td>
            <td>
                <div class="actions-cell">
                    <button class="btn btn-secondary btn-small" onclick="deleteOrder('${o.id}')" style="color:var(--accent-terracota); border-color:rgba(200,90,68,0.2);">Excluir</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateOrderStatus(orderId, newStatus) {
    const o = orders.find(ord => ord.id === orderId);
    if (o) {
        o.status = newStatus;
        saveOrdersToStorage();
        const pendingCount = orders.filter(ord => ord.status === 'pending').length;
        const pendingBadge = document.getElementById('admin-pending-badge');
        pendingBadge.innerText = pendingCount;
        pendingBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
        
        if (document.getElementById('admin-dashboard').classList.contains('active')) {
            renderAdminDashboard();
        }
    }
}

function deleteOrder(orderId) {
    if (confirm(`Deseja realmente excluir o pedido ${orderId}? Esta ação não afeta o estoque físico.`)) {
        orders = orders.filter(o => o.id !== orderId);
        saveOrdersToStorage();
        renderAdminOrders();
    }
}

function renderAdminStock() {
    const tbody = document.getElementById('admin-stock-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    products.forEach(p => {
        p.colors.forEach(color => {
            p.sizes.forEach(size => {
                const key = `${p.id}_${color}_${size}`;
                const item = stock[key];
                if (!item) return;

                const tr = document.createElement('tr');
                tr.setAttribute('data-stock-key', key);
                
                let statusHtml = '<span class="status-badge status-delivered">Normal</span>';
                if (item.qty <= 0) {
                    statusHtml = '<span class="status-badge status-pending">Esgotado</span>';
                } else if (item.qty < 5) {
                    statusHtml = '<span class="status-badge status-preparing">Baixo</span>';
                }

                tr.innerHTML = `
                    <td><strong>${p.name}</strong></td>
                    <td>${color}</td>
                    <td><span style="font-weight:700;">${size}</span></td>
                    <td>
                        <input type="number" class="stock-input" value="${item.qty}" min="0">
                    </td>
                    <td>
                        <div class="price-input-wrapper">
                            <span class="price-input-prefix">R$</span>
                            <input type="number" class="price-input" value="${item.price.toFixed(2)}" step="0.01" min="0">
                        </div>
                    </td>
                    <td>${statusHtml}</td>
                `;
                tbody.appendChild(tr);
            });
        });
    });
}

function saveAdminStockChanges() {
    const tbody = document.getElementById('admin-stock-tbody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
        const key = row.getAttribute('data-stock-key');
        if (!key) return;

        const qtyInput = row.querySelector('.stock-input');
        const priceInput = row.querySelector('.price-input');

        if (qtyInput && priceInput) {
            const newQty = parseInt(qtyInput.value) || 0;
            const newPrice = parseFloat(priceInput.value) || 0;

            stock[key] = {
                qty: newQty,
                price: newPrice
            };
        }
    });

    saveStockToStorage();
    alert('Alterações de estoque e preços salvas com sucesso!');
    renderProductGrid();
    renderAdminStock();
}

/* ==========================================================================
   DISPARO DA APLICAÇÃO
   ========================================================================== */

window.addEventListener('DOMContentLoaded', initApp);
