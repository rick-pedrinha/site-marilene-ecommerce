/* ==========================================================================
   BANCO DE DADOS LOCAL & ESTRUTURA DE ESTADO (LOCALSTORAGE)
   ========================================================================== */

// Configurações e seed dos produtos
const initialProducts = [
    {
        id: 'quem-protege',
        sku: 'MAR-0001',
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
        sku: 'MAR-0002',
        name: 'Moletom "MARIA"',
        basePrice: 299.90,
        description: 'Moletom de alta qualidade com corte streetwear contemporâneo. A estampa traz a icônica silhueta de uma mulher negra com cabelo afro e flor vermelha exuberante, celebrando a identidade, força e legado das mulheres brasileiras. Uma peça de alta costura com significado social e estético.',
        imagePrefix: 'assets/hoodie_maria',
        colors: ['Branco', 'Preto'],
        sizes: ['P', 'M', 'G', 'GG'],
        tag: 'Coleção Raízes'
    }
];

// Versão oficial do catálogo: 2 estampas × 2 cores = 4 casacos na vitrine.
// Ao mudar este valor, navegadores com cópias antigas recebem novamente o catálogo do Git.
const catalogVersion = '2026-07-four-hoodies-v1';

function cloneInitialProducts() {
    return initialProducts.map(product => ({
        ...product,
        colors: [...product.colors],
        sizes: [...product.sizes]
    }));
}

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

// Configuração pública do backend. A chave publicável pode ficar no navegador;
// permissões administrativas continuam protegidas pelas regras do Supabase.
const supabaseConfig = Object.freeze({
    url: 'https://jlmzisqtashbdsppryso.supabase.co',
    publicKey: 'sb_publishable_KVGBrXgrSr3PqcBDIq7DeQ_ntOl4uYP'
});

const supabaseClient = window.supabase?.createClient(
    supabaseConfig.url,
    supabaseConfig.publicKey,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
) || null;

const backendConfig = Object.freeze({
    apiUrl: (document.querySelector('meta[name="store-api-url"]')?.content || '').replace(/\/$/, '')
});

const pixConfig = Object.freeze({
    key: (document.querySelector('meta[name="pix-key"]')?.content || '').trim(),
    recipient: (document.querySelector('meta[name="pix-recipient"]')?.content || 'Marilene').trim()
});

// Estado global da aplicação
let products = [];
let stock = {};
let cart = [];
let orders = [];

// Autenticação
let currentUser = null;
let adminSessionActive = false;

// Sessão Supabase compartilhada por clientes e administradores.
let adminAccessToken = sessionStorage.getItem('mn_auth_access_token') || sessionStorage.getItem('mn_admin_access_token') || '';
let adminRefreshToken = sessionStorage.getItem('mn_auth_refresh_token') || sessionStorage.getItem('mn_admin_refresh_token') || '';
let currentAuthUser = null;
let ordersRealtimeChannel = null;
let cancellationOrderId = '';
let adminEditingOrderId = '';

// Estado da compra atual (Checkout)
let checkoutShippingState = null; // DF, SP, etc.
let checkoutShippingCost = 0;
let checkoutShippingMethod = '';
let checkoutDiscount = 0;

function formatProductSku(index) {
    return `MAR-${String(index + 1).padStart(4, '0')}`;
}

function normalizeProductSkus() {
    let changed = false;
    products = products.map((product, index) => {
        const sku = formatProductSku(index);
        if (product.sku === sku) return product;
        changed = true;
        return { ...product, sku };
    });

    if (changed) {
        localStorage.setItem('mn_products', JSON.stringify(products));
    }
}

/* ==========================================================================
   FUNÇÕES DE INICIALIZAÇÃO E PERSISTÊNCIA
   ========================================================================== */

function initApp() {
    // 1. Sincronizar uma vez com o catálogo oficial do Git e depois preservar edições do admin
    const storedCatalogVersion = localStorage.getItem('mn_catalog_version');
    const storedProducts = localStorage.getItem('mn_products');
    if (storedCatalogVersion !== catalogVersion || !storedProducts) {
        products = cloneInitialProducts();
        localStorage.setItem('mn_products', JSON.stringify(products));
        localStorage.setItem('mn_catalog_version', catalogVersion);
    } else {
        try {
            products = JSON.parse(storedProducts);
            if (!Array.isArray(products) || products.length === 0) throw new Error('Catálogo inválido');
        } catch (error) {
            products = cloneInitialProducts();
            localStorage.setItem('mn_products', JSON.stringify(products));
        }
    }
    normalizeProductSkus();

    // 2. Inicializar ou carregar estoque e restaurar variações que estiverem faltando
    if (localStorage.getItem('mn_stock')) {
        stock = JSON.parse(localStorage.getItem('mn_stock'));
    } else {
        stock = {};
    }

    let stockChanged = false;
    products.forEach(p => {
        p.colors.forEach(color => {
            p.sizes.forEach(size => {
                const key = `${p.id}_${color}_${size}`;
                if (!stock[key]) {
                    stock[key] = { qty: 15, price: p.basePrice };
                    stockChanged = true;
                }
            });
        });
    });
    if (stockChanged || !localStorage.getItem('mn_stock')) {
        saveStockToStorage();
    }

    // 3. Inicializar ou carregar pedidos
    if (localStorage.getItem('mn_orders')) {
        orders = JSON.parse(localStorage.getItem('mn_orders'));
    } else {
      orders = [];
    }

    // 4. O usuário autenticado será restaurado pelo Supabase.
    currentUser = null;

    // 6. Carregar carrinho
    if (localStorage.getItem('mn_cart')) {
        cart = JSON.parse(localStorage.getItem('mn_cart'));
    }

    // Renderizações Iniciais
    renderProductGrid();
    updateCartUI();
    updateAuthUI();
    restoreAdminSession();
    
    // Configurar listeners gerais
    setupEventListeners();
    syncCatalogFromServer();
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

function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
}

function onlyDigits(value) {
    return String(value || '').replace(/\D/g, '');
}

function formatCpf(value) {
    return onlyDigits(value).slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(value) {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function formatCep(value) {
    return onlyDigits(value).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
}

function isValidCpf(value) {
    const cpf = onlyDigits(value);
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    const digit = factor => {
        let total = 0;
        for (let index = 0; index < factor - 1; index += 1) total += Number(cpf[index]) * (factor - index);
        const remainder = (total * 10) % 11;
        return remainder === 10 ? 0 : remainder;
    };
    return digit(10) === Number(cpf[9]) && digit(11) === Number(cpf[10]);
}

function getOrderOwnerEmail(order) {
    return normalizeEmail(order?.accountEmail || order?.customer?.email);
}

function mapOrderRow(row) {
    return {
        ...(row.order_data || {}),
        id: row.id,
        accountEmail: row.account_email,
        paymentStatus: row.payment_status,
        status: row.status,
        date: row.created_at,
        deliveredAt: row.delivered_at,
        cancellationStatus: row.cancellation_status,
        cancellationRequestedAt: row.cancellation_requested_at,
        cancellationReason: row.cancellation_reason,
        returnStatus: row.return_status,
        refundStatus: row.refund_status,
        refundAmount: row.refund_amount === null ? null : Number(row.refund_amount),
        refundReference: row.refund_reference,
        refundedAt: row.refunded_at
    };
}

async function syncOrdersFromServer() {
    if (!adminAccessToken || !currentAuthUser) return false;
    let path = '/rest/v1/orders?select=*&order=created_at.desc';
    if (!adminSessionActive) path += `&user_id=eq.${encodeURIComponent(currentAuthUser.id)}`;
    try {
        const rows = await supabaseRequest(path, { method: 'GET', accessToken: adminAccessToken });
        orders = Array.isArray(rows) ? rows.map(mapOrderRow) : [];
        saveOrdersToStorage();
        if (adminSessionActive && document.getElementById('admin-view').classList.contains('active')) {
            renderAdminDashboard();
            renderAdminOrders();
        }
        if (!adminSessionActive && document.getElementById('account-view').classList.contains('active')) {
            renderCustomerOrdersHistory();
        }
        return true;
    } catch (error) {
        console.warn('Não foi possível sincronizar os pedidos:', error.message);
        return false;
    }
}

async function createOrderOnServer(order) {
    if (!adminAccessToken || !currentAuthUser?.id) throw new Error('Faça login antes de finalizar o pedido.');
    const rows = await supabaseRequest('/rest/v1/orders', {
        method: 'POST', accessToken: adminAccessToken,
        headers: { Prefer: 'return=representation' },
        body: {
            id: order.id,
            user_id: currentAuthUser.id,
            account_email: normalizeEmail(currentAuthUser.email),
            order_data: order,
            payment_status: order.paymentStatus,
            status: order.status,
            created_at: order.date
        }
    });
    if (!Array.isArray(rows) || !rows[0]) throw new Error('O pedido não foi salvo no sistema.');
    return mapOrderRow(rows[0]);
}

function subscribeToOrdersRealtime() {
    if (!supabaseClient || !adminAccessToken || !currentAuthUser) return;
    supabaseClient.realtime.setAuth(adminAccessToken);
    if (ordersRealtimeChannel) supabaseClient.removeChannel(ordersRealtimeChannel);
    ordersRealtimeChannel = supabaseClient
        .channel(`orders-${currentAuthUser.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => syncOrdersFromServer())
        .subscribe();
}

async function backendApiRequest(path, options = {}) {
    const response = await fetch(`${backendConfig.apiUrl}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(payload?.error || 'Não foi possível conectar ao servidor da loja.');
    }
    return payload;
}

async function syncCatalogFromServer() {
    try {
        const payload = await backendApiRequest('/api/catalog');
        if (!payload?.stock || typeof payload.stock !== 'object') return;
        stock = { ...stock, ...payload.stock };
        cart = cart.map(item => {
            const officialItem = stock[`${item.productId}_${item.color}_${item.size}`];
            return officialItem ? { ...item, price: officialItem.price } : item;
        });
        saveStockToStorage();
        saveCartToStorage();
        renderProductGrid();
        updateCartUI();
    } catch (error) {
        // No GitHub Pages sem backend publicado, o catálogo local continua disponível.
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
    const floatingCartBtn = document.getElementById('floating-cart-btn');
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
    floatingCartBtn.addEventListener('click', openCart);
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

    // Submissão do Pedido
    document.getElementById('submit-order-btn').addEventListener('click', submitOrder);
    document.getElementById('copy-pix-key-btn').addEventListener('click', copyPixKey);

    // Botões de Confirmação
    document.getElementById('conf-back-to-store-btn').addEventListener('click', () => {
        navigateTo('store-view');
    });

    document.getElementById('conf-my-orders-btn').addEventListener('click', async () => {
        if (!currentUser) {
            openAuthModal();
            return;
        }
        await syncOrdersFromServer();
        renderAccountProfile();
        navigateTo('account-view');
    });

    document.getElementById('conf-admin-view-btn').addEventListener('click', () => {
        enterAdminPanel();
    });

    document.getElementById('close-cancellation-modal-btn').addEventListener('click', closeCancellationModal);
    document.getElementById('cancel-cancellation-request-btn').addEventListener('click', closeCancellationModal);
    document.getElementById('confirm-cancellation-request-btn').addEventListener('click', submitCancellationRequest);
    document.getElementById('close-admin-order-edit-btn').addEventListener('click', closeAdminOrderEditor);
    document.getElementById('cancel-admin-order-edit-btn').addEventListener('click', closeAdminOrderEditor);
    document.getElementById('save-admin-order-edit-btn').addEventListener('click', saveAdminOrderEdit);
    document.getElementById('admin-edit-shipping-cost').addEventListener('input', updateAdminEditTotal);
    document.getElementById('admin-edit-state').addEventListener('input', event => {
        event.target.value = event.target.value.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase();
    });
    document.getElementById('admin-edit-cep').addEventListener('input', event => {
        event.target.value = formatCep(event.target.value);
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
    document.getElementById('export-orders-csv-btn').addEventListener('click', downloadOrdersCsv);
    document.getElementById('refresh-orders-btn').addEventListener('click', refreshAdminOrders);

    // ==========================================
    // LISTENERS DE AUTENTICAÇÃO
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

    document.getElementById('nav-my-orders-link').addEventListener('click', (event) => {
        event.preventDefault();
        if (!currentUser) return;
        renderAccountProfile();
        navigateTo('account-view');
    });

    document.getElementById('close-auth-modal-btn').addEventListener('click', closeAuthModal);
    
    // Alternar entre login e cadastro
    document.getElementById('go-to-register-link').addEventListener('click', (e) => {
        e.preventDefault();
        setAuthStatus('');
        document.querySelector('#auth-modal .auth-modal-card')?.classList.add('is-registering');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('register-container').style.display = 'block';
    });

    document.getElementById('go-to-login-link').addEventListener('click', (e) => {
        e.preventDefault();
        setAuthStatus('');
        document.querySelector('#auth-modal .auth-modal-card')?.classList.remove('is-registering');
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
    });

    // Ações de Login e Cadastro
    document.getElementById('submit-login-btn').addEventListener('click', submitLogin);
    document.getElementById('submit-register-btn').addEventListener('click', submitRegister);
    document.getElementById('reg-cpf').addEventListener('input', event => {
        event.target.value = formatCpf(event.target.value);
    });
    document.getElementById('reg-phone').addEventListener('input', event => {
        event.target.value = formatPhone(event.target.value);
    });
    document.getElementById('reg-cep').addEventListener('input', event => {
        event.target.value = formatCep(event.target.value);
    });
    document.getElementById('reg-state').addEventListener('input', event => {
        event.target.value = event.target.value.replace(/[^a-z]/gi, '').slice(0, 2).toUpperCase();
    });
    
    // Sair da conta e Voltar ao perfil
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
    document.getElementById('account-back-to-store-btn').addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('store-view');
    });

    // Salvar edições do Perfil
    document.getElementById('save-profile-btn').addEventListener('click', saveUserProfile);

    // Cadastrar Novo Produto
    document.getElementById('submit-new-product-btn').addEventListener('click', addProductToCatalog);

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
    const hasAdminAccess = adminSessionActive && currentUser?.role === 'admin';

    if (hasAdminAccess) {
        const adminBanner = document.createElement('div');
        adminBanner.className = 'store-admin-banner';
        adminBanner.innerHTML = `
            <div>
                <strong>Modo de edição rápida ativo</strong>
                <span>Altere preço e estoque de cada cor diretamente nos cards abaixo.</span>
            </div>
            <button class="btn btn-secondary btn-small" type="button" onclick="enterAdminPanel()">Abrir painel completo</button>
        `;
        container.appendChild(adminBanner);
    }

    products.forEach(p => {
        // Encontrar preço mínimo real nas variações de estoque.
        const variationPrices = [];
        p.colors.forEach(col => {
            p.sizes.forEach(sz => {
                const item = stock[`${p.id}_${col}_${sz}`];
                if (item && Number.isFinite(Number(item.price))) variationPrices.push(Number(item.price));
            });
        });
        const minPrice = variationPrices.length ? Math.min(...variationPrices) : p.basePrice;

        p.colors.forEach(color => {
            const displayImage = `${p.imagePrefix}_${color.toLowerCase()}.jpg`;
            const card = document.createElement('article');
            card.className = `product-card${hasAdminAccess ? ' admin-product-card' : ''}`;
            card.innerHTML = `
                <button class="product-card-image-box" onclick="openProductModal('${p.id}', '${color}')" aria-label="Ver ${p.name} na cor ${color}">
                    <img src="${displayImage}" alt="${p.name} na cor ${color}" class="product-card-img" onerror="this.src='https://placehold.co/400x400?text=Moletom+Marilene'">
                    <span class="product-card-badge">${p.tag || 'Exclusivo'}</span>
                    <span class="product-card-color">${color}</span>
                </button>
                <div class="product-card-content">
                    <span class="product-eyebrow">SKU ${p.sku} · CASACO COM CAPUZ · ${color.toUpperCase()}</span>
                    <h3 class="product-card-title">${p.name}</h3>
                    <p class="product-card-desc">${p.description}</p>
                    <div class="product-payment-note">Pagamento direto por Pix</div>
                    <div class="product-card-footer">
                        <div><small>A partir de</small><span class="product-card-price">R$ ${minPrice.toFixed(2).replace('.', ',')}</span></div>
                        <button class="btn btn-primary btn-small" onclick="openProductModal('${p.id}', '${color}')">Fazer pedido</button>
                    </div>
                </div>
                ${hasAdminAccess ? renderStoreAdminEditor(p, color) : ''}
            `;
            container.appendChild(card);
        });
    });

    document.getElementById('add-admin-btn').addEventListener('click', addAdminFromPanel);
}

function renderStoreAdminEditor(product, color) {
    const colorStock = product.sizes.map(size => {
        const key = `${product.id}_${color}_${size}`;
        return stock[key] || { qty: 0, price: product.basePrice };
    });
    const price = colorStock.length ? Math.min(...colorStock.map(item => Number(item.price) || 0)) : product.basePrice;

    return `
        <div class="store-admin-editor" data-product-id="${product.id}" data-color="${color}">
            <div class="store-admin-editor-title">
                <span>⚙ Edição ADM</span>
                <small>${color}</small>
            </div>
            <label class="store-admin-price-field">
                <span>Preço para esta cor</span>
                <div><strong>R$</strong><input type="number" class="store-admin-price-input" value="${price.toFixed(2)}" min="0" step="0.01" inputmode="decimal"></div>
            </label>
            <div class="store-admin-stock-grid">
                ${product.sizes.map((size, index) => `
                    <label>
                        <span>${size}</span>
                        <input type="number" class="store-admin-qty-input" data-size="${size}" value="${colorStock[index].qty}" min="0" step="1" inputmode="numeric" aria-label="Quantidade tamanho ${size}">
                    </label>
                `).join('')}
            </div>
            <button class="btn btn-primary btn-block btn-small" type="button" onclick="saveStoreAdminChanges(this)">Salvar preço e quantidades</button>
        </div>
    `;
}

async function saveStoreAdminChanges(button) {
    if (!adminSessionActive || currentUser?.role !== 'admin') {
        alert('Sua sessão administrativa expirou. Entre novamente para editar a vitrine.');
        updateAuthUI();
        return;
    }

    const editor = button.closest('.store-admin-editor');
    const product = products.find(item => item.id === editor?.dataset.productId);
    const color = editor?.dataset.color;
    const priceInput = editor?.querySelector('.store-admin-price-input');
    const price = Number(String(priceInput?.value || '').replace(',', '.'));

    if (!product || !color || !Number.isFinite(price) || price <= 0) {
        alert('Digite um preço válido maior que zero.');
        return;
    }

    const quantityInputs = editor.querySelectorAll('.store-admin-qty-input');
    for (const input of quantityInputs) {
        const quantity = Number(input.value);
        if (!Number.isInteger(quantity) || quantity < 0) {
            alert(`Digite uma quantidade válida para o tamanho ${input.dataset.size}.`);
            input.focus();
            return;
        }
    }

    button.disabled = true;
    button.innerText = 'Salvando...';
    let serverSynced = false;
    try {
        await backendApiRequest('/api/admin/catalog', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${adminAccessToken}` },
            body: JSON.stringify({
                productId: product.id,
                color,
                variations: Array.from(quantityInputs).map(input => ({
                    size: input.dataset.size,
                    qty: Number(input.value),
                    price
                }))
            })
        });
        serverSynced = true;
    } catch (error) {
        console.warn('Catálogo salvo apenas neste navegador:', error.message);
    }

    quantityInputs.forEach(input => {
        const size = input.dataset.size;
        stock[`${product.id}_${color}_${size}`] = {
            qty: Number(input.value),
            price
        };
    });

    const productPrices = product.colors.flatMap(productColor => product.sizes.map(size => {
        return Number(stock[`${product.id}_${productColor}_${size}`]?.price);
    })).filter(Number.isFinite);
    product.basePrice = productPrices.length ? Math.min(...productPrices) : price;

    localStorage.setItem('mn_products', JSON.stringify(products));
    saveStockToStorage();
    renderProductGrid();
    showStoreAdminNotice(
        serverSynced
            ? `${product.name} (${color}): preço e estoque atualizados.`
            : 'Alteração local salva, mas o backend de pagamentos ainda precisa ser publicado.',
        !serverSynced
    );
}

function showStoreAdminNotice(message, warning = false) {
    document.querySelector('.store-admin-toast')?.remove();
    const notice = document.createElement('div');
    notice.className = `store-admin-toast${warning ? ' warning' : ''}`;
    notice.setAttribute('role', 'status');
    notice.innerText = `✓ ${message}`;
    document.body.appendChild(notice);
    requestAnimationFrame(() => notice.classList.add('active'));
    setTimeout(() => {
        notice.classList.remove('active');
        setTimeout(() => notice.remove(), 220);
    }, 2600);
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
                    <span class="modal-product-sku">SKU ${p.sku}</span>
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
                <p class="modal-payment-hint">Finalize o pedido e pague diretamente por Pix.</p>
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
            addToCart(p.id, p.sku, p.name, selectedColor, selectedSize, qty, currentPrice);
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

function addToCart(productId, sku, name, color, size, qty, price) {
    const existingIndex = cart.findIndex(item => 
        item.productId === productId && item.color === color && item.size === size
    );

    const stockKey = `${productId}_${color}_${size}`;
    const maxStock = stock[stockKey] ? stock[stockKey].qty : 0;

    if (existingIndex > -1) {
        let newQty = cart[existingIndex].qty + qty;
        if (newQty > maxStock) newQty = maxStock;
        cart[existingIndex].qty = newQty;
        cart[existingIndex].sku = sku;
    } else {
        cart.push({
            productId,
            sku,
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
    const floatingSubtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    badge.innerText = totalItems;
    
    const mobBadge = document.getElementById('mob-cart-badge');
    if (mobBadge) mobBadge.innerText = totalItems;
    const floatingBadge = document.getElementById('floating-cart-badge');
    const floatingTotal = document.getElementById('floating-cart-total');
    if (floatingBadge) floatingBadge.innerText = totalItems;
    if (floatingTotal) floatingTotal.innerText = `R$ ${floatingSubtotal.toFixed(2).replace('.', ',')}`;

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
        const itemSku = item.sku || products.find(product => product.id === item.productId)?.sku || '';

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div class="cart-item-img-box">
                <img src="${imgPath}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://placehold.co/100x100?text=MN'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-meta">
                    <h4>${item.name}</h4>
                    <span class="cart-item-variation-text">${itemSku ? `SKU ${itemSku} | ` : ''}Cor: ${item.color} | Tam: ${item.size}</span>
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

    const customerEmailInput = document.getElementById('cust-email');
    const hasCustomerAccount = Boolean(currentUser && currentUser.role !== 'admin');
    customerEmailInput.readOnly = hasCustomerAccount;
    customerEmailInput.classList.toggle('account-locked-field', hasCustomerAccount);
    customerEmailInput.title = hasCustomerAccount ? 'Pedido vinculado ao e-mail da sua conta' : '';

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
        document.getElementById('cust-state-uf').value = currentUser.state || '';
        document.getElementById('cust-complement').value = currentUser.complement || '';
        
        // Se tem CEP cadastrado, calcula frete
        if (currentUser.cep) {
            calculateFreight();
        }
    }

    calculateTotalCheckout();
}

function calculateTotalCheckout() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const discountRow = document.getElementById('discount-row');
    checkoutDiscount = 0;
    discountRow.style.display = 'none';

    const total = subtotal + checkoutShippingCost - checkoutDiscount;

    document.getElementById('checkout-shipping').innerText = checkoutShippingCost > 0 ? `R$ ${checkoutShippingCost.toFixed(2).replace('.', ',')}` : 'A calcular';
    document.getElementById('shipping-method-name').innerText = checkoutShippingMethod || 'Não selecionado';
    document.getElementById('checkout-total-price').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

/* ==========================================================================
   FINALIZAÇÃO E SUBMISSÃO DO PEDIDO
   ========================================================================== */

async function submitOrder() {
    if (!currentUser || !adminAccessToken || !currentAuthUser) {
        alert('Entre ou crie sua conta antes de finalizar. Assim o pedido ficará salvo e poderá ser acompanhado.');
        openAuthModal();
        return;
    }
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

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const total = subtotal + checkoutShippingCost - checkoutDiscount;
    const orderId = `#MN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
        id: orderId,
        accountEmail: normalizeEmail(currentUser.email),
        customer: {
            name, email, phone, cpf, cep, state: checkoutShippingState, city, street, number, neighborhood, complement
        },
        items: [...cart],
        subtotal,
        shippingCost: checkoutShippingCost,
        discount: checkoutDiscount,
        totalPrice: total,
        shippingMethod: checkoutShippingMethod,
        paymentMethod: 'pix',
        paymentStatus: 'pending',
        date: new Date().toISOString(),
        status: 'pending'
    };

    const submitButton = document.getElementById('submit-order-btn');
    const originalButtonText = submitButton.innerText;
    submitButton.disabled = true;
    submitButton.innerText = 'Criando pedido...';

    if (!pixConfig.key) {
        alert('A chave Pix da loja ainda não foi configurada. O administrador precisa preencher a meta pix-key no index.html.');
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;
        return;
    }

    try {
        const savedOrder = await createOrderOnServer(newOrder);
        orders = [savedOrder, ...orders.filter(order => order.id !== savedOrder.id)];
        saveOrdersToStorage();

        cart.forEach(item => {
            const key = `${item.productId}_${item.color}_${item.size}`;
            stock[key].qty -= item.qty;
        });
        saveStockToStorage();

        cart = [];
        saveCartToStorage();
        updateCartUI();
        showPixConfirmation(savedOrder);
    } catch (error) {
        alert(`Não foi possível salvar o pedido: ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;
    }
}

function showPixConfirmation(order) {
    document.getElementById('conf-order-id').innerText = order.id;
    document.getElementById('conf-payment-status').innerText = getPaymentStatusLabel(order.paymentStatus);
    document.getElementById('conf-customer-address').innerText = `${order.customer.street}, Nº ${order.customer.number} ${order.customer.complement ? '- ' + order.customer.complement : ''} | ${order.customer.neighborhood} - ${order.customer.city}, ${order.customer.state} - CEP ${order.customer.cep}`;
    document.getElementById('conf-pix-recipient').innerText = pixConfig.recipient;
    document.getElementById('conf-pix-key').value = pixConfig.key;
    document.getElementById('conf-pix-total').innerText = `R$ ${order.totalPrice.toFixed(2).replace('.', ',')}`;
    const myOrdersButton = document.getElementById('conf-my-orders-btn');
    myOrdersButton.hidden = !currentUser;
    myOrdersButton.textContent = currentUser?.role === 'admin' ? 'Ver Minhas Compras' : 'Ver Meus Pedidos';
    navigateTo('confirmation-view');
}

async function copyPixKey() {
    if (!pixConfig.key) return;
    try {
        await navigator.clipboard.writeText(pixConfig.key);
    } catch (error) {
        const input = document.getElementById('conf-pix-key');
        input.select();
        document.execCommand('copy');
    }
    const button = document.getElementById('copy-pix-key-btn');
    const originalText = button.innerText;
    button.innerText = 'Chave copiada!';
    setTimeout(() => { button.innerText = originalText; }, 1800);
}

function getPaymentStatusLabel(status) {
    switch (status) {
        case 'approved': return 'Pagamento aprovado';
        case 'rejected': return 'Pagamento recusado';
        case 'cancelled': return 'Pagamento cancelado';
        case 'refunded': return 'Pagamento devolvido';
        case 'in_process': return 'Pagamento em análise';
        case 'pending': return 'Aguardando pagamento';
        default: return 'Aguardando confirmação';
    }
}

function getPaymentStatusBadgeClass(status) {
    if (status === 'approved') return 'status-delivered';
    if (status === 'rejected' || status === 'cancelled' || status === 'refunded') return 'status-payment-failed';
    if (status === 'in_process') return 'status-shipped';
    return 'status-pending';
}

/* ==========================================================================
   FASE 2: AUTENTICAÇÃO DE USUÁRIOS
   ========================================================================== */

function openAuthModal() {
    setAuthStatus('');
    document.querySelector('#auth-modal .auth-modal-card')?.classList.remove('is-registering');
    document.getElementById('auth-modal').classList.add('active');
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('register-container').style.display = 'none';
}

function closeAuthModal() {
    setAuthStatus('');
    document.getElementById('auth-modal').classList.remove('active');
}

function setAuthStatus(message, type = 'error') {
    const status = document.getElementById('auth-status');
    if (!status) return;
    status.textContent = message || '';
    status.classList.toggle('is-error', type === 'error');
    status.hidden = !message;
}

function updateAuthUI() {
    const badge = document.getElementById('user-name-badge');
    const hasAdminAccess = adminSessionActive && currentUser?.role === 'admin';
    ['go-to-admin-btn', 'footer-admin-link', 'conf-admin-view-btn'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.hidden = !hasAdminAccess;
    });
    const isCustomer = Boolean(currentUser && currentUser.role !== 'admin');
    const myOrdersLink = document.getElementById('nav-my-orders-link');
    const mobileUserLabel = document.getElementById('mob-nav-user-label');
    if (myOrdersLink) {
        myOrdersLink.hidden = !currentUser;
        myOrdersLink.textContent = isCustomer ? 'Meus Pedidos' : 'Minhas Compras';
    }
    if (mobileUserLabel) mobileUserLabel.textContent = currentUser ? (isCustomer ? 'Pedidos' : 'Compras') : 'Perfil';

    if (currentUser) {
        const firstName = currentUser.name.split(' ')[0];
        badge.innerText = `Olá, ${firstName}`;
    } else {
        badge.innerText = 'Entrar';
    }

    // Exibe ou remove os controles rápidos da vitrine ao entrar/sair como ADM.
    if (products.length && document.getElementById('products-list-container')) {
        renderProductGrid();
    }
}

async function submitRegister() {
    const form = document.getElementById('register-form');
    if (!form.reportValidity()) return;

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const passwordConfirmation = document.getElementById('reg-password-confirm').value;
    const cpf = formatCpf(document.getElementById('reg-cpf').value);
    const phone = formatPhone(document.getElementById('reg-phone').value);
    const cep = formatCep(document.getElementById('reg-cep').value);
    const state = document.getElementById('reg-state').value.trim().toUpperCase();
    const street = document.getElementById('reg-street').value.trim();
    const number = document.getElementById('reg-number').value.trim();
    const neighborhood = document.getElementById('reg-neighborhood').value.trim();
    const city = document.getElementById('reg-city').value.trim();
    const complement = document.getElementById('reg-complement').value.trim();

    if (!name || !email || !password || !cpf || !phone || !cep || !state || !street || !number || !neighborhood || !city) {
        setAuthStatus('Por favor, preencha todos os campos do cadastro.');
        return;
    }
    if (name.split(/\s+/).length < 2) {
        setAuthStatus('Informe o nome completo de quem receberá o pedido.');
        return;
    }
    if (password.length < 8) {
        setAuthStatus('A senha precisa ter pelo menos 8 caracteres.');
        return;
    }
    if (password !== passwordConfirmation) {
        setAuthStatus('As duas senhas não são iguais.');
        return;
    }
    if (!isValidCpf(cpf)) {
        setAuthStatus('Informe um CPF válido.');
        return;
    }
    if (![10, 11].includes(onlyDigits(phone).length)) {
        setAuthStatus('Informe um celular ou telefone com DDD.');
        return;
    }
    if (onlyDigits(cep).length !== 8) {
        setAuthStatus('Informe um CEP válido com 8 números.');
        return;
    }
    if (!/^[A-Z]{2}$/.test(state)) {
        setAuthStatus('Informe a UF com duas letras, por exemplo DF.');
        return;
    }

    setAuthStatus('');

    const submitButton = document.getElementById('submit-register-btn');
    const originalText = submitButton.innerText;
    submitButton.disabled = true;
    submitButton.innerText = 'Criando conta...';
    try {
        const payload = await supabaseRequest('/auth/v1/signup', {
            body: {
                email: normalizeEmail(email),
                password,
                data: { name, cpf, phone, cep, state, street, number, neighborhood, city, complement }
            },
            retry: false
        });
        if (!payload?.access_token) {
            closeAuthModal();
            alert('Conta criada. Abra o e-mail de confirmação e depois faça login na loja.');
            return;
        }
        saveAdminSession(payload);
        currentAuthUser = payload.user;
        adminSessionActive = false;
        currentUser = buildCurrentUser(payload.user, false);
        updateAuthUI();
        closeAuthModal();
        await syncOrdersFromServer();
        subscribeToOrdersRealtime();
        alert('Cadastro realizado com sucesso!');
    } catch (error) {
        setAuthStatus(getFriendlyLoginError(error));
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = originalText;
    }
}

async function supabaseRequest(path, { method = 'POST', body = null, accessToken = '', retry = true, headers = {} } = {}) {
    const response = await fetch(`${supabaseConfig.url}${path}`, {
        method,
        headers: {
            apikey: supabaseConfig.publicKey,
            Authorization: `Bearer ${accessToken || supabaseConfig.publicKey}`,
            'Content-Type': 'application/json',
            ...headers
        },
        body: method === 'GET' || body === null ? null : JSON.stringify(body)
    });

    if (response.status === 401 && accessToken && retry && await refreshAdminSession()) {
        return supabaseRequest(path, { method, body, accessToken: adminAccessToken, retry: false, headers });
    }

    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
        const error = new Error(payload?.message || payload?.msg || payload?.details || payload?.hint || 'Não foi possível conectar ao sistema da loja.');
        error.status = response.status;
        throw error;
    }
    return payload;
}

async function sendPaymentConfirmationEmail(orderId) {
    const response = await fetch(`${supabaseConfig.url}/functions/v1/send-order-email`, {
        method: 'POST',
        headers: {
            apikey: supabaseConfig.publicKey,
            Authorization: `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId })
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error || 'O e-mail de confirmação não foi enviado.');
    return payload;
}

function saveAdminSession(payload) {
    adminAccessToken = payload.access_token || '';
    adminRefreshToken = payload.refresh_token || '';
    sessionStorage.setItem('mn_auth_access_token', adminAccessToken);
    sessionStorage.setItem('mn_auth_refresh_token', adminRefreshToken);
    sessionStorage.removeItem('mn_admin_access_token');
    sessionStorage.removeItem('mn_admin_refresh_token');
    if (supabaseClient && adminAccessToken) supabaseClient.realtime.setAuth(adminAccessToken);
}

function clearAdminSession() {
    adminAccessToken = '';
    adminRefreshToken = '';
    adminSessionActive = false;
    sessionStorage.removeItem('mn_admin_access_token');
    sessionStorage.removeItem('mn_admin_refresh_token');
    sessionStorage.removeItem('mn_auth_access_token');
    sessionStorage.removeItem('mn_auth_refresh_token');
    currentAuthUser = null;
    if (supabaseClient && ordersRealtimeChannel) {
        supabaseClient.removeChannel(ordersRealtimeChannel);
        ordersRealtimeChannel = null;
    }
}

async function refreshAdminSession() {
    if (!adminRefreshToken) return false;
    try {
        const payload = await supabaseRequest('/auth/v1/token?grant_type=refresh_token', {
            body: { refresh_token: adminRefreshToken },
            retry: false
        });
        saveAdminSession(payload);
        return true;
    } catch (error) {
        clearAdminSession();
        return false;
    }
}

async function authenticateAccount(email, password) {
    const payload = await supabaseRequest('/auth/v1/token?grant_type=password', {
        body: { email, password },
        retry: false
    });
    saveAdminSession(payload);
    return payload;
}

async function isCurrentUserAdmin(userId) {
    const rows = await supabaseRequest(`/rest/v1/admin_users?user_id=eq.${encodeURIComponent(userId)}&active=eq.true&select=user_id`, {
        method: 'GET', accessToken: adminAccessToken
    });
    return Array.isArray(rows) && rows.length === 1;
}

function getFriendlyLoginError(error) {
    const message = String(error?.message || 'Não foi possível entrar na conta.');
    if (message === 'Invalid login credentials') return 'E-mail ou senha incorretos.';
    if (message.includes('schema cache') || message.includes('public.admin_users') || message.includes('public.orders')) {
        return 'A loja está concluindo uma atualização. Tente novamente em alguns instantes.';
    }
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) return 'Não foi possível conectar agora. Confira sua internet e tente novamente.';
    return message;
}

function buildCurrentUser(authUser, isAdmin) {
    const metadata = authUser?.user_metadata || {};
    return {
        id: authUser.id,
        name: metadata.name || authUser.email?.split('@')[0] || 'Cliente',
        email: authUser.email,
        role: isAdmin ? 'admin' : 'customer',
        phone: metadata.phone || '', cpf: metadata.cpf || '', cep: metadata.cep || '',
        state: metadata.state || '', city: metadata.city || '', street: metadata.street || '',
        number: metadata.number || '', neighborhood: metadata.neighborhood || '', complement: metadata.complement || ''
    };
}

async function restoreAdminSession() {
    if (!adminAccessToken) return;
    try {
        const user = await supabaseRequest('/auth/v1/user', {
            method: 'GET',
            accessToken: adminAccessToken
        });
        currentAuthUser = user;
        adminSessionActive = await isCurrentUserAdmin(user.id);
        currentUser = buildCurrentUser(user, adminSessionActive);
        updateAuthUI();
        await syncOrdersFromServer();
        subscribeToOrdersRealtime();
    } catch (error) {
        clearAdminSession();
    }
}

async function submitLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        setAuthStatus('Por favor, insira e-mail e senha.');
        return;
    }

    setAuthStatus('');

    const normalizedEmail = normalizeEmail(email);
    const submitButton = document.getElementById('submit-login-btn');
    const originalText = submitButton.innerText;
    submitButton.disabled = true;
    submitButton.innerText = 'Conectando...';
    try {
        const payload = await authenticateAccount(normalizedEmail, password);
        currentAuthUser = payload.user;
        adminSessionActive = await isCurrentUserAdmin(payload.user.id);
        currentUser = buildCurrentUser(payload.user, adminSessionActive);
        updateAuthUI();
        closeAuthModal();
        await syncOrdersFromServer();
        subscribeToOrdersRealtime();
        if (adminSessionActive) enterAdminPanel();
    } catch (error) {
        clearAdminSession();
        setAuthStatus(getFriendlyLoginError(error));
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = originalText;
    }
}

function logoutUser() {
    clearAdminSession();
    currentUser = null;
    localStorage.removeItem('mn_current_user');
    orders = [];
    saveOrdersToStorage();

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

async function saveUserProfile() {
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

    try {
        await supabaseRequest('/auth/v1/user', {
            method: 'PUT', accessToken: adminAccessToken,
            body: { data: {
                name: currentUser.name, phone: currentUser.phone, cpf: currentUser.cpf,
                cep: currentUser.cep, street: currentUser.street, number: currentUser.number,
                neighborhood: currentUser.neighborhood, city: currentUser.city,
                complement: currentUser.complement, state: currentUser.state
            } }
        });
        updateAuthUI();
        alert('Dados de perfil atualizados com sucesso!');
    } catch (error) {
        alert(error.message);
    }
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getCancellationStatusLabel(status) {
    const labels = {
        requested: 'Solicitação recebida',
        awaiting_return: 'Aguardando devolução',
        returned: 'Produto devolvido',
        refund_pending: 'Reembolso pendente',
        refunded: 'Reembolsado',
        rejected: 'Solicitação analisada',
        cancelled: 'Cancelado sem cobrança'
    };
    return labels[status] || 'Em análise';
}

function getReturnStatusLabel(status) {
    return {
        not_required: 'Não necessária',
        awaiting_return: 'Aguardando envio/recebimento',
        returned: 'Produto recebido pela loja'
    }[status] || 'Em análise';
}

function getRefundStatusLabel(status) {
    return {
        not_required: 'Não necessário',
        pending: 'Pendente',
        refunded: 'Realizado'
    }[status] || 'Em análise';
}

function isCancellationWindowOpen(order) {
    if (order.cancellationStatus || order.status === 'cancelled' || order.paymentStatus === 'refunded') return false;
    if (order.status !== 'delivered' || !order.deliveredAt) return true;
    const deliveredAt = new Date(order.deliveredAt).getTime();
    return Number.isNaN(deliveredAt) || Date.now() <= deliveredAt + (7 * 24 * 60 * 60 * 1000);
}

function openCancellationModal(orderId) {
    const order = orders.find(item => item.id === orderId);
    if (!order || !isCancellationWindowOpen(order)) return;
    cancellationOrderId = orderId;
    document.getElementById('cancellation-order-id').textContent = orderId;
    document.getElementById('cancellation-reason').value = '';
    document.getElementById('cancellation-modal').classList.add('active');
}

function closeCancellationModal() {
    cancellationOrderId = '';
    document.getElementById('cancellation-modal').classList.remove('active');
}

async function submitCancellationRequest() {
    const order = orders.find(item => item.id === cancellationOrderId);
    if (!order) return;
    const button = document.getElementById('confirm-cancellation-request-btn');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Enviando...';
    try {
        const rows = await supabaseRequest('/rest/v1/rpc/request_order_cancellation', {
            method: 'POST', accessToken: adminAccessToken,
            body: {
                target_order_id: order.id,
                reason: document.getElementById('cancellation-reason').value.trim() || null
            }
        });
        if (!Array.isArray(rows) || !rows[0]) throw new Error('A solicitação não pôde ser registrada.');
        const updatedOrder = mapOrderRow(rows[0]);
        orders = orders.map(item => item.id === updatedOrder.id ? updatedOrder : item);
        saveOrdersToStorage();
        closeCancellationModal();
        renderCustomerOrdersHistory();
        alert(updatedOrder.cancellationStatus === 'cancelled'
            ? 'Pedido cancelado. Nenhum pagamento foi cobrado.'
            : 'Solicitação recebida. Acompanhe o andamento por este pedido.');
    } catch (error) {
        alert(getFriendlyLoginError(error));
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

function renderCustomerOrdersHistory() {
    const container = document.getElementById('customer-orders-container');
    const overview = document.getElementById('customer-orders-overview');
    if (!container || !overview || !currentUser) return;

    // O vínculo principal é a conta autenticada; pedidos antigos continuam
    // compatíveis pelo e-mail salvo nos dados do cliente.
    const currentEmail = normalizeEmail(currentUser.email);
    const myOrders = orders
        .filter(order => getOrderOwnerEmail(order) === currentEmail)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const activeCount = myOrders.filter(order => ['pending', 'preparing', 'shipped'].includes(order.status)).length;
    const deliveredCount = myOrders.filter(order => order.status === 'delivered').length;
    overview.innerHTML = `
        <div class="customer-order-metric"><strong>${myOrders.length}</strong><span>Total</span></div>
        <div class="customer-order-metric"><strong>${activeCount}</strong><span>Em andamento</span></div>
        <div class="customer-order-metric"><strong>${deliveredCount}</strong><span>Entregues</span></div>
    `;

    if (myOrders.length === 0) {
        container.innerHTML = `<div class="customer-orders-empty"><strong>Nenhum pedido por aqui ainda.</strong><span>Quando você finalizar uma compra com esta conta, ela aparecerá aqui com o status atualizado.</span></div>`;
        return;
    }

    container.innerHTML = '';
    myOrders.forEach(o => {
        const dateObj = new Date(o.date);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        const cancellationWindowOpen = isCancellationWindowOpen(o);
        const cancellationWindowExpired = o.status === 'delivered' && !o.cancellationStatus && !cancellationWindowOpen;
        
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
                <div class="customer-order-statuses">
                    ${o.paymentStatus ? `
                        <div class="customer-order-status">
                            <small>Pagamento</small>
                            <span class="status-badge ${getPaymentStatusBadgeClass(o.paymentStatus)}">${getPaymentStatusLabel(o.paymentStatus)}</span>
                        </div>
                    ` : ''}
                    <div class="customer-order-status">
                        <small>Pedido</small>
                        <span class="status-badge ${getStatusBadgeClass(o.status)}">${getStatusLabel(o.status)}</span>
                    </div>
                </div>
            </div>
            ${o.cancellationStatus ? `
                <div class="customer-cancellation-state">
                    <strong>${getCancellationStatusLabel(o.cancellationStatus)}</strong>
                    <span>Solicitação registrada em ${o.cancellationRequestedAt ? new Date(o.cancellationRequestedAt).toLocaleString('pt-BR') : 'processamento'}.</span>
                    <span>Devolução: ${getReturnStatusLabel(o.returnStatus)} · Reembolso: ${getRefundStatusLabel(o.refundStatus)}.</span>
                    ${o.refundedAt ? `<span>Reembolso registrado em ${new Date(o.refundedAt).toLocaleString('pt-BR')}.</span>` : ''}
                </div>
            ` : cancellationWindowOpen ? `
                <button class="customer-cancel-order-btn" type="button" onclick="openCancellationModal('${o.id}')">Solicitar cancelamento ou devolução</button>
            ` : cancellationWindowExpired ? `
                <div class="customer-cancellation-support">O prazo de arrependimento terminou. Para defeito ou outro problema, <a href="https://wa.me/5561992863496" target="_blank" rel="noopener">fale com a loja</a>.</div>
            ` : ''}
        `;
        container.appendChild(card);
    });
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
            <td><strong>${p.sku}</strong></td>
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
        sku: formatProductSku(products.length),
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
    normalizeProductSkus();
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
        normalizeProductSkus();

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

async function renderAdminUsers() {
    const container = document.getElementById('admin-users-list');
    if (!container || !adminSessionActive) return;
    try {
        const admins = await supabaseRequest('/rest/v1/admin_users?active=eq.true&select=user_id,email,name&order=created_at.asc', {
            method: 'GET', accessToken: adminAccessToken
        });
        container.innerHTML = '';
        admins.forEach(admin => {
            const row = document.createElement('div');
            row.className = 'admin-user-row';
            const copy = document.createElement('div');
            const name = document.createElement('strong');
            const email = document.createElement('span');
            name.innerText = admin.name;
            email.innerText = admin.email;
            copy.append(name, email);
            row.appendChild(copy);
            if (admin.user_id !== currentAuthUser?.id) {
                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.className = 'btn btn-secondary btn-small';
                removeButton.innerText = 'Remover acesso';
                removeButton.addEventListener('click', () => removeAdminFromPanel(admin.email));
                row.appendChild(removeButton);
            } else {
                const currentBadge = document.createElement('span');
                currentBadge.className = 'status-badge status-delivered';
                currentBadge.innerText = 'Você';
                row.appendChild(currentBadge);
            }
            container.appendChild(row);
        });
    } catch (error) {
        container.innerHTML = `<p class="placeholder-text">${error.message}</p>`;
    }
}

async function addAdminFromPanel() {
    const nameInput = document.getElementById('new-admin-name');
    const emailInput = document.getElementById('new-admin-email');
    const name = nameInput.value.trim();
    const email = normalizeEmail(emailInput.value);
    if (!name || !email) {
        alert('Informe o nome e o e-mail da conta que será administradora.');
        return;
    }
    try {
        await supabaseRequest('/rest/v1/rpc/set_admin_by_email', {
            method: 'POST', accessToken: adminAccessToken,
            body: { target_email: email, target_name: name, enabled: true }
        });
        nameInput.value = '';
        emailInput.value = '';
        await renderAdminUsers();
        alert('Acesso administrativo liberado. A pessoa pode entrar com a própria senha.');
    } catch (error) {
        alert(error.message);
    }
}

async function removeAdminFromPanel(email) {
    if (!confirm(`Remover o acesso administrativo de ${email}?`)) return;
    try {
        await supabaseRequest('/rest/v1/rpc/set_admin_by_email', {
            method: 'POST', accessToken: adminAccessToken,
            body: { target_email: email, target_name: 'Administrador', enabled: false }
        });
        await renderAdminUsers();
    } catch (error) {
        alert(error.message);
    }
}

function enterAdminPanel() {
    if (!adminSessionActive || currentUser?.role !== 'admin') {
        alert('Faça login com a conta administrativa para acessar o painel.');
        openAuthModal();
        return;
    }
    navigateTo('admin-view');
    const dashboardTab = document.querySelector('[data-tab="admin-dashboard"]');
    if (dashboardTab) dashboardTab.click();
    renderAdminUsers();
    syncOrdersFromServer();
}

async function refreshAdminOrders() {
    if (!adminSessionActive) return;
    const button = document.getElementById('refresh-orders-btn');
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Atualizando...';
    const refreshed = await syncOrdersFromServer();
    button.disabled = false;
    button.textContent = refreshed ? 'Pedidos atualizados' : 'Tentar novamente';
    setTimeout(() => { button.textContent = originalText; }, 1800);
    if (!refreshed) alert('Não foi possível atualizar os pedidos agora. Confira a internet e tente novamente.');
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
        case 'cancelled': return 'status-cancellation';
        default: return 'status-pending';
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'pending': return 'Pendente';
        case 'preparing': return 'Preparando';
        case 'shipped': return 'Enviado';
        case 'delivered': return 'Entregue';
        case 'cancelled': return 'Cancelado';
        default: return 'Pendente';
    }
}

function escapeCsvCell(value) {
    let text = value === null || value === undefined ? '' : String(value);
    if (/^[=+\-@]/.test(text.trimStart())) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
}

function downloadOrdersCsv() {
    if (!adminSessionActive || currentUser?.role !== 'admin') {
        openAuthModal();
        setAuthStatus('Entre com uma conta administrativa para exportar os pedidos.');
        return;
    }

    const filterStatus = document.getElementById('filter-order-status')?.value || 'all';
    const selectedOrders = orders.filter(order => {
        const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
        const isReadyForProduction = order.paymentStatus === 'approved'
            && !order.cancellationStatus
            && !['shipped', 'delivered', 'cancelled'].includes(order.status);
        return matchesFilter && isReadyForProduction;
    });
    if (selectedOrders.length === 0) {
        alert('Não há pedidos com Pix confirmado e aguardando produção neste filtro.');
        return;
    }

    const headers = [
        'Pedido', 'Data', 'Pagamento', 'Status do pedido',
        'Produto', 'SKU', 'Cor', 'Tamanho', 'Quantidade'
    ];

    const rows = selectedOrders.flatMap(order => {
        const formattedDate = Number.isNaN(new Date(order.date).getTime())
            ? order.date || ''
            : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(order.date));

        return (Array.isArray(order.items) ? order.items : []).map(item => {
            const quantity = Number(item.qty) || 0;
            const productSku = item.sku || products.find(product => product.id === item.productId)?.sku || '';
            return [
                order.id, formattedDate, getPaymentStatusLabel(order.paymentStatus), getStatusLabel(order.status),
                item.name, productSku, item.color, item.size, quantity
            ];
        });
    });

    if (rows.length === 0) {
        alert('Os pedidos selecionados não possuem peças para exportar.');
        return;
    }

    const csv = [headers, ...rows]
        .map(row => row.map(escapeCsvCell).join(';'))
        .join('\r\n');
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedidos-producao-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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

function renderAdminCancellations() {
    const container = document.getElementById('admin-cancellations-list');
    const count = document.getElementById('cancellation-pending-count');
    if (!container || !count) return;

    const pendingOrders = orders
        .filter(order => order.cancellationStatus
            && (order.refundStatus === 'pending' || order.returnStatus === 'awaiting_return'))
        .sort((a, b) => new Date(a.cancellationRequestedAt || a.date) - new Date(b.cancellationRequestedAt || b.date));

    count.textContent = `${pendingOrders.length} ${pendingOrders.length === 1 ? 'pendente' : 'pendentes'}`;
    if (pendingOrders.length === 0) {
        container.innerHTML = '<div class="admin-cancellations-empty">Nenhuma solicitação aguardando ação.</div>';
        return;
    }

    container.innerHTML = pendingOrders.map(order => {
        return `
            <div class="admin-cancellation-item">
                <div class="admin-cancellation-main">
                    <div class="admin-cancellation-title">
                        <span class="order-id-label">${escapeHtml(order.id)}</span>
                        <strong>${escapeHtml(order.customer?.name || order.accountEmail)}</strong>
                        <span class="status-badge status-cancellation">${getCancellationStatusLabel(order.cancellationStatus)}</span>
                    </div>
                    <span>Pix: ${getPaymentStatusLabel(order.paymentStatus)} · Pedido: ${getStatusLabel(order.status)} · Total: R$ ${Number(order.totalPrice || 0).toFixed(2).replace('.', ',')}</span>
                    <span>Devolução: ${getReturnStatusLabel(order.returnStatus)} · Reembolso: ${getRefundStatusLabel(order.refundStatus)}</span>
                    ${order.cancellationReason ? `<p><strong>Mensagem do cliente:</strong> ${escapeHtml(order.cancellationReason)}</p>` : '<p>Cliente não informou motivo.</p>'}
                </div>
                <div class="admin-cancellation-actions">
                    ${order.returnStatus === 'awaiting_return' ? `<button class="btn btn-secondary btn-small" type="button" onclick="markCancellationReturnReceived('${order.id}')">Marcar produto devolvido</button>` : ''}
                    ${order.refundStatus === 'pending' ? `<button class="btn btn-primary btn-small" type="button" onclick="recordCancellationRefundById('${order.id}')">Registrar reembolso realizado</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

async function patchCancellationOrder(order, updates) {
    await supabaseRequest(`/rest/v1/orders?id=eq.${encodeURIComponent(order.id)}`, {
        method: 'PATCH', accessToken: adminAccessToken, body: updates
    });
    Object.entries(updates).forEach(([key, value]) => {
        const propertyMap = {
            cancellation_status: 'cancellationStatus', payment_status: 'paymentStatus',
            return_status: 'returnStatus', refund_status: 'refundStatus',
            refund_amount: 'refundAmount', refund_reference: 'refundReference',
            refunded_at: 'refundedAt', delivered_at: 'deliveredAt'
        };
        order[propertyMap[key] || key] = value;
    });
    saveOrdersToStorage();
    renderAdminOrders();
    renderAdminDashboard();
}

async function markCancellationReturnReceived(orderId) {
    const order = orders.find(item => item.id === orderId);
    if (!order) return;
    if (!confirm('Confirma que o produto devolvido foi recebido pela loja?')) return;
    try {
        const updates = { return_status: 'returned' };
        if (order.refundStatus !== 'pending') {
            updates.status = 'cancelled';
            updates.cancellation_status = order.refundStatus === 'refunded' ? 'refunded' : 'cancelled';
        }
        await patchCancellationOrder(order, updates);
    } catch (error) {
        alert(getFriendlyLoginError(error));
    }
}

async function recordCancellationRefundById(orderId) {
    const order = orders.find(item => item.id === orderId);
    if (!order) return;
    try {
        await recordCancellationRefund(order);
    } catch (error) {
        alert(getFriendlyLoginError(error));
    }
}

async function recordCancellationRefund(order) {
    const reference = prompt('Depois de devolver o valor ao cliente, informe o identificador do Pix de reembolso ou referência do comprovante:');
    if (!reference?.trim()) {
        alert('O reembolso não foi registrado. Informe a referência do comprovante para manter o histórico.');
        return;
    }
    if (!confirm(`Confirma que R$ ${Number(order.totalPrice || 0).toFixed(2).replace('.', ',')} já foi devolvido ao cliente?`)) return;
    const refundedAt = new Date().toISOString();
    await patchCancellationOrder(order, {
        cancellation_status: 'refunded',
        refund_status: 'refunded',
        payment_status: 'refunded',
        status: 'cancelled',
        refund_amount: Number(order.totalPrice || 0),
        refund_reference: reference.trim(),
        refunded_at: refundedAt
    });
}

function closeAdminOrderEditor() {
    adminEditingOrderId = '';
    document.getElementById('admin-order-edit-modal').classList.remove('active');
}

function getAdminEditItemPrice(productId, color, size, fallbackPrice) {
    const variation = stock[`${productId}_${color}_${size}`];
    return Number(variation?.price ?? fallbackPrice ?? 0);
}

function renderAdminEditItems(order) {
    const container = document.getElementById('admin-edit-order-items');
    container.innerHTML = order.items.map((item, index) => {
        const product = products.find(entry => entry.id === item.productId);
        const colors = product?.colors?.length ? product.colors : [item.color];
        const sizes = product?.sizes?.length ? product.sizes : [item.size];
        const price = getAdminEditItemPrice(item.productId, item.color, item.size, item.price);
        return `
            <div class="admin-edit-item-row" data-index="${index}" data-product-id="${escapeHtml(item.productId)}" data-price="${price}">
                <div class="admin-edit-item-name">
                    <strong>${escapeHtml(item.name)}</strong>
                    <span>${escapeHtml(product?.sku || item.sku || '')}</span>
                </div>
                <label>Cor
                    <select data-field="color">
                        ${colors.map(color => `<option value="${escapeHtml(color)}" ${color === item.color ? 'selected' : ''}>${escapeHtml(color)}</option>`).join('')}
                    </select>
                </label>
                <label>Tamanho
                    <select data-field="size">
                        ${sizes.map(size => `<option value="${escapeHtml(size)}" ${size === item.size ? 'selected' : ''}>${escapeHtml(size)}</option>`).join('')}
                    </select>
                </label>
                <label>Quantidade
                    <input data-field="qty" type="number" min="1" max="99" value="${Math.max(1, Number(item.qty) || 1)}">
                </label>
                <span class="admin-edit-item-price" data-role="price">R$ ${price.toFixed(2).replace('.', ',')}</span>
            </div>`;
    }).join('');

    container.querySelectorAll('select, input').forEach(control => {
        control.addEventListener('change', event => {
            const row = event.target.closest('.admin-edit-item-row');
            const original = order.items[Number(row.dataset.index)];
            const color = row.querySelector('[data-field="color"]').value;
            const size = row.querySelector('[data-field="size"]').value;
            const price = getAdminEditItemPrice(row.dataset.productId, color, size, original.price);
            row.dataset.price = String(price);
            row.querySelector('[data-role="price"]').textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
            updateAdminEditTotal();
        });
        control.addEventListener('input', updateAdminEditTotal);
    });
}

function updateAdminEditTotal() {
    const order = orders.find(item => item.id === adminEditingOrderId);
    if (!order) return;
    const subtotal = [...document.querySelectorAll('#admin-edit-order-items .admin-edit-item-row')]
        .reduce((sum, row) => sum + (Number(row.dataset.price) * Math.max(1, Number(row.querySelector('[data-field="qty"]').value) || 1)), 0);
    const shippingCost = Math.max(0, Number(document.getElementById('admin-edit-shipping-cost').value) || 0);
    const total = subtotal + shippingCost - (Number(order.discount) || 0);
    document.getElementById('admin-edit-order-total').textContent = `R$ ${Math.max(0, total).toFixed(2).replace('.', ',')}`;
}

function openAdminOrderEditor(orderId) {
    const order = orders.find(item => item.id === orderId);
    if (!order || order.status === 'cancelled' || order.cancellationStatus) return;
    adminEditingOrderId = orderId;
    document.getElementById('admin-edit-order-id').textContent = order.id;
    document.getElementById('admin-edit-name').value = order.customer?.name || '';
    document.getElementById('admin-edit-phone').value = order.customer?.phone || '';
    document.getElementById('admin-edit-email').value = order.accountEmail || order.customer?.email || '';
    document.getElementById('admin-edit-cep').value = order.customer?.cep || '';
    document.getElementById('admin-edit-street').value = order.customer?.street || '';
    document.getElementById('admin-edit-number').value = order.customer?.number || '';
    document.getElementById('admin-edit-neighborhood').value = order.customer?.neighborhood || '';
    document.getElementById('admin-edit-city').value = order.customer?.city || '';
    document.getElementById('admin-edit-state').value = order.customer?.state || '';
    document.getElementById('admin-edit-complement').value = order.customer?.complement || '';
    document.getElementById('admin-edit-shipping-method').value = order.shippingMethod || 'PAC';
    document.getElementById('admin-edit-shipping-cost').value = Number(order.shippingCost || 0).toFixed(2);
    document.getElementById('admin-edit-note').value = order.adminNote || '';
    renderAdminEditItems(order);
    updateAdminEditTotal();
    document.getElementById('admin-order-edit-modal').classList.add('active');
}

async function saveAdminOrderEdit() {
    const order = orders.find(item => item.id === adminEditingOrderId);
    const form = document.getElementById('admin-order-edit-form');
    if (!order || !form.reportValidity()) return;

    const rows = [...document.querySelectorAll('#admin-edit-order-items .admin-edit-item-row')];
    const editedItems = rows.map(row => {
        const original = order.items[Number(row.dataset.index)];
        return {
            ...original,
            color: row.querySelector('[data-field="color"]').value,
            size: row.querySelector('[data-field="size"]').value,
            qty: Math.max(1, Number(row.querySelector('[data-field="qty"]').value) || 1),
            price: Number(row.dataset.price) || Number(original.price) || 0
        };
    });
    if (!editedItems.length) return alert('O pedido precisa ter pelo menos uma peça.');

    const customer = {
        ...order.customer,
        name: document.getElementById('admin-edit-name').value.trim(),
        phone: document.getElementById('admin-edit-phone').value.trim(),
        email: document.getElementById('admin-edit-email').value.trim(),
        cep: formatCep(document.getElementById('admin-edit-cep').value),
        street: document.getElementById('admin-edit-street').value.trim(),
        number: document.getElementById('admin-edit-number').value.trim(),
        neighborhood: document.getElementById('admin-edit-neighborhood').value.trim(),
        city: document.getElementById('admin-edit-city').value.trim(),
        state: document.getElementById('admin-edit-state').value.trim().toUpperCase(),
        complement: document.getElementById('admin-edit-complement').value.trim()
    };
    if (onlyDigits(customer.cep).length !== 8 || !/^[A-Z]{2}$/.test(customer.state)) {
        alert('Revise o CEP e a UF antes de salvar.');
        return;
    }

    const subtotal = editedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shippingCost = Math.max(0, Number(document.getElementById('admin-edit-shipping-cost').value) || 0);
    const discount = Number(order.discount) || 0;
    const updatedOrder = {
        ...order,
        customer,
        items: editedItems,
        subtotal,
        shippingCost,
        totalPrice: Math.max(0, subtotal + shippingCost - discount),
        shippingMethod: document.getElementById('admin-edit-shipping-method').value,
        adminNote: document.getElementById('admin-edit-note').value.trim(),
        lastEditedAt: new Date().toISOString(),
        lastEditedBy: currentAuthUser?.email || currentUser?.email || 'admin'
    };

    const button = document.getElementById('save-admin-order-edit-btn');
    button.disabled = true;
    button.textContent = 'Salvando...';
    try {
        await supabaseRequest(`/rest/v1/orders?id=eq.${encodeURIComponent(order.id)}`, {
            method: 'PATCH', accessToken: adminAccessToken,
            body: { order_data: updatedOrder }
        });
        orders = orders.map(item => item.id === order.id ? updatedOrder : item);
        saveOrdersToStorage();
        closeAdminOrderEditor();
        renderAdminOrders();
        renderAdminDashboard();
        alert('Pedido atualizado. O cliente já pode ver as novas informações.');
    } catch (error) {
        alert(getFriendlyLoginError(error));
    } finally {
        button.disabled = false;
        button.textContent = 'Salvar alterações';
    }
}

async function adminCancelOrder(orderId) {
    const order = orders.find(item => item.id === orderId);
    if (!order || order.status === 'cancelled') return;
    const reason = prompt('Motivo ou observação do cancelamento (opcional):');
    if (reason === null) return;
    const paid = order.paymentStatus === 'approved';
    const warning = paid
        ? 'Este pedido tem Pix confirmado. Ele será cancelado, mas o reembolso ainda deverá ser realizado e registrado. Continuar?'
        : 'Cancelar este pedido agora? Ele continuará preservado no histórico.';
    if (!confirm(warning)) return;

    const paymentStatus = paid ? 'approved' : 'cancelled';
    const cancelledAt = new Date().toISOString();
    const updatedOrder = {
        ...order,
        status: 'cancelled',
        paymentStatus,
        adminCancellation: { reason: reason.trim(), cancelledAt, cancelledBy: currentAuthUser?.email || currentUser?.email || 'admin' }
    };
    try {
        await supabaseRequest(`/rest/v1/orders?id=eq.${encodeURIComponent(order.id)}`, {
            method: 'PATCH', accessToken: adminAccessToken,
            body: { status: 'cancelled', payment_status: paymentStatus, order_data: updatedOrder }
        });
        orders = orders.map(item => item.id === order.id ? updatedOrder : item);
        saveOrdersToStorage();
        renderAdminOrders();
        renderAdminDashboard();
        alert(paid ? 'Pedido cancelado. O reembolso do Pix continua pendente.' : 'Pedido cancelado com sucesso.');
    } catch (error) {
        alert(getFriendlyLoginError(error));
    }
}

async function adminMarkOrderRefunded(orderId) {
    const order = orders.find(item => item.id === orderId);
    if (!order || order.status !== 'cancelled' || order.paymentStatus !== 'approved') return;
    const reference = prompt('Informe o identificador ou referência do comprovante do Pix devolvido:');
    if (!reference?.trim()) return;
    if (!confirm(`Confirma o reembolso de R$ ${Number(order.totalPrice || 0).toFixed(2).replace('.', ',')}?`)) return;
    const updatedOrder = {
        ...order,
        paymentStatus: 'refunded',
        adminRefund: { reference: reference.trim(), refundedAt: new Date().toISOString(), refundedBy: currentAuthUser?.email || currentUser?.email || 'admin' }
    };
    try {
        await supabaseRequest(`/rest/v1/orders?id=eq.${encodeURIComponent(order.id)}`, {
            method: 'PATCH', accessToken: adminAccessToken,
            body: { payment_status: 'refunded', order_data: updatedOrder }
        });
        orders = orders.map(item => item.id === order.id ? updatedOrder : item);
        saveOrdersToStorage();
        renderAdminOrders();
        renderAdminDashboard();
        alert('Reembolso registrado no pedido.');
    } catch (error) {
        alert(getFriendlyLoginError(error));
    }
}

function renderAdminOrders() {
    const tbody = document.getElementById('admin-orders-tbody');
    const filterStatus = document.getElementById('filter-order-status').value;
    const pendingBadge = document.getElementById('admin-pending-badge');
    
    if (!tbody) return;

    renderAdminCancellations();

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    pendingBadge.innerText = pendingCount;
    pendingBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';

    tbody.innerHTML = '';

    const filtered = orders.filter(o => filterStatus === 'all' || o.status === filterStatus);

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="placeholder-text" style="text-align:center; padding: 40px;">Nenhum pedido encontrado.</td></tr>`;
        return;
    }

    filtered.forEach(o => {
        const dateObj = new Date(o.date);
        const dateStr = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

        const isLocked = Boolean(o.cancellationStatus || o.status === 'cancelled');
        const actionButtons = o.status === 'cancelled'
            ? (o.paymentStatus === 'approved'
                ? `<button class="admin-order-action admin-order-refund" type="button" onclick="adminMarkOrderRefunded('${o.id}')">Registrar reembolso</button>`
                : '<span class="status-badge status-cancellation">Cancelado</span>')
            : o.cancellationStatus
                ? `<span class="status-badge status-cancellation">${getCancellationStatusLabel(o.cancellationStatus)}</span>`
                : `<button class="admin-order-action" type="button" onclick="openAdminOrderEditor('${o.id}')">Editar</button>
                   <button class="admin-order-action admin-order-cancel" type="button" onclick="adminCancelOrder('${o.id}')">Cancelar</button>`;

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
            <td><strong>R$ ${Number(o.totalPrice || 0).toFixed(2).replace('.', ',')}</strong></td>
            <td>${o.shippingMethod} - ${o.customer.city}/${o.customer.state}</td>
            <td>${dateStr}</td>
            <td>
                <select class="admin-select" onchange="updateOrderPaymentStatus('${o.id}', this.value)" ${isLocked ? 'disabled' : ''}>
                    <option value="pending" ${o.paymentStatus === 'pending' ? 'selected' : ''}>Aguardando Pix</option>
                    <option value="approved" ${o.paymentStatus === 'approved' ? 'selected' : ''}>Pix confirmado</option>
                    <option value="refunded" ${o.paymentStatus === 'refunded' ? 'selected' : ''}>Reembolsado</option>
                </select>
            </td>
            <td>
                <select class="admin-select" onchange="updateOrderStatus('${o.id}', this.value)" ${isLocked ? 'disabled' : ''}>
                    <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pendente</option>
                    <option value="preparing" ${o.status === 'preparing' ? 'selected' : ''}>Preparando</option>
                    <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                    <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Entregue</option>
                    <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
            <td>
                <div class="actions-cell">
                    ${actionButtons}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateOrderPaymentStatus(orderId, newStatus) {
    const order = orders.find(item => item.id === orderId);
    if (!order || order.cancellationStatus) return;
    try {
        await supabaseRequest(`/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
            method: 'PATCH', accessToken: adminAccessToken,
            body: { payment_status: newStatus }
        });
        order.paymentMethod = 'pix';
        order.paymentStatus = newStatus;
        order.paymentConfirmedAt = newStatus === 'approved' ? new Date().toISOString() : null;
        saveOrdersToStorage();
        renderAdminOrders();
        if (document.getElementById('admin-dashboard').classList.contains('active')) renderAdminDashboard();
        if (newStatus === 'approved') {
            try {
                const emailResult = await sendPaymentConfirmationEmail(order.id);
                const emailMessage = emailResult?.alreadySent
                    ? 'Pix confirmado. O e-mail deste pagamento já havia sido enviado ao cliente.'
                    : emailResult?.processing
                        ? 'Pix confirmado. O e-mail ao cliente já está sendo processado.'
                        : 'Pix confirmado e e-mail enviado ao cliente.';
                alert(emailMessage);
            } catch (emailError) {
                alert(`Pix confirmado, mas o e-mail ficou pendente: ${emailError.message}`);
            }
        }
    } catch (error) {
        alert(error.message);
        renderAdminOrders();
    }
}

async function updateOrderStatus(orderId, newStatus) {
    const o = orders.find(ord => ord.id === orderId);
    if (o && !o.cancellationStatus) {
        try {
            const deliveredAt = newStatus === 'delivered' ? (o.deliveredAt || new Date().toISOString()) : null;
            await supabaseRequest(`/rest/v1/orders?id=eq.${encodeURIComponent(orderId)}`, {
                method: 'PATCH', accessToken: adminAccessToken, body: { status: newStatus, delivered_at: deliveredAt }
            });
            o.status = newStatus;
            o.deliveredAt = deliveredAt;
            saveOrdersToStorage();
            renderAdminOrders();
            if (document.getElementById('admin-dashboard').classList.contains('active')) renderAdminDashboard();
        } catch (error) {
            alert(error.message);
            renderAdminOrders();
        }
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
