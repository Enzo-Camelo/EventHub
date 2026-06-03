import { Router } from 'express';
import { FavoriteController } from './favorite.controller.js';

const router = Router();

router.post('/', FavoriteController.addFavorite);
router.delete('/', FavoriteController.removeFavorite);
router.get('/:userId', FavoriteController.getUserFavorites);
router.get('/check/:userId/:eventId', FavoriteController.isFavorited);

export default router;
