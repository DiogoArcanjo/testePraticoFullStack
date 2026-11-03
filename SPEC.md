# SPEC

## Objetivo
Aplicação para consulta e gerenciamento de usuários, com consulta de clima por cidade.

## Escopo desta entrega
- Prioridade: frontend em React + TypeScript, usando dados simulados (mock).
- Fora desta entrega (próximos passos): backend em Node.js + TypeScript,
  banco PostgreSQL, importação do CSV e integração real com API de clima.

## Premissas
- O frontend será construído de forma que os dados simulados possam ser
  trocados pela API real depois, sem reescrever as telas.
- Os dados simulados ficam em um único lugar (`src/mocks`).
- Autenticação está fora do escopo, conforme o enunciado.

## Stack
- React + TypeScript, criado com Vite
- React Router: navegação entre telas
- Recharts: gráfico de variação de temperatura
- Vitest + Testing Library: testes automatizados do frontend

## Telas
- `/users`: lista com busca por nome/email, ordenação e paginação
- `/users/new`: cadastro com validação
- `/users/:id`: detalhes, com opções de editar e excluir
- `/users/:id/edit`: edição
- `/weather`: busca de clima por cidade

## Critérios de sucesso
- [ ] A lista filtra por nome ou email (busca parcial)
- [ ] A lista pode ser ordenada por nome
- [ ] A lista é paginada e mostra a página atual e o total de páginas
- [ ] Os filtros ficam na URL (recarregar a página mantém a busca)
- [ ] A busca não dispara a cada tecla digitada (debounce)
- [ ] O formulário valida nome obrigatório e email válido, com mensagens claras
- [ ] A tela de detalhes permite editar e excluir o usuário
- [ ] A tela de clima mostra temperatura, umidade, condição atual
      e um gráfico da variação ao longo do dia
- [ ] Estados de carregamento, lista vazia e erro aparecem na tela
- [ ] A interface funciona no celular e pode ser usada só pelo teclado

## Comandos
Dentro da pasta `frontend`:
- `npm install`: instala as dependências
- `npm run dev`: roda o frontend em modo desenvolvimento
- `npm test`: roda os testes automatizados

## Estrutura do projeto