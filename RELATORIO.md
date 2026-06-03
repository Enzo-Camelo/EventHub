# EventHub: Serviço de Favoritos

## 1. Funcionalidade Testada

**Serviço:** `FavoriteService` - Gerenciamento de Eventos Favoritos
**Arquivo de testes:** `src/modules/favorite/__tests__/favorite.service.test.js`

## 2. Regras de Negócio Implementadas

- Um usuário só pode favoritar um evento UMA vez (sem duplicatas).
- Não é possível favoritar um evento inexistente no banco.
- Não é possível remover um favorito que não existe.
- Os campos `userId` e `eventId` são obrigatórios em todas as operações.

## 3. Metodologia TDD Aplicada

O desenvolvimento seguiu estritamente o ciclo **Red → Green → Refactor**:

1. **Red:** O teste foi escrito ANTES do código. A execução inicial
   falha, indicando a ausência da lógica ou validação esperada.
2. **Green:** O código mínimo foi criado para o teste passar,
   sem adicionar lógica desnecessária ou antecipar validações.
3. **Refactor:** O código foi reorganizado para clareza (nome de variáveis, extração de código),
   sem alterar o comportamento testado, garantindo que os testes continuassem verdes.

## 4. Ferramentas de Teste Utilizadas

- **Vitest** (globals: true, environment: 'node')
- **vi.mock()** - com _factory functions_ para mockar os Models (`Favorite`, `Event`, `User`) injetados no topo do arquivo.
- **vi.fn()** - criação de mocks de funções isoladas do Sequelize, incluindo funções atreladas a instâncias (ex: `destroy()`).
- **vi.spyOn()** - espionagem indireta via validação de chamadas nos mocks configurados.
- **beforeEach + vi.clearAllMocks()** - limpeza de estado e chamadas para garantir isolamento total entre os 15 testes.

## 5. Detalhamento dos Testes (Destaques)

### Teste 1 - Favoritar evento com sucesso (T1)

**Cenário:** Usuário e evento existem. Favorito ainda não existe.
**Mock:** `Event.findByPk` → objeto válido | `Favorite.findOne` → null |
`Favorite.create` → novo registro
**Asserções:**

- `expect(result).toBeDefined()`
- `expect(result.user_id).toBe(1)`
- `expect(Favorite.create).toHaveBeenCalledTimes(1)`
  **Resultado esperado:** Objeto do favorito criado.

---

### Teste 2 - Erro ao favoritar evento duplicado (T2)

**Cenário:** Usuário tenta favoritar evento que já está na sua lista.
**Mock:** `Event.findByPk` → objeto válido | `Favorite.findOne` → retorna objeto existente (favorito já existe)
**Asserções:**

- `await expect(FavoriteService.addFavorite(1,1)).rejects.toThrow('Evento já favoritado')`
- `expect(Favorite.create).not.toHaveBeenCalled()`
  **Resultado esperado:** Exceção lançada. Banco NÃO é chamado para criação.

---

### Teste 3 - Remover favorito com sucesso (T8)

**Cenário:** Favorito existe e deve ser deletado.
**Mock:** `Favorite.findOne` → retorna objeto contendo o método `destroy` mockado via `vi.fn().mockResolvedValue(undefined)`
**Asserções:**

- `expect(result).toBe(true)`
- `expect(destroyMock).toHaveBeenCalledTimes(1)`
  **Resultado esperado:** Método destroy chamado exatamente uma vez.

## 6. Cobertura de Código (Coverage)

| Arquivo             | Statements | Branches | Functions | Lines    |
| ------------------- | ---------- | -------- | --------- | -------- |
| favorite.service.js | **100%**   | **100%** | **100%**  | **100%** |

**Comando:** `npm run test:coverage -- src/modules/favorite/__tests__/favorite.service.test.js`
