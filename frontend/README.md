# Gerenciador de usuários

Aplicação para consulta e gerenciamento de usuários, com consulta de clima por cidade.

Esta entrega prioriza o **frontend em React + TypeScript**, funcionando com dados simulados (mock). Backend, banco de dados e integração real de clima ficaram como próximos passos, descritos no fim deste documento.

Registro do uso de IA: [AI_USAGE.md](./AI_USAGE.md)
Especificação: [SPEC.md](./SPEC.md) · Plano: [tasks/plan.md](./tasks/plan.md) · Tarefas: [tasks/todo.md](./tasks/todo.md)

## O que foi entregue

- Lista de usuários com busca por nome ou email, ordenação por nome e paginação
- Busca, ordenação e página guardadas na URL (recarregar ou compartilhar o link mantém o contexto)
- Busca com debounce de 400 ms, para não aplicar o filtro a cada tecla
- Cadastro e edição com validação: nome obrigatório, email válido e email não duplicado
- Tela de detalhes com edição e exclusão (com confirmação)
- Tela de clima com temperatura, umidade, condição atual e gráfico da variação ao longo do dia
- Estados de carregamento, lista vazia, não encontrado e erro
- Interface responsiva, navegável por teclado, com tema claro e escuro

## O que ficou pendente

- Backend em Node.js + TypeScript (API REST)
- PostgreSQL com docker compose, migrations e importação do `users.csv.gz`
- Integração com uma API de clima real, com cache
- Testes automatizados

## Pré-requisitos

- Node.js v26.13.0
- npm 

## Como executar

```
git clone https://github.com/DiogoArcanjo/testePraticoFullStack.git
cd testePraticoFullStack/frontend
npm install
npm run dev
```

Depois, abra `http://localhost:5173`.

## Variáveis de ambiente

Esta entrega não precisa de nenhuma. Quando o backend existir, ele terá um arquivo `.env.example` com as variáveis abaixo, sem valores reais:

```
DATABASE_URL=postgres://usuario:senha@localhost:5432/usuarios
WEATHER_API_KEY=coloque-sua-chave-aqui
PORT=3000
```

A chave da API de clima ficará só no backend, nunca no navegador nem no repositório.

## Testes

Ainda não há testes automatizados. Cada tarefa foi verificada manualmente no navegador, com os critérios de aceite registrados em `tasks/todo.md`.

Para simular falha do serviço de clima, busque a cidade **erro**. As cidades disponíveis no mock são São Paulo, Rio de Janeiro e Curitiba.

## Decisões técnicas

- **Vite:** cria o projeto React + TypeScript pronto e roda rápido em desenvolvimento.
- **React Router:** navegação entre as telas, com cada tela em sua própria URL.
- **Filtros na URL:** a URL é a fonte da verdade para busca, ordenação e página. Isso torna o link compartilhável e o F5 seguro.
- **Camada de serviço:** as telas não acessam os dados direto. Elas chamam funções como `listUsers` e `fetchWeather`, que hoje usam dados em memória. Quando o backend existir, só os serviços mudam, e as telas continuam iguais.
- **Email em minúsculas:** o email é salvo em minúsculas, para que `Ana@Example.com` e `ana@example.com` não virem dois cadastros.
- **Busca de clima descartando respostas antigas:** se duas cidades são buscadas em sequência, a resposta mais antiga é ignorada e não sobrescreve a mais nova.
- **Recharts:** biblioteca de gráficos simples de usar com React. As cores do gráfico seguem o tema ativo.
- **Exclusão com `window.confirm`:** solução simples e acessível para evitar exclusões acidentais.
- **Validação feita à mão:** com só dois campos, uma biblioteca de formulários seria uma abstração sem necessidade.

## Simplificações e trade-offs

- **Dados em memória:** cadastros, edições e exclusões são perdidos ao recarregar a página.
- **CSS por seletores de tag:** os estilos ficam em um único arquivo e usam as próprias tags e atributos de acessibilidade, em vez de classes. Isso evitou mexer em todos os componentes, mas em um projeto maior o ideal seriam classes ou CSS por componente.
- **Fonte Manrope via Google Fonts:** precisa de internet. Sem conexão, a interface usa a fonte do sistema e continua funcionando.
- **Tema salvo no navegador:** a escolha de tema fica no `localStorage` do navegador.

## Limitações conhecidas

- Sem persistência real dos dados
- O clima tem apenas três cidades simuladas
- Sem testes automatizados

## Próximos passos

Em ordem de prioridade:

1. **Testes do frontend** com Vitest e Testing Library: busca filtrando a lista e validação do formulário.
2. **Backend de usuários:** API REST em Node.js + TypeScript com os endpoints `POST`, `GET`, `GET /:id`, `PATCH` e `DELETE /users`, validação, erros em formato consistente e documentação OpenAPI.
3. **Banco de dados:** PostgreSQL via docker compose, migrations criando a tabela `users` (com email único) e script de importação do CSV tratando registros inválidos e emails duplicados.
4. **Ligar o frontend à API:** trocar o conteúdo de `userService.ts` por chamadas HTTP.
5. **Clima real:** endpoint `GET /weather/:city` no backend consultando uma API pública, com cache em memória, tratamento de timeout, cidade inexistente e limite de requisições.

## Estrutura do projeto

- `frontend/src/pages/`: uma tela por arquivo
- `frontend/src/components/`: formulário de usuário e botão de tema
- `frontend/src/services/`: acesso aos dados (hoje em memória)
- `frontend/src/mocks/`: dados simulados
- `frontend/src/types/`: tipos TypeScript
- `tasks/`: plano e tarefas