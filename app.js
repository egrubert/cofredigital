require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorMiddleware');
const db = require('./src/config/database');

const app = express();

// Configurações iniciais
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middlewares básicos
app.use(helmet());
app.use(cors({
  origin: isProduction ? process.env.CLIENT_URL : '*',
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'src/public'), {
  maxAge: isProduction ? 86400000 : 0 // Cache de 1 dia em produção
}));

// Rotas da API
app.use('/api', routes);

// Rota principal - serve o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

// Para todas as outras rotas não API, servir o frontend (útil para SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/index.html'));
});

// Middleware de erro (deve ser o último middleware)
app.use(errorHandler);

// Conexão com o banco de dados e inicialização do servidor
db.authenticate()
  .then(() => {
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    return db.sync({ alter: !isProduction }); // Sincroniza modelos apenas em desenvolvimento
  })
  .then(() => {
    console.log('🔄 Modelos sincronizados.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Acesse: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    process.exit(1); // Encerra o processo em caso de erro crítico
  });

module.exports = app;