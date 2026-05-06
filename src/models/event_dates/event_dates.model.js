const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EventDate = sequelize.define('EventDate', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    event_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_sold_out: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    tableName: 'event_dates',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['event_id'] },
      { fields: ['starts_at'] }
    ]
  });

  return EventDate;
};