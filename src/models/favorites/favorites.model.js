const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Favorite = sequelize.define('Favorite', {
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'favorites',
    timestamps: false,
    indexes: [
      { fields: ['event_id'] }
    ],
    uniqueKeys: {
      uq_favorites_user_event: {
        fields: ['user_id', 'event_id']
      }
    }
  });

  return Favorite;
};