const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O nome completo é obrigatório'
        },
        len: {
          args: [3, 100],
          msg: 'O nome deve ter entre 3 e 100 caracteres'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Por favor, insira um e-mail válido'
        },
        notEmpty: {
          msg: 'O e-mail é obrigatório'
        }
      }
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: {
          args: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/,
          msg: 'CPF deve estar no formato 000.000.000-00'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'A senha é obrigatória'
        },
        len: {
          args: [8, 100],
          msg: 'A senha deve ter no mínimo 8 caracteres'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: /^\(\d{2}\) \d{4,5}\-\d{4}$/,
          msg: 'Telefone deve estar no formato (00) 00000-0000'
        }
      }
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: 'Data de nascimento inválida'
        },
        isBefore: {
          args: new Date().toISOString(),
          msg: 'Data de nascimento deve ser no passado'
        }
      }
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'deleted'),
      defaultValue: 'active'
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    },
    defaultScope: {
      attributes: { exclude: ['password', 'twoFactorSecret', 'resetPasswordToken', 'resetPasswordExpires'] }
    },
    scopes: {
      withSensitiveData: {
        attributes: { include: ['password', 'twoFactorSecret'] }
      }
    }
  });

  // Métodos de instância
  User.prototype.generateAuthToken = function() {
    return jwt.sign(
      { id: this.id, email: this.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );
  };

  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.getPublicProfile = function() {
    const user = this.get();
    delete user.password;
    delete user.twoFactorSecret;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    return user;
  };

  // Associações
  User.associate = (models) => {
    User.hasMany(models.File, {
      foreignKey: 'ownerId',
      as: 'ownedFiles'
    });
    
    User.belongsToMany(models.File, {
      through: 'AccessRule',
      as: 'sharedFiles',
      foreignKey: 'userId'
    });
    
    User.hasMany(models.AccessRule, {
      foreignKey: 'userId',
      as: 'accessRules'
    });
    
    User.hasMany(models.Approval, {
      foreignKey: 'requesterId',
      as: 'requestsMade'
    });
    
    User.hasMany(models.Approval, {
      foreignKey: 'approverId',
      as: 'requestsToApprove'
    });
  };

  return User;
};