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
- Cadastros e edições ficam em memória e são perdidos ao recarregar a página. 

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
- [ ] O formulário impede cadastrar um email que já existe

## Comandos
Dentro da pasta `frontend`:
- `npm install`: instala as dependências
- `npm run dev`: roda o frontend em modo desenvolvimento
- `npm test`: roda os testes automatizados

## Estrutura do projeto
- `frontend/`: aplicação React + TypeScript
  - `src/components/`: componentes reutilizáveis
  - `src/pages/`: uma tela por arquivo
  - `src/mocks/`: dados simulados
  - `src/types/`: tipos TypeScript (ex.: User)
  - `src/services/`: funções de acesso aos dados (hoje em memória; depois chamarão a API)
- `tasks/`: plano (`plan.md`) e tarefas (`todo.md`)
- `SPEC.md`, `CAPABILITY_MAP.md`, `AI_USAGE.md`, `README.md`: documentação na raiz

## Convenções
- Componentes em PascalCase (ex.: `UserList.tsx`)
- Variáveis e funções em camelCase (ex.: `searchTerm`)
- Commits no formato `tipo: descrição (ID da tarefa)`,
  com tipos `docs`, `feat`, `fix` e `test`
- Cada tarefa do `tasks/todo.md` é validada antes de começar a próxima

## Estratégia de testes
- Verificação manual no navegador ao final de cada tarefa
- Teste automatizado de ao menos um fluxo relevante:
  busca na lista de usuários filtrando os resultados
- Teste automatizado da validação do formulário
  (campo vazio e email inválido)

## Limites
- Sem autenticação
- Sem backend nem banco nesta entrega: dados não persistem
  ao recarregar a página
- Clima com dados simulados, sem chamada a API externa

## Questões em aberto
- Ordem de prioridade caso o tempo permita ampliar o escopo:
  backend de usuários primeiro, depois integração de clima.
- Validação de formulário: começar com validação simples
  feita à mão; avaliar uma biblioteca se ficar complexo.