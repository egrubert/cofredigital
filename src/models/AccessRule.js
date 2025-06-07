const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AccessRule = sequelize.define('AccessRule', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    permissionLevel: {
      type: DataTypes.ENUM('read', 'write', 'admin'),
      defaultValue: 'read',
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  AccessRule.associate = (models) => {
    AccessRule.belongsTo(models.User, { foreignKey: 'userId' });
    AccessRule.belongsTo(models.File, { foreignKey: 'fileId' });
  };

  return AccessRule;
};