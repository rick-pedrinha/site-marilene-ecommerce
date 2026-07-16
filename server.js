const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    // Resolver o caminho do arquivo solicitado
    let filePath = req.url === '/' 
        ? path.join(__dirname, 'index.html') 
        : path.join(__dirname, req.url.split('?')[0]); // Remover query strings se houver
    
    // Obter extensão do arquivo
    const ext = path.extname(filePath).toLowerCase();
    
    // Verificar se o arquivo existe
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Arquivo não encontrado - Retorna 404 simples
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Erro 404: Página ou recurso não encontrado.');
            return;
        }

        // Ler e retornar o arquivo
        fs.readFile(filePath, (error, content) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(`Erro 500: Erro interno do servidor. ${error.code}`);
                return;
            }

            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        });
    });
});

server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n======================================================`);
    console.log(`🚀 Servidor rodando com sucesso em: ${url}`);
    console.log(`   Pressione Ctrl + C para encerrar o servidor.`);
    console.log(`======================================================\n`);

    // Abrir o navegador automaticamente no Windows
    exec(`cmd /c start ${url}`, (err) => {
        if (err) {
            console.log(`Nota: Não foi possível abrir o navegador automaticamente, acesse ${url} no seu browser.`);
        }
    });
});
