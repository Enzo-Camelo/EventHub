const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EventTag = sequelize.define('EventTag', {
    event_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true
    },
    tag_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'event_tags',
    timestamps: false
  });

  return EventTag;
};