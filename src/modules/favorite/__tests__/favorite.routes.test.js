import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../../app.js';
import { FavoriteService } from '../favorite.service.js';

// Mock do Service, pois aqui é um teste da Rota e Controller integrados
vi.mock('../favorite.service.js', () => ({
  FavoriteService: {
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    getUserFavorites: vi.fn(),
    isFavorited: vi.fn(),
  }
}));

describe('Rotas de Favoritos (/favorites)', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /favorites', () => {
    // T24 - Testa o fluxo ponta a ponta de sucesso via HTTP POST
    it('T24 - deve retornar 201 quando criar favorito com sucesso', async () => {
      FavoriteService.addFavorite.mockResolvedValue({ id: 1, user_id: 1, event_id: 10 });

      const response = await request(app)
        .post('/favorites')
        .send({ userId: 1, eventId: 10 });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 1);
    });

    // T25 - Testa o retorno de erro via HTTP POST
    it('T25 - deve retornar 400 se o service falhar', async () => {
      FavoriteService.addFavorite.mockRejectedValue(new Error('Evento não encontrado'));

      const response = await request(app)
        .post('/favorites')
        .send({ userId: 1, eventId: 10 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Evento não encontrado');
    });
  });

  describe('DELETE /favorites', () => {
    // T26 - Testa o fluxo ponta a ponta de sucesso via HTTP DELETE
    it('T26 - deve retornar 200 ao remover favorito com sucesso', async () => {
      FavoriteService.removeFavorite.mockResolvedValue(true);

      const response = await request(app)
        .delete('/favorites')
        .send({ userId: 1, eventId: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Favorito removido com sucesso');
    });

    // T27 - Testa o retorno de erro via HTTP DELETE
    it('T27 - deve retornar 400 se o favorito não for encontrado', async () => {
      FavoriteService.removeFavorite.mockRejectedValue(new Error('Favorito não encontrado'));

      const response = await request(app)
        .delete('/favorites')
        .send({ userId: 1, eventId: 10 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Favorito não encontrado');
    });
  });

  describe('GET /favorites/:userId', () => {
    // T28 - Testa a listagem de favoritos de um usuário via HTTP GET
    it('T28 - deve retornar 200 e a lista de favoritos', async () => {
      FavoriteService.getUserFavorites.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      const response = await request(app).get('/favorites/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(FavoriteService.getUserFavorites).toHaveBeenCalledWith('1'); // params chegam como string
    });
  });

  describe('GET /favorites/check/:userId/:eventId', () => {
    // T29 - Testa a verificação de status do favorito via HTTP GET
    it('T29 - deve retornar 200 e o status do favorito', async () => {
      FavoriteService.isFavorited.mockResolvedValue(true);

      const response = await request(app).get('/favorites/check/1/10');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isFavorited', true);
      expect(FavoriteService.isFavorited).toHaveBeenCalledWith('1', '10');
    });
  });

});
