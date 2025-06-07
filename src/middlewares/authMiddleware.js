const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  async auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      req.userId = user.id;
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  }
};