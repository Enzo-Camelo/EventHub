import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventController } from '../event.controller.js';
import { EventService } from '../event.service.js';

// Faz o mock do EventService inteiro
vi.mock('../event.service.js', () => ({
  EventService: {
    createEvent: vi.fn(),
    deleteEvent: vi.fn(),
    updateEvent: vi.fn(),
    toggleFavorite: vi.fn(),
  },
}));

describe('EventController', () => {
  let req;
  let res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { body: {}, params: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  // ───────────────────────────────────────────
  describe('createEvent()', () => {
    // T15 - Sucesso: retorna 201 com o evento criado
    it('T15 - deve retornar 201 e o evento criado em caso de sucesso', async () => {
      const mockEvent = { id: 1, title: 'Rock in Rio' };
      req.body = { title: 'Rock in Rio', location: 'Rio' };
      EventService.createEvent.mockResolvedValue(mockEvent);

      await EventController.createEvent(req, res);

      expect(EventService.createEvent).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    // T16 - Erro: retorna 400 com a mensagem de erro do service
    it('T16 - deve retornar 400 se o serviço lançar um erro', async () => {
      req.body = {};
      EventService.createEvent.mockRejectedValue(new Error('title é obrigatório'));

      await EventController.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'title é obrigatório' });
    });
  });

  // ───────────────────────────────────────────
  describe('deleteEvent()', () => {
    // T17 - Sucesso: retorna 200 com mensagem de confirmação
    it('T17 - deve retornar 200 e mensagem de sucesso ao deletar', async () => {
      req.params = { id: '1' };
      EventService.deleteEvent.mockResolvedValue(true);

      await EventController.deleteEvent(req, res);

      expect(EventService.deleteEvent).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Evento deletado com sucesso' });
    });

    // T18 - Erro: retorna 400 ao tentar deletar evento inexistente
    it('T18 - deve retornar 400 se o evento não for encontrado', async () => {
      req.params = { id: '99' };
      EventService.deleteEvent.mockRejectedValue(new Error('Evento não encontrado'));

      await EventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Evento não encontrado' });
    });
  });

  // ───────────────────────────────────────────
  describe('updateEvent()', () => {
    // T19 - Sucesso: retorna 200 com o evento atualizado
    it('T19 - deve retornar 200 e o evento atualizado em caso de sucesso', async () => {
      const mockUpdated = { id: 1, title: 'Novo Título' };
      req.params = { id: '1' };
      req.body = { title: 'Novo Título' };
      EventService.updateEvent.mockResolvedValue(mockUpdated);

      await EventController.updateEvent(req, res);

      expect(EventService.updateEvent).toHaveBeenCalledWith('1', req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdated);
    });

    // T20 - Erro: retorna 400 se evento não existir
    it('T20 - deve retornar 400 se o serviço lançar erro ao atualizar', async () => {
      req.params = { id: '99' };
      req.body = { title: 'X' };
      EventService.updateEvent.mockRejectedValue(new Error('Evento não encontrado'));

      await EventController.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Evento não encontrado' });
    });
  });

  // ───────────────────────────────────────────
  describe('toggleFavorite()', () => {
    // T21 - Sucesso: retorna 200 indicando que favoritou
    it('T21 - deve retornar 200 e { favorited: true } ao favoritar', async () => {
      req.body = { userId: 1, eventId: 10 };
      EventService.toggleFavorite.mockResolvedValue({ favorited: true });

      await EventController.toggleFavorite(req, res);

      expect(EventService.toggleFavorite).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ favorited: true });
    });

    // T22 - Sucesso: retorna 200 indicando que desfavoritou
    it('T22 - deve retornar 200 e { favorited: false } ao desfavoritar', async () => {
      req.body = { userId: 1, eventId: 10 };
      EventService.toggleFavorite.mockResolvedValue({ favorited: false });

      await EventController.toggleFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ favorited: false });
    });

    // T23 - Erro: retorna 400 se o service lançar erro
    it('T23 - deve retornar 400 se o serviço lançar erro ao favoritar', async () => {
      req.body = { userId: 1, eventId: 10 };
      EventService.toggleFavorite.mockRejectedValue(new Error('Evento não encontrado'));

      await EventController.toggleFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Evento não encontrado' });
    });
  });
});
