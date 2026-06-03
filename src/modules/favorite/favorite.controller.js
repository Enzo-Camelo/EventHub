import { FavoriteService } from './favorite.service.js';

export const FavoriteController = {
  async addFavorite(req, res) {
    try {
      const { userId, eventId } = req.body;
      const favorite = await FavoriteService.addFavorite(userId, eventId);
      return res.status(201).json(favorite);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async removeFavorite(req, res) {
    try {
      const { userId, eventId } = req.body;
      await FavoriteService.removeFavorite(userId, eventId);
      return res.status(200).json({ message: 'Favorito removido com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async getUserFavorites(req, res) {
    try {
      const { userId } = req.params;
      const favorites = await FavoriteService.getUserFavorites(userId);
      return res.status(200).json(favorites);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async isFavorited(req, res) {
    try {
      const { userId, eventId } = req.params;
      const isFav = await FavoriteService.isFavorited(userId, eventId);
      return res.status(200).json({ isFavorited: isFav });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};
