# Mapa de capacidades

| Capacidade | Responsabilidade | Depende de | Ordem | Estado |
|---|---|---|---|---|
| Telas do frontend | Lista, cadastro, edição, detalhes e clima | — | 1 | feito |
| Banco de dados | PostgreSQL e tabela `users` via migrations | Docker | 2 | pendente |
| API de usuários | CRUD com validação e erros consistentes | Banco | 3 | pendente |
| Listagem | Filtro parcial, paginação, ordenação e metadados | API de usuários | 4 | pendente |
| Importação do CSV | Carregar `users.csv.gz` tratando inválidos e duplicados | Banco | 5 | pendente |
| Clima | Consultar a WeatherAPI, converter o contrato e fazer cache | Chave da API | 6 | pendente |
| Documentação da API | Contrato em OpenAPI com Swagger UI | API de usuários e clima | 7 | pendente |
| Integração | Frontend consumindo a API real | API de usuários e clima | 8 | pendente |
| Testes | Regras principais da API e um fluxo do frontend | Cada capacidade testada | contínuo | pendente |