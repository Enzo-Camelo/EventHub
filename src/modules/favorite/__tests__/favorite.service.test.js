import { describe, it, expect, vi, beforeEach } from "vitest";
import { FavoriteService } from "../favorite.service.js";

// ─────────────────────────────────────────────
// 🔴 RED: mocks declarados antes de qualquer import dos models
// O Vitest eleva (hoista) o vi.mock para o topo do arquivo.
// ─────────────────────────────────────────────
vi.mock("../favorite.model.js", () => ({
  Favorite: {
    findOne: vi.fn(),
    findAll: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../../event/event.model.js", () => ({
  Event: { findByPk: vi.fn() },
}));

vi.mock("../../user/user.model.js", () => ({
  User: { findByPk: vi.fn() },
}));

// Importados APÓS os mocks - recebem os objetos mockados
import { Favorite } from "../favorite.model.js";
import { Event } from "../../event/event.model.js";

// ─────────────────────────────────────────────
// Dados reutilizáveis
// ─────────────────────────────────────────────
const userId = 1;
const eventId = 42;

beforeEach(() => {
  vi.clearAllMocks(); // Limpa mocks entre cada teste
});

// ═════════════════════════════════════════════
describe("FavoriteService", () => {
  // ───────────────────────────────────────────
  describe("addFavorite()", () => {
    // T1 - Sucesso
    it("T1 - deve favoritar um evento com sucesso", async () => {
      Event.findByPk.mockResolvedValue({ id: eventId, title: "Rock in Rio" });
      Favorite.findOne.mockResolvedValue(null);
      Favorite.create.mockResolvedValue({
        id: 1,
        user_id: userId,
        event_id: eventId,
      });

      const result = await FavoriteService.addFavorite(userId, eventId);

      expect(result).toBeDefined();
      expect(result.user_id).toBe(userId);
      expect(Favorite.create).toHaveBeenCalledTimes(1);
    });

    // T2 - Regra de negócio: já favoritado
    it("T2 - deve lançar erro se evento já favoritado", async () => {
      Event.findByPk.mockResolvedValue({ id: eventId });
      Favorite.findOne.mockResolvedValue({
        id: 99,
        user_id: userId,
        event_id: eventId,
      });

      await expect(
        FavoriteService.addFavorite(userId, eventId),
      ).rejects.toThrow("Evento já favoritado");

      expect(Favorite.create).not.toHaveBeenCalled();
    });

    // T3 - Validação: userId ausente
    it("T3 - deve lançar erro se userId não for fornecido", async () => {
      await expect(FavoriteService.addFavorite(null, eventId)).rejects.toThrow(
        "userId é obrigatório",
      );

      expect(Event.findByPk).not.toHaveBeenCalled();
      expect(Favorite.findOne).not.toHaveBeenCalled();
    });

    // T4 - Validação: eventId ausente
    it("T4 - deve lançar erro se eventId não for fornecido", async () => {
      await expect(FavoriteService.addFavorite(userId, null)).rejects.toThrow(
        "eventId é obrigatório",
      );

      expect(Favorite.findOne).not.toHaveBeenCalled();
    });

    // T5 - Evento não encontrado
    it("T5 - deve lançar erro se evento não existir no banco", async () => {
      Event.findByPk.mockResolvedValue(null);

      await expect(
        FavoriteService.addFavorite(userId, eventId),
      ).rejects.toThrow("Evento não encontrado");

      expect(Event.findByPk).toHaveBeenCalledWith(eventId);
    });

    // T6 - Verifica que Event.findByPk é chamado com o argumento correto
    it("T6 - deve chamar Event.findByPk com o eventId correto", async () => {
      Event.findByPk.mockResolvedValue({ id: eventId });
      Favorite.findOne.mockResolvedValue(null);
      Favorite.create.mockResolvedValue({
        id: 1,
        user_id: userId,
        event_id: eventId,
      });

      await FavoriteService.addFavorite(userId, eventId);

      expect(Event.findByPk).toHaveBeenCalledWith(eventId);
    });

    // T7 - Propagação de erro do banco
    it("T7 - deve propagar erro do banco de dados em Favorite.create", async () => {
      Event.findByPk.mockResolvedValue({ id: eventId });
      Favorite.findOne.mockResolvedValue(null);
      Favorite.create.mockRejectedValue(new Error("DB connection failed"));

      await expect(
        FavoriteService.addFavorite(userId, eventId),
      ).rejects.toThrow("DB connection failed");
    });
  });

  // ───────────────────────────────────────────
  describe("removeFavorite()", () => {
    // T8 - Sucesso
    it("T8 - deve remover favorito com sucesso", async () => {
      const destroyMock = vi.fn().mockResolvedValue(undefined);
      Favorite.findOne.mockResolvedValue({
        id: 10,
        user_id: userId,
        event_id: eventId,
        destroy: destroyMock,
      });

      const result = await FavoriteService.removeFavorite(userId, eventId);

      expect(destroyMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    // T9 - Favorito inexistente
    it("T9 - deve lançar erro ao tentar remover favorito inexistente", async () => {
      Favorite.findOne.mockResolvedValue(null);

      await expect(
        FavoriteService.removeFavorite(userId, eventId),
      ).rejects.toThrow("Favorito não encontrado");
    });

    // T10 - Validação: userId ausente
    it("T10 - deve lançar erro se userId não for fornecido em removeFavorite", async () => {
      await expect(
        FavoriteService.removeFavorite(null, eventId),
      ).rejects.toThrow("userId é obrigatório");

      expect(Favorite.findOne).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────
  describe("getUserFavorites()", () => {
    // T11 - Lista com favoritos
    it("T11 - deve retornar lista de favoritos do usuário", async () => {
      const fakeList = [
        { id: 1, user_id: userId, event_id: 10, event: { title: "Show A" } },
        { id: 2, user_id: userId, event_id: 20, event: { title: "Show B" } },
      ];
      Favorite.findAll.mockResolvedValue(fakeList);

      const result = await FavoriteService.getUserFavorites(userId);

      expect(result).toHaveLength(2);
      expect(result[0].event.title).toBe("Show A");
    });

    // T12 - Lista vazia
    it("T12 - deve retornar lista vazia se usuário não tiver favoritos", async () => {
      Favorite.findAll.mockResolvedValue([]);

      const result = await FavoriteService.getUserFavorites(userId);

      expect(result).toEqual([]);
    });

    // T13 - Asserção de chamada com parâmetros corretos
    it("T13 - deve chamar Favorite.findAll com userId e include de Event", async () => {
      Favorite.findAll.mockResolvedValue([]);

      await FavoriteService.getUserFavorites(userId);

      expect(Favorite.findAll).toHaveBeenCalledWith({
        where: { user_id: userId },
        include: [{ model: Event }],
      });
    });
  });

  // ───────────────────────────────────────────
  describe("isFavorited()", () => {
    // T14 - Retorna true
    it("T14 - deve retornar true se o evento está favoritado", async () => {
      Favorite.findOne.mockResolvedValue({
        id: 10,
        user_id: userId,
        event_id: eventId,
      });

      const result = await FavoriteService.isFavorited(userId, eventId);

      expect(result).toBe(true);
    });

    // T15 - Retorna false
    it("T15 - deve retornar false se o evento não está favoritado", async () => {
      Favorite.findOne.mockResolvedValue(null);

      const result = await FavoriteService.isFavorited(userId, eventId);

      expect(result).toBe(false);
    });
  });
});
