import { EventService } from './event.service.js';

export const EventController = {

  async createEvent(req, res) {
    try {
      const event = await EventService.createEvent(req.body);
      return res.status(201).json(event);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await EventService.deleteEvent(id);
      return res.status(200).json({ message: 'Evento deletado com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const event = await EventService.updateEvent(id, req.body);
      return res.status(200).json(event);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async toggleFavorite(req, res) {
    try {
      const { userId, eventId } = req.body;
      const result = await EventService.toggleFavorite(userId, eventId);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
};
