const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateCPF } = require('../utils/validators');

const authController = {
  async register(req, res, next) {
    try {
      const { fullName, email, cpf, password } = req.body;

      // Validações
      if (!validateCPF(cpf)) {
        return res.status(400).json({ error: 'CPF inválido' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
      }

      // Verificar se usuário já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
      }

      const cpfExists = await User.findOne({ where: { cpf } });
      if (cpfExists) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }

      // Criar usuário
      const user = await User.create({
        full_name: fullName,
        email,
        cpf,
        password_hash: password // Será hasheado pelo hook beforeSave
      });

      // Gerar token JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.json({
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          cpf: user.cpf
        },
        token
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      return res.json({
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          cpf: user.cpf
        },
        token
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;