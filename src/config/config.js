require('dotenv').config();

module.exports = {
  // Configurações básicas da aplicação
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  
  // Configurações de segurança
  JWT_SECRET: process.env.JWT_SECRET || 'segredo_dev_local',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  SESSION_SECRET: process.env.SESSION_SECRET || 'outro_segredo_dev',
  
  // Configurações do banco de dados
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_USER: process.env.DB_USER || 'cofredigital',
  DB_PASSWORD: process.env.DB_PASSWORD || '@Cofredigital25',
  DB_NAME: process.env.DB_NAME || 'cofredigital',
  DB_DIALECT: process.env.DB_DIALECT || 'mysql',
  DB_TIMEZONE: process.env.DB_TIMEZONE || '-03:00',
  DB_SSL: process.env.DB_SSL === 'true',
  
  // Configurações de pool de conexões
  DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX) || 5,
  DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN) || 0,
  DB_POOL_ACQUIRE: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
  DB_POOL_IDLE: parseInt(process.env.DB_POOL_IDLE) || 10000,
  
  // Configurações de armazenamento
  STORAGE_TYPE: process.env.STORAGE_TYPE || 'local',
  UPLOAD_LIMIT: process.env.UPLOAD_LIMIT || '50MB',
  
  // Outras configurações
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100
};