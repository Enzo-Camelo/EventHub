import Favorite from './favorite.model.js';
import User from '../user/user.model.js';
import Event from '../event/event.model.js';

/**
 * Adiciona um evento à lista de favoritos do usuário.
 * @param {number} userId
 * @param {number} eventId
 * @returns {Promise<Favorite>}
 */
export async function addFavorite(userId, eventId) {
  if (!userId) throw new Error('userId é obrigatório');
  if (!eventId) throw new Error('eventId é obrigatório');

  const user = await User.findByPk(userId);
  if (!user) throw new Error('Usuário não encontrado');

  const event = await Event.findByPk(eventId);
  if (!event) throw new Error('Evento não encontrado');

  const existing = await Favorite.findOne({ where: { user_id: userId, event_id: eventId } });
  if (existing) throw new Error('Evento já favoritado');

  const favorite = await Favorite.create({ user_id: userId, event_id: eventId });
  return favorite;
}

/**
 * Remove um favorito do usuário.
 * @param {number} userId
 * @param {number} eventId
 * @returns {Promise<void>}
 */
export async function removeFavorite(userId, eventId) {
  if (!userId) throw new Error('userId é obrigatório');

  const favorite = await Favorite.findOne({ where: { user_id: userId, event_id: eventId } });
  if (!favorite) throw new Error('Favorito não encontrado');

  await favorite.destroy();
}

/**
 * Retorna todos os favoritos de um usuário com os dados do evento.
 * @param {number} userId
 * @returns {Promise<Favorite[]>}
 */
export async function getUserFavorites(userId) {
  const favorites = await Favorite.findAll({
    where: { user_id: userId },
    include: [{ model: Event, as: 'event' }],
  });
  return favorites;
}

/**
 * Verifica se um evento está favoritado pelo usuário.
 * @param {number} userId
 * @param {number} eventId
 * @returns {Promise<boolean>}
 */
export async function isFavorited(userId, eventId) {
  const favorite = await Favorite.findOne({ where: { user_id: userId, event_id: eventId } });
  return favorite !== null;
}
