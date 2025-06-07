const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados bem-sucedida!');
  } catch (error) {
    console.error('❌ Falha na conexão com o banco de dados:', error.message);
  } finally {
    await sequelize.close();
  }
}

testConnection();