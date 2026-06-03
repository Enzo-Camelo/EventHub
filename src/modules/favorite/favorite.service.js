import { Favorite } from './favorite.model.js';
import { Event } from '../event/event.model.js';
import { User } from '../user/user.model.js';

export const FavoriteService = {

  async addFavorite(userId, eventId) {
    if (!userId) throw new Error('userId é obrigatório');
    if (!eventId) throw new Error('eventId é obrigatório');

    const event = await Event.findByPk(eventId);
    if (!event) throw new Error('Evento não encontrado');

    const existing = await Favorite.findOne({
      where: { user_id: userId, event_id: eventId },
    });
    if (existing) throw new Error('Evento já favoritado');

    return await Favorite.create({ user_id: userId, event_id: eventId });
  },

  async removeFavorite(userId, eventId) {
    if (!userId) throw new Error('userId é obrigatório');

    const fav = await Favorite.findOne({
      where: { user_id: userId, event_id: eventId },
    });
    if (!fav) throw new Error('Favorito não encontrado');

    await fav.destroy();
    return true;
  },

  async getUserFavorites(userId) {
    return await Favorite.findAll({
      where: { user_id: userId },
      include: [{ model: Event }],
    });
  },

  async isFavorited(userId, eventId) {
    const fav = await Favorite.findOne({
      where: { user_id: userId, event_id: eventId },
    });
    return !!fav;
  },
};
