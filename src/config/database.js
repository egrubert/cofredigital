const { Sequelize } = require('sequelize');
const config = require('./config');// Assumindo que você tem um arquivo config.js
const logger = require('../utils/logger'); // Recomendo criar um logger personalizado

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    port: config.DB_PORT || 3306,
    dialect: config.DB_DIALECT || 'mysql',
    timezone: config.DB_TIMEZONE || '-03:00', // Fuso horário do Brasil
    
    // Configurações de pool de conexões
    pool: {
      max: config.DB_POOL_MAX || 5,
      min: config.DB_POOL_MIN || 0,
      acquire: config.DB_POOL_ACQUIRE || 30000,
      idle: config.DB_POOL_IDLE || 10000
    },
    
    // Configurações de logging
    logging: config.NODE_ENV === 'development' 
      ? (msg) => logger.debug(msg) 
      : false,
    
    // Opções específicas do dialeto
    dialectOptions: {
      connectTimeout: 60000,
      supportBigNumbers: true,
      bigNumberStrings: true,
      decimalNumbers: true,
      dateStrings: true,
      typeCast: true,
      
      // Para MySQL 8+
      authPlugins: {
        mysql_native_password: () => require('mysql2/lib/auth/mysql_native_password'),
      },
      
      // SSL config (para produção)
      ssl: config.DB_SSL ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    
    // Configurações de reconexão
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ESOCKET/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      max: 5, // Número máximo de tentativas
      backoffBase: 1000, // Tempo inicial de espera em ms
      backoffExponent: 1.5 // Fator de exponenciação para backoff
    },
    
    // Configurações globais do Sequelize
    define: {
      timestamps: true, // Adiciona createdAt e updatedAt
      underscored: true, // Usa snake_case em vez de camelCase
      freezeTableName: true, // Não pluraliza nomes de tabelas
      paranoid: true // Adiciona deletedAt para soft delete
    }
  }
);

// Função para testar conexão com tratamento aprimorado de erros
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexão com MySQL estabelecida com sucesso');
    logger.info(`🔌 Conectado como ${config.DB_USER}@${config.DB_HOST}:${config.DB_PORT || 3306}`);
    logger.info(`💾 Banco de dados: ${config.DB_NAME}`);
    
    // Verificar versão do MySQL
    const [results] = await sequelize.query('SELECT VERSION() as version');
    if (results && results[0]) {
      logger.info(`⚡ Versão do MySQL: ${results[0].version}`);
    }
    
    return true;
  } catch (error) {
    logger.error('❌ Falha na conexão com MySQL:', error);
    
    // Mensagens de diagnóstico amigáveis
    if (error.original) {
      switch (error.original.code) {
        case 'ER_ACCESS_DENIED_ERROR':
          logger.error('🔒 Erro de autenticação - Verifique usuário e senha');
          break;
        case 'ER_BAD_DB_ERROR':
          logger.error('📛 Banco de dados não existe - Crie o banco primeiro');
          break;
        case 'ECONNREFUSED':
          logger.error('🔌 Conexão recusada - Verifique se o MySQL está rodando');
          break;
        case 'ETIMEDOUT':
          logger.error('⏱️ Timeout de conexão - Verifique a rede ou aumente o timeout');
          break;
        default:
          logger.error('💡 Dica: Verifique logs do MySQL para mais detalhes');
      }
    }
    
    // Sugestões de solução
    logger.info('\n🛠️  O que verificar:');
    logger.info('- Credenciais no arquivo .env');
    logger.info('- Serviço MySQL em execução (sudo service mysql status)');
    logger.info('- Permissões do usuário no MySQL');
    logger.info('- Firewall/redes (se aplicável)');
    
    process.exit(1); // Encerra o processo com erro
  }
};

// Sincronização segura dos modelos (apenas em desenvolvimento)
const syncModels = async () => {
  if (config.NODE_ENV === 'development') {
    try {
      await sequelize.sync({ alter: true });
      logger.info('🔄 Modelos sincronizados com o banco de dados');
    } catch (error) {
      logger.error('❌ Erro ao sincronizar modelos:', error);
    }
  }
};

// Exporta a instância e funções úteis
module.exports = {
  sequelize,
  testConnection,
  syncModels,
  Sequelize // Exporta o Sequelize para uso em modelos/migrations
};