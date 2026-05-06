const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserEventScore = sequelize.define('UserEventScore', {
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    event_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    score: {
      type: DataTypes.DECIMAL(8,4),
      allowNull: false,
      defaultValue: 0
    },
    computed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_event_scores',
    timestamps: false,
    indexes: [
      { fields: ['score'] }
    ]
  });

  return UserEventScore;
};