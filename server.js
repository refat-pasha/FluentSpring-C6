// Optional local Node.js server for FluentSpring C6. No dependencies required.
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.ts':'text/plain; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };
http.createServer((req,res) => {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.resolve(root, '.' + urlPath);
  if (!filePath.startsWith(root + path.sep) && filePath !== path.join(root, 'index.html')) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(filePath, (error, data) => {
    if (error) { res.writeHead(error.code === 'ENOENT' ? 404 : 500, {'Content-Type':'text/plain; charset=utf-8'}); return res.end(error.code === 'ENOENT' ? 'File not found' : 'Could not read file'); }
    res.writeHead(200, {'Content-Type':types[path.extname(filePath)] || 'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`FluentSpring lesson running at http://127.0.0.1:${port}`));
