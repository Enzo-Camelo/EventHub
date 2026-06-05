import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventService } from '../event.service.js';

// ─────────────────────────────────────────────
// 🔴 RED: mocks declarados antes de qualquer import dos models
// ─────────────────────────────────────────────
vi.mock('../event.model.js', () => ({
  Event: {
    findByPk: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('../../favorite/favorite.model.js', () => ({
  Favorite: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

// Importados APÓS os mocks - recebem os objetos mockados
import { Event } from '../event.model.js';
import { Favorite } from '../../favorite/favorite.model.js';

// ─────────────────────────────────────────────
// Dados reutilizáveis
// ─────────────────────────────────────────────
const eventId = 1;
const userId = 10;

beforeEach(() => {
  vi.clearAllMocks();
});

// ═════════════════════════════════════════════
describe('EventService', () => {

  // ───────────────────────────────────────────
  describe('createEvent()', () => {
    // T1 - Sucesso
    it('T1 - deve criar um evento com sucesso', async () => {
      const data = { title: 'Rock in Rio', description: 'Festival de música', date: '2025-09-01', location: 'Rio de Janeiro' };
      Event.create.mockResolvedValue({ id: 1, ...data });

      const result = await EventService.createEvent(data);

      expect(result).toBeDefined();
      expect(result.title).toBe('Rock in Rio');
      expect(Event.create).toHaveBeenCalledWith(data);
    });

    // T2 - Validação: title ausente
    it('T2 - deve lançar erro se title não for fornecido', async () => {
      await expect(EventService.createEvent({})).rejects.toThrow('title é obrigatório');
      expect(Event.create).not.toHaveBeenCalled();
    });

    // T3 - Propagação de erro do banco
    it('T3 - deve propagar erro do banco de dados em Event.create', async () => {
      Event.create.mockRejectedValue(new Error('DB connection failed'));

      await expect(EventService.createEvent({ title: 'Teste' })).rejects.toThrow('DB connection failed');
    });
  });

  // ───────────────────────────────────────────
  describe('deleteEvent()', () => {
    // T4 - Sucesso
    it('T4 - deve deletar um evento com sucesso', async () => {
      const destroyMock = vi.fn().mockResolvedValue(undefined);
      Event.findByPk.mockResolvedValue({ id: eventId, destroy: destroyMock });

      const result = await EventService.deleteEvent(eventId);

      expect(destroyMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    // T5 - Evento inexistente
    it('T5 - deve lançar erro ao tentar deletar evento inexistente', async () => {
      Event.findByPk.mockResolvedValue(null);

      await expect(EventService.deleteEvent(eventId)).rejects.toThrow('Evento não encontrado');
    });

    // T6 - Validação: id ausente
    it('T6 - deve lançar erro se id não for fornecido', async () => {
      await expect(EventService.deleteEvent(null)).rejects.toThrow('id é obrigatório');
      expect(Event.findByPk).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────
  describe('updateEvent()', () => {
    // T7 - Sucesso
    it('T7 - deve atualizar um evento com sucesso', async () => {
      const updateMock = vi.fn().mockResolvedValue({ id: eventId, title: 'Novo Título' });
      Event.findByPk.mockResolvedValue({ id: eventId, update: updateMock });

      const result = await EventService.updateEvent(eventId, { title: 'Novo Título' });

      expect(updateMock).toHaveBeenCalledWith({ title: 'Novo Título' });
      expect(result.title).toBe('Novo Título');
    });

    // T8 - Evento inexistente
    it('T8 - deve lançar erro ao tentar atualizar evento inexistente', async () => {
      Event.findByPk.mockResolvedValue(null);

      await expect(EventService.updateEvent(eventId, { title: 'X' })).rejects.toThrow('Evento não encontrado');
    });

    // T9 - Validação: id ausente
    it('T9 - deve lançar erro se id não for fornecido em updateEvent', async () => {
      await expect(EventService.updateEvent(null, { title: 'X' })).rejects.toThrow('id é obrigatório');
      expect(Event.findByPk).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────
  describe('toggleFavorite()', () => {
    // T10 - Favoritar (não existia antes)
    it('T10 - deve favoritar um evento quando não estava favoritado', async () => {
      Event.findByPk.mockResolvedValue({ id: eventId });
      Favorite.findOne.mockResolvedValue(null);
      Favorite.create.mockResolvedValue({ id: 1, user_id: userId, event_id: eventId });

      const result = await EventService.toggleFavorite(userId, eventId);

      expect(Favorite.create).toHaveBeenCalledWith({ user_id: userId, event_id: eventId });
      expect(result).toEqual({ favorited: true });
    });

    // T11 - Desfavoritar (já existia)
    it('T11 - deve desfavoritar um evento quando já estava favoritado', async () => {
      const destroyMock = vi.fn().mockResolvedValue(undefined);
      Event.findByPk.mockResolvedValue({ id: eventId });
      Favorite.findOne.mockResolvedValue({ id: 99, user_id: userId, event_id: eventId, destroy: destroyMock });

      const result = await EventService.toggleFavorite(userId, eventId);

      expect(destroyMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ favorited: false });
    });

    // T12 - Validação: userId ausente
    it('T12 - deve lançar erro se userId não for fornecido', async () => {
      await expect(EventService.toggleFavorite(null, eventId)).rejects.toThrow('userId é obrigatório');
      expect(Event.findByPk).not.toHaveBeenCalled();
    });

    // T13 - Validação: eventId ausente
    it('T13 - deve lançar erro se eventId não for fornecido', async () => {
      await expect(EventService.toggleFavorite(userId, null)).rejects.toThrow('eventId é obrigatório');
      expect(Event.findByPk).not.toHaveBeenCalled();
    });

    // T14 - Evento não encontrado
    it('T14 - deve lançar erro se evento não existir no banco', async () => {
      Event.findByPk.mockResolvedValue(null);

      await expect(EventService.toggleFavorite(userId, eventId)).rejects.toThrow('Evento não encontrado');
    });
  });
});
