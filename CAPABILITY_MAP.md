# Mapa de capacidades

| Capacidade | Responsabilidade | Depende de | Ordem | Estado |
|---|---|---|---|---|
| Telas do frontend | Lista, cadastro, edição, detalhes e clima | — | 1 | feito |
| Banco de dados | PostgreSQL e tabela `users` via migrations | Docker | 2 | feito |
| API de usuários | CRUD com validação e erros consistentes | Banco | 3 | feito |
| Listagem | Filtro parcial, paginação, ordenação e metadados | API de usuários | 4 | feito |
| Integração | Frontend consumindo a API real | API de usuários | 5 | feito |
| Clima | Consultar a WeatherAPI, converter o contrato e fazer cache | Chave da API | 6 | feito |
| Documentação da API | Contrato em OpenAPI com Swagger UI | API de usuários e clima | 7 | feito |
| Importação do CSV | Carregar o CSV tratando inválidos e duplicados | Banco | 8 | feito (validada com arquivo de exemplo) |
| Testes | Regras principais da API, falhas do clima e um fluxo do frontend | Cada capacidade testada | contínuo | feito |