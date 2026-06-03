import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FavoriteController } from '../favorite.controller.js';
import { FavoriteService } from '../favorite.service.js';

// Faz o mock do FavoriteService inteiro
vi.mock('../favorite.service.js', () => ({
  FavoriteService: {
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    getUserFavorites: vi.fn(),
    isFavorited: vi.fn(),
  }
}));

describe('FavoriteController', () => {
  let req;
  let res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { body: {}, params: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  describe('addFavorite()', () => {
    // T16 - Testa o fluxo de sucesso ao adicionar um favorito (retorno HTTP 201)
    it('T16 - deve retornar 201 e o favorito em caso de sucesso', async () => {
      req.body = { userId: 1, eventId: 10 };
      const mockFav = { id: 1, user_id: 1, event_id: 10 };
      FavoriteService.addFavorite.mockResolvedValue(mockFav);

      await FavoriteController.addFavorite(req, res);

      expect(FavoriteService.addFavorite).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockFav);
    });

    // T17 - Testa se o Controller repassa o erro do Service com status HTTP 400
    it('T17 - deve retornar 400 se o serviço lançar um erro', async () => {
      req.body = { userId: 1, eventId: 10 };
      FavoriteService.addFavorite.mockRejectedValue(new Error('Evento já favoritado'));

      await FavoriteController.addFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Evento já favoritado' });
    });
  });

  describe('removeFavorite()', () => {
    // T18 - Testa a remoção bem-sucedida de um favorito (retorno HTTP 200)
    it('T18 - deve retornar 200 e mensagem de sucesso', async () => {
      req.body = { userId: 1, eventId: 10 };
      FavoriteService.removeFavorite.mockResolvedValue(true);

      await FavoriteController.removeFavorite(req, res);

      expect(FavoriteService.removeFavorite).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Favorito removido com sucesso' });
    });

    // T19 - Testa a propagação de erro ao tentar remover um favorito inexistente
    it('T19 - deve retornar 400 se o serviço lançar erro ao remover', async () => {
      req.body = { userId: 1, eventId: 10 };
      FavoriteService.removeFavorite.mockRejectedValue(new Error('Favorito não encontrado'));

      await FavoriteController.removeFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Favorito não encontrado' });
    });
  });

  describe('getUserFavorites()', () => {
    // T20 - Testa a listagem de favoritos de um usuário com sucesso
    it('T20 - deve retornar 200 e a lista de favoritos', async () => {
      req.params = { userId: 1 };
      const mockList = [{ id: 1 }];
      FavoriteService.getUserFavorites.mockResolvedValue(mockList);

      await FavoriteController.getUserFavorites(req, res);

      expect(FavoriteService.getUserFavorites).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockList);
    });

    // T21 - Testa o tratamento de erro na listagem de favoritos
    it('T21 - deve retornar 400 se der erro', async () => {
      req.params = { userId: 1 };
      FavoriteService.getUserFavorites.mockRejectedValue(new Error('Erro interno'));

      await FavoriteController.getUserFavorites(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno' });
    });
  });

  describe('isFavorited()', () => {
    // T22 - Testa a verificação de status (se o evento está ou não favoritado)
    it('T22 - deve retornar 200 e o status booleano do favorito', async () => {
      req.params = { userId: 1, eventId: 10 };
      FavoriteService.isFavorited.mockResolvedValue(true);

      await FavoriteController.isFavorited(req, res);

      expect(FavoriteService.isFavorited).toHaveBeenCalledWith(1, 10);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ isFavorited: true });
    });

    // T23 - Testa a falha na verificação de status do favorito
    it('T23 - deve retornar 400 em caso de erro', async () => {
      req.params = { userId: 1, eventId: 10 };
      FavoriteService.isFavorited.mockRejectedValue(new Error('Erro interno'));

      await FavoriteController.isFavorited(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno' });
    });
  });
});
