const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log, // Ative logs para debug
    dialectOptions: {
      connectTimeout: 60000,
      // Para MySQL 8+
      authPlugins: {
        mysql_native_password: () => require('mysql2/lib/auth/mysql_native_password'),
      }
    },
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
      max: 5 // Número máximo de tentativas
    }
  }
);

// Teste de conexão com mais informações
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexão bem-sucedida com MySQL');
    console.log(`🔗 Conectado como ${process.env.DB_USER}@${process.env.DB_HOST} no banco ${process.env.DB_NAME}`);
  })
  .catch(err => {
    console.error('❌ Falha na conexão com MySQL:');
    console.error(`🔍 Detalhes: ${err.message}`);
    console.error('ℹ️ Verifique:');
    console.error('- Credenciais no .env');
    console.error('- Usuário e privilégios no MySQL');
    console.error('- Serviço MySQL em execução (sudo service mysql status)');
  });

module.exports = sequelize;