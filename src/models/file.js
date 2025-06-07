const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    encryptionKey: {
      type: DataTypes.TEXT,
      allowNull: true, // Será preenchido se o arquivo for criptografado
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });

  File.associate = (models) => {
    File.belongsTo(models.User, { foreignKey: 'ownerId' });
    File.belongsToMany(models.User, {
      through: 'AccessRule',
      as: 'sharedWith',
      foreignKey: 'fileId',
    });
  };

  return File;
};