const express = require('express');
const app = express();
const port = 3000;

// Rota para a página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static('public'));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});