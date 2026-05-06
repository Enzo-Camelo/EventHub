const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Media = sequelize.define('Media', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    event_id: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('image', 'video', 'document'),
      allowNull: false,
      defaultValue: 'image'
    },
    url: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    alt_text: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    size_bytes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    mime_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sort_order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    uploaded_by: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'media',
    timestamps: false,
    indexes: [
      { fields: ['event_id'] },
      { fields: ['type'] }
    ]
  });

  return Media;
};