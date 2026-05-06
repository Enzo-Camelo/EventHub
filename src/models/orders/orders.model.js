const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    event_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    event_date_id: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    payment_method_id: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending'
    },
    total_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    currency: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      defaultValue: 'BRL'
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    provider_ref: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['user_id'] },
      { fields: ['event_id'] },
      { fields: ['status'] }
    ]
  });

  return Order;
};