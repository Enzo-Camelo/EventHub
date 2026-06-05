import { Event } from './event.model.js';
import { Favorite } from '../favorite/favorite.model.js';

export const EventService = {

  async createEvent(data) {
    const { title } = data;
    if (!title) throw new Error('title é obrigatório');
    return await Event.create(data);
  },

  async deleteEvent(id) {
    if (!id) throw new Error('id é obrigatório');

    const event = await Event.findByPk(id);
    if (!event) throw new Error('Evento não encontrado');

    await event.destroy();
    return true;
  },

  async updateEvent(id, data) {
    if (!id) throw new Error('id é obrigatório');

    const event = await Event.findByPk(id);
    if (!event) throw new Error('Evento não encontrado');

    return await event.update(data);
  },

  async toggleFavorite(userId, eventId) {
    if (!userId) throw new Error('userId é obrigatório');
    if (!eventId) throw new Error('eventId é obrigatório');

    const event = await Event.findByPk(eventId);
    if (!event) throw new Error('Evento não encontrado');

    const existing = await Favorite.findOne({
      where: { user_id: userId, event_id: eventId },
    });

    if (existing) {
      await existing.destroy();
      return { favorited: false };
    }

    await Favorite.create({ user_id: userId, event_id: eventId });
    return { favorited: true };
  },
};
