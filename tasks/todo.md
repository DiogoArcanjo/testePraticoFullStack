# Tarefas

| ID | Tarefa | Critério de aceite | Verificação | Estado |
|---|---|---|---|---|
| FE-01 | Criar projeto Vite | `npm run dev` abre a página | Navegador | feito |
| FE-02 | Configurar rotas | Cada URL abre a tela certa | Navegador | feito |
| FE-03 | Lista de usuários (mock) | Mostra nome e email | Navegador | feito |
| FE-04a | Busca por nome/email com filtro na URL | Digitar filtra a lista; recarregar mantém a busca | Navegador | feito |
| FE-04b | Debounce na busca | O filtro só é aplicado depois que a pessoa para de digitar | Navegador | feito |
| FE-04c | Ordenação por nome | Alterna A-Z / Z-A e a ordem fica na URL | Navegador | feito |
| FE-04d | Paginação | Mostra página atual e total; a página fica na URL | Navegador | feito |
| FE-05a | Serviço em memória + formulário de cadastro | Cadastro válido aparece na lista; campo vazio, email inválido ou duplicado mostra erro | Navegador | feito |
| FE-05b | Edição de usuário | Edição salva as mudanças; email de outro usuário é rejeitado | Navegador | feito |
| FE-06 | Tela de detalhes | Mostra dados e botões editar/excluir | Navegador | feito |
| FE-07 | Tela de clima (mock) | Mostra temperatura, umidade e gráfico | Navegador | feito |
| FE-08 | Visual responsivo e acessível, com tema claro/escuro | Telas legíveis no celular e no computador; foco visível no teclado; botão alterna o tema e a escolha é mantida ao recarregar | Navegador (desktop, modo celular, F5) | feito |

| BE-01 | PostgreSQL com docker compose | `docker compose up -d` sobe o banco | `docker compose ps` | feito |
| BE-02 | Projeto do backend + env validado | API responde em `/health`; sem variável obrigatória, o servidor não sobe e explica o motivo | curl | feito |
| BE-03 | Migration da tabela `users` | Tabela com id UUID, name, email único, created_at e updated_at | `npm run migrate up` + consulta no banco | feito |
| BE-04 | Endpoints de usuários | Códigos 201, 200, 204, 400, 404 e 409 com erro em formato consistente | curl | pendente |
| BE-05 | Listagem com filtro, paginação e ordenação | Filtro parcial, `page`, `pageSize`, `order` e `meta` | curl | pendente |
| BE-06 | Testes de integração dos usuários | Criação, email duplicado, filtros e paginação passam | `npm test` | pendente |
| BE-07 | Importação do CSV | Reproduzível; relata importados, inválidos e duplicados; rodar duas vezes não duplica | `npm run import` | pendente |
| BE-08 | Clima com cache e tratamento de falhas | Contrato próprio; cache com expiração; 404, 429, 503 e 504 | `npm test` | pendente |
| BE-09 | Documentação OpenAPI | `/docs` mostra todos os endpoints | Navegador | pendente |
| FE-09 | Frontend consumindo a API | Telas usam a API real, com estados de carregamento e erro | Navegador | pendente |
| FE-10 | Teste de um fluxo do frontend | Teste da busca ou do formulário passa | `npm test` | pendente |
| DOC-01 | README e AI_USAGE atualizados | Seguir o README do zero roda o projeto completo | Execução do zero | pendente |