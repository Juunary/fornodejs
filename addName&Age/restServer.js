const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const users = {};

http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET') {
      if (req.url === '/') {
        const data = await fs.readFile(path.join(__dirname, 'restFront.html'));
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(data);
      } else if (req.url === '/about') {
        const data = await fs.readFile(path.join(__dirname, 'about.html'));
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(data);
      } else if (req.url === '/users') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(users));
      }

      try {
        const data = await fs.readFile(path.join(__dirname, req.url));
        return res.end(data);
      } catch (err) {
        res.writeHead(404);
        return res.end('NOT FOUND');
      }
    } else if (req.method === 'POST') {
      if (req.url === '/user') {
        let body = '';
        req.on('data', (data) => {
          body += data;
        });
        return req.on('end', () => {
          const { name, age } = JSON.parse(body); // 나이 정보도 받아옵니다.
          const id = Date.now();
          users[id] = { name, age }; // 나이 정보를 포함한 사용자 정보를 저장합니다.
          res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(JSON.stringify({ message: '등록 성공' }));
        });
      }
    } else if (req.method === 'PUT') {
      if (req.url.startsWith('/user/')) {
        const key = req.url.split('/')[2];
        let body = '';
        req.on('data', (data) => {
          body += data;
        });
        return req.on('end', () => {
          users[key] = JSON.parse(body);
          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          return res.end(JSON.stringify(users));
        });
      }
    } else if (req.method === 'DELETE') {
      if (req.url.startsWith('/user/')) {
        const key = req.url.split('/')[2];
        delete users[key];
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end(JSON.stringify(users));
      }
    }

    res.writeHead(404);
    return res.end('NOT FOUND');
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(err.message);
  }
})
  .listen(8083, () => {
    console.log('8083번 포트에서 서버 대기 중입니다');
  });
