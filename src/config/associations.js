import User from '../modules/user/user.model.js';
import Event from '../modules/event/event.model.js';
import Category from '../modules/category/category.model.js';
import Favorite from '../modules/favorite/favorite.model.js';
import Comment from '../modules/comment/comment.model.js';
import Notification from '../modules/notifications/notification.model.js';

// Category ↔ Event
Event.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Event, { foreignKey: 'category_id', as: 'events' });

// User ↔ Favorite
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });

// Event ↔ Favorite
Favorite.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
Event.hasMany(Favorite, { foreignKey: 'event_id', as: 'favorites' });

// User ↔ Comment
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });

// Event ↔ Comment
Comment.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });
Event.hasMany(Comment, { foreignKey: 'event_id', as: 'comments' });

// User ↔ Notification
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

export { User, Event, Category, Favorite, Comment, Notification };
