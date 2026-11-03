# SPEC

## Objetivo
Aplicação para consulta e gerenciamento de usuários, com consulta de clima por cidade.

## Escopo desta entrega
- Prioridade: frontend em React + TypeScript, com dados simulados (mock).
- Backend (Node + TypeScript + PostgreSQL) e integração de clima ficam como próximos passos.

## Stack
- Frontend: React + TypeScript, criado com Vite
- Rotas: React Router

## Telas
- /users: lista com busca por nome/email, ordenação e paginação
- /users/new: cadastro com validação
- /users/:id: detalhes, com opções de editar e excluir
- /users/:id/edit: edição
- /weather: busca de clima por cidade

## Critérios de sucesso
- [ ] A lista filtra por nome ou email
- [ ] Os filtros ficam na URL (recarregar a página mantém a busca)
- [ ] A busca não dispara a cada tecla (debounce)
- [ ] O formulário mostra mensagens claras de erro
- [ ] Estados de carregamento, lista vazia e erro aparecem na tela
- [ ] A interface funciona no celular e pelo teclado

## Comandos
- `npm install`: instala dependências
- `npm run dev`: roda o frontend

## Questões em aberto
- Backend ainda não implementado; o frontend usa dados simulados.