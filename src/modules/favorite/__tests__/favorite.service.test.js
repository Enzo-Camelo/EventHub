import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dos models ANTES de importar o service
vi.mock('../favorite.model.js');
vi.mock('../../user/user.model.js');
vi.mock('../../event/event.model.js');

import Favorite from '../favorite.model.js';
import User from '../../user/user.model.js';
import Event from '../../event/event.model.js';
import { addFavorite, removeFavorite, getUserFavorites, isFavorited } from '../favorite.service.js';

// ─────────────────────────────────────────────
// Dados reutilizáveis
// ─────────────────────────────────────────────
const userId = 1;
const eventId = 42;

const fakeFavorite = {
  id: 10,
  user_id: userId,
  event_id: eventId,
  destroy: vi.fn().mockResolvedValue(undefined),
};

const fakeUser = { id: userId, name: 'Enzo' };
const fakeEvent = { id: eventId, title: 'Rock in Rio' };

// ─────────────────────────────────────────────
// Reset dos mocks a cada teste
// ─────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();
});

// ═════════════════════════════════════════════
// addFavorite()
// ═════════════════════════════════════════════
describe('addFavorite()', () => {

  // T1 — Sucesso
  it('T1 — deve favoritar um evento com sucesso', async () => {
    User.findByPk = vi.fn().mockResolvedValue(fakeUser);
    Event.findByPk = vi.fn().mockResolvedValue(fakeEvent);
    Favorite.findOne = vi.fn().mockResolvedValue(null);
    Favorite.create = vi.fn().mockResolvedValue(fakeFavorite);

    const result = await addFavorite(userId, eventId);

    expect(Favorite.create).toHaveBeenCalledWith({ user_id: userId, event_id: eventId });
    expect(result).toEqual(fakeFavorite);
  });

  // T2 — Regra de negócio: já favoritado
  it('T2 — deve lançar erro se o evento já está favoritado', async () => {
    User.findByPk = vi.fn().mockResolvedValue(fakeUser);
    Event.findByPk = vi.fn().mockResolvedValue(fakeEvent);
    Favorite.findOne = vi.fn().mockResolvedValue(fakeFavorite);

    await expect(addFavorite(userId, eventId)).rejects.toThrow('Evento já favoritado');
  });

  // T3 — Validação: userId ausente
  it('T3 — deve lançar erro se userId não for fornecido', async () => {
    await expect(addFavorite(null, eventId)).rejects.toThrow('userId é obrigatório');

    expect(User.findByPk).not.toHaveBeenCalled();
    expect(Event.findByPk).not.toHaveBeenCalled();
    expect(Favorite.findOne).not.toHaveBeenCalled();
  });

  // T4 — Validação: eventId ausente
  it('T4 — deve lançar erro se eventId não for fornecido', async () => {
    await expect(addFavorite(userId, null)).rejects.toThrow('eventId é obrigatório');

    expect(Favorite.findOne).not.toHaveBeenCalled();
  });

  // T5 — Evento não encontrado no banco
  it('T5 — deve lançar erro se evento não existir no banco', async () => {
    User.findByPk = vi.fn().mockResolvedValue(fakeUser);
    const findByPkSpy = vi.spyOn(Event, 'findByPk').mockResolvedValue(null);

    await expect(addFavorite(userId, eventId)).rejects.toThrow('Evento não encontrado');
    expect(findByPkSpy).toHaveBeenCalledWith(eventId);
  });

  // T6 — Usuário não encontrado
  it('T6 — deve lançar erro se usuário não existir', async () => {
    const findByPkSpy = vi.spyOn(User, 'findByPk').mockResolvedValue(null);

    await expect(addFavorite(userId, eventId)).rejects.toThrow('Usuário não encontrado');
    expect(findByPkSpy).toHaveBeenCalledWith(userId);
  });

  // T7 — Erro propagado do banco
  it('T7 — deve propagar erro do banco de dados em Favorite.create', async () => {
    User.findByPk = vi.fn().mockResolvedValue(fakeUser);
    Event.findByPk = vi.fn().mockResolvedValue(fakeEvent);
    Favorite.findOne = vi.fn().mockResolvedValue(null);
    Favorite.create = vi.fn().mockRejectedValue(new Error('DB connection failed'));

    await expect(addFavorite(userId, eventId)).rejects.toThrow('DB connection failed');
  });
});

// ═════════════════════════════════════════════
// removeFavorite()
// ═════════════════════════════════════════════
describe('removeFavorite()', () => {

  // T8 — Sucesso
  it('T8 — deve remover favorito com sucesso', async () => {
    Favorite.findOne = vi.fn().mockResolvedValue(fakeFavorite);

    await removeFavorite(userId, eventId);

    expect(fakeFavorite.destroy).toHaveBeenCalledTimes(1);
  });

  // T9 — Favorito inexistente
  it('T9 — deve lançar erro ao tentar remover favorito inexistente', async () => {
    Favorite.findOne = vi.fn().mockResolvedValue(null);

    await expect(removeFavorite(userId, eventId)).rejects.toThrow('Favorito não encontrado');
  });

  // T10 — Validação: userId ausente
  it('T10 — deve lançar erro se userId não for fornecido em removeFavorite', async () => {
    await expect(removeFavorite(null, eventId)).rejects.toThrow('userId é obrigatório');

    expect(Favorite.findOne).not.toHaveBeenCalled();
  });
});

// ═════════════════════════════════════════════
// getUserFavorites()
// ═════════════════════════════════════════════
describe('getUserFavorites()', () => {

  // T11 — Retorna lista com favoritos
  it('T11 — deve retornar lista de favoritos do usuário', async () => {
    const fakeList = [
      { id: 1, user_id: userId, event_id: 10, event: { title: 'Show A' } },
      { id: 2, user_id: userId, event_id: 20, event: { title: 'Show B' } },
    ];
    Favorite.findAll = vi.fn().mockResolvedValue(fakeList);

    const result = await getUserFavorites(userId);

    expect(result).toHaveLength(2);
    expect(result[0].event.title).toBe('Show A');
  });

  // T12 — Retorna lista vazia
  it('T12 — deve retornar lista vazia se usuário não tiver favoritos', async () => {
    Favorite.findAll = vi.fn().mockResolvedValue([]);

    const result = await getUserFavorites(userId);

    expect(result).toEqual([]);
  });

  // T13 — Verifica que findAll é chamado com os parâmetros corretos
  it('T13 — deve chamar Favorite.findAll com userId e include de Event', async () => {
    const findAllSpy = vi.spyOn(Favorite, 'findAll').mockResolvedValue([]);

    await getUserFavorites(userId);

    expect(findAllSpy).toHaveBeenCalledWith({
      where: { user_id: userId },
      include: [{ model: Event, as: 'event' }],
    });
  });
});

// ═════════════════════════════════════════════
// isFavorited()
// ═════════════════════════════════════════════
describe('isFavorited()', () => {

  // T14 — Retorna true quando favoritado
  it('T14 — deve retornar true se o evento está favoritado', async () => {
    Favorite.findOne = vi.fn().mockResolvedValue(fakeFavorite);

    const result = await isFavorited(userId, eventId);

    expect(result).toBe(true);
  });

  // T15 — Retorna false quando não favoritado
  it('T15 — deve retornar false se o evento não está favoritado', async () => {
    Favorite.findOne = vi.fn().mockResolvedValue(null);

    const result = await isFavorited(userId, eventId);

    expect(result).toBe(false);
  });
});
