const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    venue_id: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    created_by: {
      type: DataTypes.CHAR(36),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(280),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    short_description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    cover_image_url: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'cancelled', 'archived'),
      allowNull: false,
      defaultValue: 'draft'
    },
    is_free: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    price_from: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    minimum_age: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true
    },
    external_url: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    total_favorites: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    average_rating: {
      type: DataTypes.DECIMAL(3,2),
      allowNull: true
    },
    total_feedbacks: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
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
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'events',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true,
    indexes: [
      { fields: ['category_id'] },
      { fields: ['venue_id'] },
      { fields: ['created_by'] },
      { fields: ['status'] },
      { fields: ['is_free'] },
      { fields: ['deleted_at'] }
    ]
  });

  return Event;
};