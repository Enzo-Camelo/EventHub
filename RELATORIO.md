# EventHub: Serviço de Eventos

## 1. Funcionalidade Testada

**Módulo:** `Event` (Service, Controller e Routes) - CRUD de Eventos e Toggle de Favoritos
**Arquivos de testes:**
- `src/modules/event/__tests__/event.service.test.js`
- `src/modules/event/__tests__/event.controller.test.js`
- `src/modules/event/__tests__/event.routes.test.js`

## 2. Regras de Negócio Implementadas

- Não é possível criar um evento sem o campo obrigatório `title`.
- Não é possível atualizar, deletar ou favoritar um evento inexistente no banco de dados.
- O endpoint de favoritos (`toggleFavorite`) possui comportamento dinâmico: se não estiver favoritado, ele cria a relação (retornando `favorited: true`); se já estiver favoritado, ele deleta a relação (retornando `favorited: false`).
- IDs e parâmetros essenciais (`id`, `userId`, `eventId`) são estritamente validados.

## 3. Metodologia TDD Aplicada

O desenvolvimento seguiu estritamente o ciclo **Red → Green → Refactor**:

1. **Red:** O teste foi escrito ANTES do código. A execução inicial falha, indicando a ausência da lógica, validação ou do próprio arquivo/método.
2. **Green:** O código mínimo e a lógica de Controller/Service foram criados para os testes passarem.
3. **Refactor:** Ajustes finais e melhorias sem quebrar o comportamento dos testes, que agora servem como documentação viva. Além de testes unitários do Service, estendemos a arquitetura testando unitariamente o Controller e fazendo testes de Integração ponta a ponta na camada de Rotas.

## 4. Ferramentas de Teste Utilizadas

- **Vitest** (globals: true, environment: 'node') - Engine principal e executor da suíte.
- **Supertest** (`request(app)`) - Para forjar requisições HTTP e testar as rotas de ponta a ponta com o Controller integrado.
- **vi.mock()** - Utilizado para mockar tanto os Models do Sequelize (para isolar o Service) quanto o próprio Service (para testar o Controller e as Rotas isoladamente).
- **vi.fn()** - Criação de mocks de métodos (como `update`, `destroy`, métodos res do express como `status` e `json`).
- **beforeEach + vi.clearAllMocks()** - Limpeza de contexto para garantir independência de estado em cada um dos testes.

## 5. Detalhamento dos Testes (Destaques)

### Teste 1 - Toggle Favorite: Favoritar Evento (T10 / T21 / T30)

**Cenário:** O usuário envia uma requisição para a rota `POST /events/favorite` em um evento que ainda não favoritou.
**Mock (Service):** `Event.findByPk` → válido | `Favorite.findOne` → null | `Favorite.create` → mock resolvido.
**Mock (Rotas):** `EventService.toggleFavorite` → resolve com `{ favorited: true }`.
**Asserções principais:**
- Service: `expect(Favorite.create).toHaveBeenCalledWith(...)` e retorno `{ favorited: true }`
- HTTP / Supertest: `expect(response.status).toBe(200)` e `expect(response.body).toHaveProperty('favorited', true)`

---

### Teste 2 - Toggle Favorite: Desfavoritar Evento (T11 / T22 / T31)

**Cenário:** O usuário envia a mesma requisição para a rota `POST /events/favorite`, porém o evento já está na sua lista de favoritos.
**Mock (Service):** `Favorite.findOne` → retorna o favorito já existente com a função `destroy` injetada.
**Asserções principais:**
- Service: `expect(destroyMock).toHaveBeenCalledTimes(1)` e retorno `{ favorited: false }`
- HTTP / Supertest: `expect(response.status).toBe(200)` e `expect(response.body).toHaveProperty('favorited', false)`

---

### Teste 3 - Validação e Retorno de Erro (T25)

**Cenário:** Requisição HTTP `POST /events` sem enviar o campo `title`.
**Mock (Rotas):** `EventService.createEvent` → lança a exceção simulando o banco ou validação: `new Error('title é obrigatório')`.
**Asserções (Supertest):**
- `expect(response.status).toBe(400)`
- `expect(response.body).toHaveProperty('error', 'title é obrigatório')`

## 6. Cobertura de Código (Coverage)

| Arquivo             | Statements | Branches | Functions | Lines    |
| ------------------- | ---------- | -------- | --------- | -------- |
| event.service.js    | **100%**   | **100%** | **100%**  | **100%** |
| event.controller.js | **100%**   | **100%** | **100%**  | **100%** |
| event.routes.js     | **100%**   | **100%** | **100%**  | **100%** |

**Comando utilizado:** `npm run test:coverage` (que executa 62 testes com sucesso e demonstra 100% de cobertura nos arquivos testados).
