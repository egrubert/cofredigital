require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Middleware de erro
app.use(errorHandler);

// Conexão com o banco de dados
const db = require('./config/database');

// Testar conexão e sincronizar modelos
db.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
  .then(() => db.sync({ alter: true }))
  .then(() => console.log('Modelos sincronizados.'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;