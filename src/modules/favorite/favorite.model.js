import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'favorites',
  timestamps: true,
});

export { Favorite };
export default Favorite;
