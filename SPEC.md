# SPEC

## Objetivo
Aplicação fullstack para consulta e gerenciamento de usuários, com consulta de clima por cidade.

## Escopo
- Primeira fase (concluída): frontend em React + TypeScript com dados simulados.
- Segunda fase: backend em Node.js + TypeScript, banco PostgreSQL, importação do CSV,
  integração real de clima e testes automatizados. O frontend passa a consumir a API.

## Premissas
- Sem autenticação, conforme o enunciado.
- A API é a fonte da verdade. O frontend acessa os dados só pela camada de serviço.
- O email é único sem diferenciar maiúsculas e minúsculas, e é salvo em minúsculas.
- A chave da API de clima fica só no backend, em variável de ambiente.

## Stack
- Frontend: React + TypeScript (Vite), React Router, Recharts
- Backend: Node.js + TypeScript, Express, pg, Zod (validação), tsx (executar TypeScript)
- Banco: PostgreSQL via docker compose, migrations com node-pg-migrate
- Clima: WeatherAPI (weatherapi.com)
- Documentação da API: OpenAPI com Swagger UI
- Testes: Vitest, Supertest (API) e Testing Library (frontend)

## Contrato da API (resumo)
- `POST /users`: 201 criado; 400 dados inválidos; 409 email duplicado
- `GET /users?q=&page=&pageSize=&order=`: 200 com `data` e `meta` (page, pageSize, total, totalPages)
- `GET /users/:id`: 200; 400 id não é UUID; 404 não encontrado
- `PATCH /users/:id`: 200; 400; 404; 409
- `DELETE /users/:id`: 204; 400; 404
- `GET /weather/:city`: 200; 404 cidade inexistente; 429 limite; 503 indisponível; 504 timeout
- Erros sempre no formato `{ "error": { "code": "...", "message": "..." } }`, sem detalhes internos

## Critérios de sucesso

### Frontend
- [x] A lista filtra por nome ou email (busca parcial)
- [x] A lista pode ser ordenada por nome
- [x] A lista é paginada e mostra a página atual e o total de páginas
- [x] Os filtros ficam na URL (recarregar a página mantém a busca)
- [x] A busca não dispara a cada tecla digitada (debounce)
- [x] O formulário valida nome obrigatório e email válido, com mensagens claras
- [x] O formulário impede cadastrar um email que já existe
- [x] A tela de detalhes permite editar e excluir o usuário
- [x] A tela de clima mostra temperatura, umidade, condição atual e gráfico do dia
- [x] Estados de carregamento, lista vazia e erro aparecem na tela
- [x] A interface funciona no celular e pode ser usada só pelo teclado
- [x] A pessoa pode alternar entre tema claro e escuro, e a escolha é lembrada
- [ ] O frontend consome a API real

### Backend e dados
- [ ] `docker compose up` sobe o PostgreSQL
- [ ] Migrations criam a tabela `users` com id UUID, name, email único, created_at e updated_at
- [ ] A importação do CSV é reproduzível e relata registros inválidos e emails duplicados
- [ ] Variáveis de ambiente são validadas ao iniciar o servidor
- [ ] Os endpoints usam códigos HTTP coerentes e erros em formato consistente
- [ ] A listagem tem filtro parcial, paginação, ordenação e metadados
- [ ] O clima é convertido para um contrato próprio, com cache com expiração
- [ ] O clima trata timeout, cidade inexistente, limite de requisições e indisponibilidade
- [ ] O contrato da API está documentado em OpenAPI

### Testes
- [ ] Criação de usuário e rejeição de email duplicado
- [ ] Filtros e paginação da listagem
- [ ] Tratamento de falha da API de clima
- [ ] Um fluxo do frontend

## Comandos
Na raiz:
- `docker compose up -d`: sobe o PostgreSQL

Em `backend`:
- `npm install`: instala as dependências
- `npm run migrate up`: aplica as migrations
- `npm run import`: importa o `users.csv.gz`
- `npm run dev`: roda a API
- `npm test`: roda os testes

Em `frontend`:
- `npm install`, `npm run dev` e `npm test`

## Estrutura do projeto
- `docker-compose.yml`: PostgreSQL
- `backend/src/`: código da API (rotas, serviços, validação, erros)
- `backend/migrations/`: migrations do banco
- `backend/scripts/`: script de importação do CSV
- `backend/tests/`: testes da API
- `frontend/src/`: aplicação React (pages, components, services, mocks, types)
- `tasks/`: plano (`plan.md`) e tarefas (`todo.md`)

## Convenções
- Componentes React em PascalCase; variáveis e funções em camelCase
- Colunas do banco em snake_case (ex.: `created_at`); JSON da API em camelCase (ex.: `createdAt`)
- Commits no formato `tipo: descrição (ID da tarefa)`, com tipos `docs`, `feat`, `fix` e `test`
- Cada tarefa do `tasks/todo.md` é validada antes de começar a próxima

## Estratégia de testes
- API: testes de integração com Supertest contra um banco de teste no mesmo PostgreSQL
- Clima: testes com a API externa simulada, cobrindo sucesso, cidade inexistente e falhas
- Frontend: Testing Library cobrindo a busca da lista ou a validação do formulário
- Verificação manual no navegador e no terminal ao final de cada tarefa

## Limites
- Sem autenticação
- Sem deploy: a aplicação roda localmente
- Cache do clima em memória: é perdido ao reiniciar o servidor

## Questões em aberto
- - O arquivo `users.csv.gz` não veio com o material do teste. Premissa adotada: CSV com
  cabeçalho e, no mínimo, as colunas `name` e `email`; outras colunas são ignoradas.
  A importação é validada com um arquivo de exemplo fictício (`backend/data/users.sample.csv.gz`),
  com linhas inválidas e emails duplicados, até o arquivo real ser recebido.
- Limites do plano gratuito da WeatherAPI