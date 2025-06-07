const express = require('express');
const router = express.Router();

// Rota básica de teste
router.get('/test', (req, res) => {
  res.json({ message: 'Rota de arquivos funcionando!' });
});

module.exports = router;