const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = Number(process.env.PORT) || 3000;
const STORE_URL = (process.env.STORE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const CATALOG_FILE = path.join(__dirname, 'data', 'catalog.json');
const SUPABASE_URL = 'https://jlmzisqtashbdsppryso.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_KVGBrXgrSr3PqcBDIq7DeQ_ntOl4uYP';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4',
    '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8'
};

let serverCatalog = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));

function saveServerCatalog() {
    fs.writeFileSync(CATALOG_FILE, JSON.stringify(serverCatalog, null, 2));
}

function sendJson(res, status, payload) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
}

function applyCors(req, res) {
    const origin = req.headers.origin;
    let storeOrigin = STORE_URL;
    try { storeOrigin = new URL(STORE_URL).origin; } catch (error) {}
    const allowedOrigins = new Set([storeOrigin, `http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`]);
    if (origin && allowedOrigins.has(origin.replace(/\/$/, ''))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
}

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 1024 * 1024) {
                reject(new Error('Corpo da requisição muito grande.'));
                req.destroy();
            }
        });
        req.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch (error) { reject(new Error('JSON inválido.')); }
        });
        req.on('error', reject);
    });
}

async function verifyAdminRequest(req) {
    const authorization = String(req.headers.authorization || '');
    if (!authorization.startsWith('Bearer ')) return false;
    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { apikey: SUPABASE_PUBLIC_KEY, Authorization: authorization }
    });
    if (!userResponse.ok) return false;
    const user = await userResponse.json();
    const adminResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/admin_users?user_id=eq.${encodeURIComponent(user.id)}&active=eq.true&select=user_id`,
        { headers: { apikey: SUPABASE_PUBLIC_KEY, Authorization: authorization } }
    );
    if (!adminResponse.ok) return false;
    const admins = await adminResponse.json();
    return Array.isArray(admins) && admins.length === 1;
}

async function updateCatalogFromAdmin(req, res) {
    if (!await verifyAdminRequest(req)) {
        sendJson(res, 403, { error: 'Acesso administrativo inválido.' });
        return;
    }
    const payload = await readJsonBody(req);

    if (Array.isArray(payload.items)) {
        payload.items.forEach(item => {
            const key = String(item.key || '').slice(0, 100);
            const price = Number(item.price);
            const qty = Number(item.qty);
            if (key && Number.isFinite(price) && price > 0 && Number.isInteger(qty) && qty >= 0) {
                serverCatalog[key] = { price: Number(price.toFixed(2)), qty };
            }
        });
    } else {
        const productId = String(payload.productId || '').slice(0, 80);
        const color = String(payload.color || '').slice(0, 40);
        if (!productId || !color || !Array.isArray(payload.variations)) {
            throw new Error('Atualização de catálogo inválida.');
        }
        payload.variations.forEach(variation => {
            const size = String(variation.size || '').slice(0, 10);
            const price = Number(variation.price);
            const qty = Number(variation.qty);
            if (!size || !Number.isFinite(price) || price <= 0 || !Number.isInteger(qty) || qty < 0) {
                throw new Error(`Valores inválidos para o tamanho ${size || '?'}.`);
            }
            serverCatalog[`${productId}_${color}_${size}`] = { price: Number(price.toFixed(2)), qty };
        });
    }
    saveServerCatalog();
    sendJson(res, 200, { updated: true, stock: serverCatalog });
}

async function routeApi(req, res, requestUrl) {
    applyCors(req, res);
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return true; }
    if (requestUrl.pathname === '/api/health' && req.method === 'GET') {
        sendJson(res, 200, { ok: true, payments: 'pix-manual' }); return true;
    }
    if (requestUrl.pathname === '/api/catalog' && req.method === 'GET') {
        sendJson(res, 200, { stock: serverCatalog }); return true;
    }
    if (requestUrl.pathname === '/api/admin/catalog' && req.method === 'PUT') {
        await updateCatalogFromAdmin(req, res); return true;
    }
    return false;
}

function serveStaticFile(res, requestUrl) {
    const relativePath = requestUrl.pathname === '/' ? 'index.html' : decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '');
    const filePath = path.resolve(__dirname, relativePath);
    const rootPath = path.resolve(__dirname);
    if (!filePath.startsWith(rootPath + path.sep) && filePath !== path.join(rootPath, 'index.html')) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Acesso negado.');
        return;
    }
    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(error.code === 'ENOENT' ? 'Página não encontrada.' : 'Erro interno do servidor.');
            return;
        }
        res.writeHead(200, {
            'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
            'X-Content-Type-Options': 'nosniff'
        });
        res.end(content);
    });
}

const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url, `http://${req.headers.host || `localhost:${PORT}`}`);
    try {
        if (requestUrl.pathname.startsWith('/api/')) {
            const handled = await routeApi(req, res, requestUrl);
            if (!handled) sendJson(res, 404, { error: 'Endpoint não encontrado.' });
            return;
        }
        serveStaticFile(res, requestUrl);
    } catch (error) {
        console.error(error);
        if (!res.headersSent) sendJson(res, error.status || 400, { error: error.message });
    }
});

server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\nServidor Marilene: ${url}`);
    console.log('Pagamento: Pix direto com confirmação manual\n');
    if (!process.env.MN_NO_BROWSER) exec(`cmd /c start ${url}`, error => {
        if (error) console.log(`Acesse ${url} no navegador.`);
    });
});
