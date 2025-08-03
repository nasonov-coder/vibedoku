const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './vibedoku.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, there was an error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Serving Sudoku game: http://localhost:${PORT}/sudoku-import-advanced.html`);
    console.log('\nAvailable games:');
    console.log(`- Vibedoku (NEW!): http://localhost:${PORT}/vibedoku.html`);
    console.log(`- Advanced Import: http://localhost:${PORT}/sudoku-import-advanced.html`);
    console.log(`- Custom Input: http://localhost:${PORT}/sudoku-custom-input.html`);
    console.log(`- Expert Demo: http://localhost:${PORT}/sudoku-expert-demo.html`);
    console.log(`- Standalone: http://localhost:${PORT}/sudoku-standalone.html`);
});