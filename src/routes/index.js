const express = require('express');
const router = express.Router();

// Rotas de autenticação
const authRoutes = require('./authRoutes');
router.use('/auth', authRoutes);

// Rotas de arquivos (com verificação de existência)
try {
  const fileRoutes = require('./fileRoutes');
  router.use('/files', fileRoutes);
} catch (err) {
  console.warn('Rotas de arquivos não carregadas - arquivo não encontrado');
}

module.exports = router;