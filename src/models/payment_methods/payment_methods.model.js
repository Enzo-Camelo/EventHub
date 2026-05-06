const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    provider_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('credit_card', 'pix', 'boleto', 'wallet'),
      allowNull: false
    },
    last_four: {
      type: DataTypes.CHAR(4),
      allowNull: true
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'payment_methods',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] }
    ]
  });

  return PaymentMethod;
};