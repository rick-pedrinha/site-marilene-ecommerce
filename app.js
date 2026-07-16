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

// Estado global da aplicação
let products = [];
let stock = {};
let cart = [];
let orders = [];

// Estado da compra atual (Checkout)
let checkoutShippingState = null; // DF, SP, etc.
let checkoutShippingCost = 0;
let checkoutShippingMethod = '';
let checkoutDiscount = 0;

/* ==========================================================================
   FUNÇÕES DE INICIALIZAÇÃO E PERSISTÊNCIA
   ========================================================================== */

function initApp() {
    // 1. Carregar produtos
    products = initialProducts;

    // 2. Inicializar ou carregar estoque
    if (localStorage.getItem('mn_stock')) {
        stock = JSON.parse(localStorage.getItem('mn_stock'));
    } else {
        // Criar estoque inicial fictício de 15 unidades por variação
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

    // 4. Carregar carrinho
    if (localStorage.getItem('mn_cart')) {
        cart = JSON.parse(localStorage.getItem('mn_cart'));
    }

    // Renderizações Iniciais
    renderProductGrid();
    updateCartUI();
    
    // Configurar listeners gerais
    setupEventListeners();
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

        // Imagem principal padrão (Branca ou Preta)
        const displayImage = `${p.imagePrefix}_branco.jpg`;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-card-image-box">
                <img src="${displayImage}" alt="${p.name}" class="product-card-img" onerror="this.src='https://placehold.co/400x400?text=Moletom+Marilene'">
                <span class="product-card-badge">${p.tag}</span>
            </div>
            <div class="product-card-content">
                <h3 class="product-card-title">${p.name}</h3>
                <p class="product-card-desc">${p.description}</p>
                <div class="product-card-footer">
                    <span class="product-card-price">R$ ${minPrice.toFixed(2).replace('.', ',')}</span>
                    <button class="btn btn-secondary btn-small" onclick="openProductModal('${p.id}')">Ver Detalhes</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function openProductModal(productId) {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    const modalContent = document.getElementById('modal-product-detail-container');
    
    // Estado do produto atual no Modal
    let selectedColor = p.colors[0];
    let selectedSize = p.sizes[1]; // Inicia no tamanho M por padrão
    
    const updateModalView = () => {
        const stockKey = `${p.id}_${selectedColor}_${selectedSize}`;
        const currentStock = stock[stockKey] ? stock[stockKey].qty : 0;
        const currentPrice = stock[stockKey] ? stock[stockKey].price : p.basePrice;
        const imgPath = `${p.imagePrefix}_${selectedColor.toLowerCase()}.jpg`;

        // Renderizar conteúdo dinamicamente
        modalContent.innerHTML = `
            <!-- Lado Imagem -->
            <div class="modal-image-side">
                <img src="${imgPath}" alt="${p.name}" class="modal-product-img" id="modal-display-img" onerror="this.src='https://placehold.co/600x600?text=Moletom+${selectedColor}'">
            </div>
            
            <!-- Lado Informações -->
            <div class="modal-content-side">
                <div>
                    <span class="modal-product-tag">${p.tag}</span>
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
                    ${currentStock <= 0 ? 'Sem Estoque Disponível' : 'Adicionar ao Carrinho'}
                </button>
            </div>
        `;

        // Ativar Listeners Internos do Modal
        
        // Clique nas cores
        modalContent.querySelectorAll('.color-option').forEach(el => {
            el.addEventListener('click', function() {
                selectedColor = this.getAttribute('data-color');
                // Se o tamanho atual não estiver disponível na nova cor, seleciona o primeiro tamanho disponível
                const testKey = `${p.id}_${selectedColor}_${selectedSize}`;
                if (!stock[testKey] || stock[testKey].qty <= 0) {
                    const firstAvail = p.sizes.find(s => stock[`${p.id}_${selectedColor}_${s}`].qty > 0);
                    if (firstAvail) selectedSize = firstAvail;
                }
                updateModalView();
            });
        });

        // Clique nos tamanhos
        modalContent.querySelectorAll('.choice-option').forEach(el => {
            el.addEventListener('click', function() {
                selectedSize = this.getAttribute('data-size');
                updateModalView();
            });
        });

        // Contador de quantidade
        const qtyInput = modalContent.querySelector('#qty-number-input');
        
        modalContent.querySelector('#qty-minus').addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) {
                qtyInput.value = val - 1;
            }
        });

        modalContent.querySelector('#qty-plus').addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val < currentStock) {
                qtyInput.value = val + 1;
            }
        });

        // Prevenir inserção manual de quantidade inválida
        qtyInput.addEventListener('change', function() {
            let val = parseInt(this.value) || 1;
            if (val < 1) val = 1;
            if (val > currentStock) val = currentStock;
            this.value = val;
        });

        // Botão Adicionar ao Carrinho
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
    // Verificar se o item com mesma variação já existe no carrinho
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
    
    // Abrir o carrinho automaticamente ao adicionar item
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-drawer-overlay').classList.add('open');
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal');
    const checkoutBtn = document.getElementById('checkout-trigger-btn');

    if (!badge || !container) return;

    // Calcular quantidade total de itens no carrinho
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    badge.innerText = totalItems;

    // Se estiver vazio
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
        const imgPath = `assets/hoodie_${item.productId === 'maria' ? 'maria' : 'quem_protege'}_${item.color.toLowerCase()}.jpg`;
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

    // Identificar o estado pelo prefixo do CEP
    const cepNum = parseInt(cepInput);
    let state = '';

    // Mapeamento simplificado de CEPs no Brasil
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
    else state = 'DF'; // Fallback Distrito Federal

    checkoutShippingState = state;
    const rule = shippingRates[state];
    stateInput.value = `${state} - ${rule.region}`;

    // Renderizar as opções de envio
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

    // Seleção padrão do primeiro
    selectShippingOption('PAC', rule.pac.price);
}

function selectShippingOption(method, price) {
    checkoutShippingMethod = method;
    checkoutShippingCost = price;
    
    // Atualizar estilo visual dos cards
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
    calculateTotalCheckout();
}

function calculateTotalCheckout() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Desconto Pix de 5%
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
    // Validar formulário
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

    // Validar estoque disponível antes de fechar pedido
    let stockValid = true;
    cart.forEach(item => {
        const key = `${item.productId}_${item.color}_${item.size}`;
        if (!stock[key] || stock[key].qty < item.qty) {
            alert(`Desculpe, o item ${item.name} (${item.color} - ${item.size}) está sem estoque suficiente no momento. Estoque atual: ${stock[key] ? stock[key].qty : 0}`);
            stockValid = false;
        }
    });

    if (!stockValid) return;

    // Subtrair do estoque
    cart.forEach(item => {
        const key = `${item.productId}_${item.color}_${item.size}`;
        stock[key].qty -= item.qty;
    });
    saveStockToStorage();

    // Calcular Valores Finais
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const total = subtotal + checkoutShippingCost - checkoutDiscount;

    // Criar Objeto Pedido
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

    // Adicionar aos pedidos
    orders.unshift(newOrder);
    saveOrdersToStorage();

    // Limpar Carrinho
    cart = [];
    saveCartToStorage();
    updateCartUI();

    // Atualizar UI de Confirmação
    document.getElementById('conf-order-id').innerText = orderId;
    document.getElementById('conf-payment-status').innerText = paymentMethod === 'pix' ? 'Aguardando Pagamento Pix' : (paymentMethod === 'boleto' ? 'Aguardando Compensação Boleto' : 'Confirmado (Cartão)');
    document.getElementById('conf-customer-address').innerText = `${street}, Nº ${number} ${complement ? '- ' + complement : ''} | ${neighborhood} - ${city}, ${checkoutShippingState} - CEP ${cep}`;

    // Ir para Confirmação
    navigateTo('confirmation-view');
}

/* ==========================================================================
   PAINEL ADMINISTRATIVO (ADMIN CONTROL)
   ========================================================================== */

function enterAdminPanel() {
    navigateTo('admin-view');
    
    // Simular clique na primeira tab (Dashboard) para carregar
    const dashboardTab = document.querySelector('[data-tab="admin-dashboard"]');
    if (dashboardTab) dashboardTab.click();
}

function renderAdminDashboard() {
    // 1. Calcular Métricas
    const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalOrders = orders.length;
    const ticket = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;
    
    // Contagem de estoque baixo
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

    // 2. Renderizar últimas vendas (Top 5)
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

    // 3. Desenhar Gráfico SVG
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

    // Criar um histórico fictício baseado nos pedidos reais ou sementes para preencher o gráfico
    // Vamos agrupar os últimos 7 dias de vendas
    const chartData = [1200, 1850, 1500, 2400, 3100, 2800, 0];
    
    // Substituir o último valor de hoje pela soma de pedidos de hoje
    const today = new Date();
    let todaySum = 0;
    orders.forEach(o => {
        const orderDate = new Date(o.date);
        if (orderDate.toDateString() === today.toDateString()) {
            todaySum += o.totalPrice;
        }
    });
    chartData[6] = Math.max(todaySum, 150); // Mínimo de R$ 150 para renderizar linha bonita

    // Construção do Gráfico SVG
    const width = 500;
    const height = 200;
    const padding = 30;
    
    // Encontrar escala
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
            <!-- Linhas de Grade de Fundo -->
            <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" class="chart-grid-line" />
            <line x1="${padding}" y1="${(height - padding * 2) / 2 + padding}" x2="${width - padding}" y2="${(height - padding * 2) / 2 + padding}" class="chart-grid-line" />
            <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" class="chart-grid-line" style="stroke: rgba(255,255,255,0.15);" />
            
            <!-- Área Preenchida -->
            <path d="${areaD}" fill="url(#chart-gradient)" />
            
            <!-- Linha Principal -->
            <path d="${pathD}" class="chart-line" />
            
            <!-- Pontos e Textos -->
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

    // Atualizar badge de pedidos pendentes
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
        // Recarregar pedidos pendentes badge no menu
        const pendingCount = orders.filter(ord => ord.status === 'pending').length;
        const pendingBadge = document.getElementById('admin-pending-badge');
        pendingBadge.innerText = pendingCount;
        pendingBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
        
        // Se estiver na aba Dashboard, recarregar
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
    
    // Atualizar vitrine para refletir preços novos
    renderProductGrid();
    
    // Recarregar tabela de estoque
    renderAdminStock();
}

/* ==========================================================================
   DISPARO DA APLICAÇÃO
   ========================================================================== */

window.addEventListener('DOMContentLoaded', initApp);
