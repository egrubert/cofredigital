const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Approval = sequelize.define('Approval', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requestType: {
      type: DataTypes.ENUM('access', 'transfer', 'deletion'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    decisionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Approval.associate = (models) => {
    Approval.belongsTo(models.User, { 
      as: 'requester',
      foreignKey: 'requesterId' 
    });
    Approval.belongsTo(models.User, { 
      as: 'approver',
      foreignKey: 'approverId' 
    });
    Approval.belongsTo(models.File, { 
      foreignKey: 'fileId',
      allowNull: true 
    });
  };

  return Approval;
};