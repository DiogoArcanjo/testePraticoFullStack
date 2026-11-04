# Plano

## Fase 1: frontend com dados simulados (concluída)
1. Criar projeto React + TypeScript com Vite
2. Configurar rotas
3. Tela de lista com dados mock
4. Busca, ordenação e paginação com filtros na URL
5. Formulário de cadastro/edição
6. Tela de detalhes
7. Tela de clima com dados mock
8. Visual responsivo, acessível e com temas

## Fase 2: backend, banco e integração
1. PostgreSQL com docker compose
2. Projeto do backend com variáveis de ambiente validadas
3. Migration da tabela `users`
4. Endpoints de usuários
5. Listagem com filtro, paginação e ordenação
6. Testes de integração dos usuários
7. Importação do CSV
8. Endpoint de clima com cache e testes de falha
9. Documentação OpenAPI
10. Frontend consumindo a API
11. Teste de um fluxo do frontend
12. Atualização do README e do AI_USAGE

## Riscos
- Pouca experiência com backend, Docker e SQL: tarefas pequenas, cada uma verificada antes da próxima.
- Formato do CSV desconhecido: inspecionar o arquivo antes de escrever a importação.
- Limites da WeatherAPI: cache reduz as chamadas; testes usam a API simulada.
- Prazo curto: as tarefas estão em ordem de prioridade. Se o tempo acabar,
  o que estiver pronto deve funcionar, e o restante fica documentado como pendente.

## Checkpoints
- Banco: `docker compose ps` mostra o PostgreSQL rodando
- API: chamadas de teste no terminal (curl) e `npm test` passando
- Integração: telas funcionando no navegador com os dados do banco