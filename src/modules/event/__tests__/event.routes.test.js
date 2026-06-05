import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';
import { EventService } from '../event.service.js';

// Mock do Service, pois aqui é um teste da Rota e Controller integrados
vi.mock('../event.service.js', () => ({
  EventService: {
    createEvent: vi.fn(),
    deleteEvent: vi.fn(),
    updateEvent: vi.fn(),
    toggleFavorite: vi.fn(),
  },
}));

describe('Rotas de Eventos (/events)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ───────────────────────────────────────────
  describe('POST /events', () => {
    // T24 - Sucesso: cria evento e retorna 201
    it('T24 - deve retornar 201 quando criar evento com sucesso', async () => {
      EventService.createEvent.mockResolvedValue({ id: 1, title: 'Rock in Rio' });

      const response = await request(app)
        .post('/events')
        .send({ title: 'Rock in Rio', location: 'Rio' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 1);
    });

    // T25 - Erro: retorna 400 se title ausente
    it('T25 - deve retornar 400 se o service falhar', async () => {
      EventService.createEvent.mockRejectedValue(new Error('title é obrigatório'));

      const response = await request(app)
        .post('/events')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'title é obrigatório');
    });
  });

  // ───────────────────────────────────────────
  describe('DELETE /events/:id', () => {
    // T26 - Sucesso: deleta evento e retorna 200
    it('T26 - deve retornar 200 ao deletar evento com sucesso', async () => {
      EventService.deleteEvent.mockResolvedValue(true);

      const response = await request(app).delete('/events/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Evento deletado com sucesso');
    });

    // T27 - Erro: retorna 400 se evento não existir
    it('T27 - deve retornar 400 se o evento não for encontrado ao deletar', async () => {
      EventService.deleteEvent.mockRejectedValue(new Error('Evento não encontrado'));

      const response = await request(app).delete('/events/99');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Evento não encontrado');
    });
  });

  // ───────────────────────────────────────────
  describe('PUT /events/:id', () => {
    // T28 - Sucesso: atualiza evento e retorna 200
    it('T28 - deve retornar 200 e o evento atualizado', async () => {
      EventService.updateEvent.mockResolvedValue({ id: 1, title: 'Novo Título' });

      const response = await request(app)
        .put('/events/1')
        .send({ title: 'Novo Título' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Novo Título');
    });

    // T29 - Erro: retorna 400 se evento não existir
    it('T29 - deve retornar 400 se o evento não for encontrado ao atualizar', async () => {
      EventService.updateEvent.mockRejectedValue(new Error('Evento não encontrado'));

      const response = await request(app)
        .put('/events/99')
        .send({ title: 'X' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Evento não encontrado');
    });
  });

  // ───────────────────────────────────────────
  describe('POST /events/favorite', () => {
    // T30 - Sucesso: favorita evento e retorna 200 com favorited: true
    it('T30 - deve retornar 200 e { favorited: true } ao favoritar', async () => {
      EventService.toggleFavorite.mockResolvedValue({ favorited: true });

      const response = await request(app)
        .post('/events/favorite')
        .send({ userId: 1, eventId: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('favorited', true);
      expect(EventService.toggleFavorite).toHaveBeenCalledWith(1, 10);
    });

    // T31 - Sucesso: desfavorita evento e retorna 200 com favorited: false
    it('T31 - deve retornar 200 e { favorited: false } ao desfavoritar', async () => {
      EventService.toggleFavorite.mockResolvedValue({ favorited: false });

      const response = await request(app)
        .post('/events/favorite')
        .send({ userId: 1, eventId: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('favorited', false);
    });

    // T32 - Erro: retorna 400 se o service falhar
    it('T32 - deve retornar 400 se o service falhar ao favoritar', async () => {
      EventService.toggleFavorite.mockRejectedValue(new Error('Evento não encontrado'));

      const response = await request(app)
        .post('/events/favorite')
        .send({ userId: 1, eventId: 99 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Evento não encontrado');
    });
  });
});
