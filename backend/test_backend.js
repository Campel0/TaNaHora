const http = require('http');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: 1, email: "teste@teste.com" }, "chave_super_secreta_tanahora", { expiresIn: "1h" });

const data = JSON.stringify({
  medicamentoId: "1",
  status: "Tomado"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/notificacoes',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log('Body:', body);
  });
});

req.on('error', error => {
  console.error('Erro na requisição:', error);
});

req.write(data);
req.end();
