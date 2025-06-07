const { DataTypes } = require('sequelize');
const db = require('../config/database');

const File = db.define('File', {
  file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
});

module.exports = File;