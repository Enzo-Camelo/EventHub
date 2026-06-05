import { Router } from 'express';
import { EventController } from './event.controller.js';

const router = Router();

router.post('/', EventController.createEvent);
router.delete('/:id', EventController.deleteEvent);
router.put('/:id', EventController.updateEvent);
router.post('/favorite', EventController.toggleFavorite);

export default router;
