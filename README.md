# Gerenciador de usuários

Aplicação fullstack para consulta e gerenciamento de usuários, com consulta de clima por cidade.

- Registro do uso de IA: [AI_USAGE.md](./AI_USAGE.md)
- Especificação: [SPEC.md](./SPEC.md)
- Capacidades: [CAPABILITY_MAP.md](./CAPABILITY_MAP.md)
- Plano e tarefas: [tasks/plan.md](./tasks/plan.md) e [tasks/todo.md](./tasks/todo.md)

## O que foi entregue

- PostgreSQL via docker compose, com migrations e um banco separado para os testes
- API REST em Node.js + TypeScript para cadastrar, listar, buscar, editar e excluir usuários
- Listagem com filtro parcial por nome e email, paginação, ordenação e metadados
- Endpoint de clima consultando a WeatherAPI, com contrato próprio, cache e tratamento de falhas
- Importação reproduzível do CSV, com relatório de registros inválidos e emails duplicados
- Contrato da API documentado em OpenAPI, com Swagger UI em `/docs`
- Frontend em React + TypeScript consumindo a API, com filtros na URL, responsivo, acessível por teclado e com tema claro e escuro
- 19 testes automatizados na API e 3 no frontend

## Pré-requisitos

- Node.js (testado com v26.13.0) e npm
- Docker e Docker Compose
- Uma chave gratuita da [WeatherAPI](https://www.weatherapi.com) para a consulta de clima

## Como executar

```
git clone https://github.com/DiogoArcanjo/testePraticoFullStack.git
cd testePraticoFullStack
```

### 1. Banco de dados

Na raiz:

```
docker compose up -d
```

Sobe o PostgreSQL na porta 5432 e cria dois bancos: `usuarios` (desenvolvimento) e `usuarios_test` (testes).

### 2. Backend

```
cd backend
cp .env.example .env
```

Abra o `.env` e preencha a `WEATHER_API_KEY` com a sua chave. Depois:

```
npm install
npm run migrate up
npm run dev
```

A API fica em `http://localhost:3000`, e a documentação em `http://localhost:3000/docs`.

### 3. Frontend

Em outro terminal:

```
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`. O Vite repassa as chamadas de `/api` para o backend.

## Variáveis de ambiente

O backend lê `backend/.env`, criado a partir de `backend/.env.example`:

```
DATABASE_URL=postgres://app:app@localhost:5432/usuarios
PORT=3000
WEATHER_API_KEY=
```

- As variáveis são validadas ao iniciar: se alguma obrigatória estiver ausente ou inválida, o servidor não sobe e informa o motivo.
- O `.env` não é versionado. A chave da WeatherAPI fica só no backend e nunca é enviada ao navegador.
- Sem a `WEATHER_API_KEY`, a API funciona normalmente, e só o endpoint de clima responde 503.
- As credenciais do banco são apenas de desenvolvimento local.

## Migrations

Em `backend`:

```
npm run migrate up
```

As migrations ficam em `backend/migrations`, escritas em SQL.

## Importação do CSV

Coloque o arquivo em `backend/data/users.csv.gz` e, em `backend`:

```
npm run import
```

Para importar outro arquivo, informe o caminho. Por exemplo, o arquivo de exemplo incluído no repositório:

```
npm run import -- data/users.sample.csv.gz
```

Ao final, o script mostra quantas linhas foram lidas, importadas, inválidas, duplicadas no arquivo e já existentes no banco. Os detalhes das linhas inválidas (número da linha e motivo) ficam em `backend/data/import-report.json`.

**Premissa:** o `users.csv.gz` não veio com o material do teste. O script assume um CSV com cabeçalho e, no mínimo, as colunas `name` e `email`, e foi validado com o arquivo de exemplo `backend/data/users.sample.csv`, que contém de propósito linhas inválidas e emails repetidos. Se o cabeçalho for diferente, o script para logo na primeira linha com uma mensagem clara.

**Teste de volume:** com um arquivo gerado de 100.003 linhas (100 mil válidas, 2 inválidas e
1 duplicada), a importação levou cerca de 4,3 segundos. Com a tabela cheia, a primeira página
da listagem respondeu em cerca de 45 ms, uma busca por email em cerca de 4 ms e a página 10.000
em cerca de 76 ms, o que confirma o custo maior do `OFFSET` em páginas distantes.

## Testes

**Backend** (com o banco rodando). Na primeira vez, aplique as migrations no banco de testes:

```
cd backend
DATABASE_URL=postgres://app:app@localhost:5432/usuarios_test npm run migrate up
npm test
```

Os testes da API não chamam a WeatherAPI de verdade: o `fetch` é simulado para cobrir sucesso, cache e cada tipo de falha.

**Frontend:**

```
cd frontend
npm test
```

## API

A documentação completa e interativa está em `http://localhost:3000/docs`. Resumo:

| Método | Rota | Sucesso | Erros |
|---|---|---|---|
| POST | `/users` | 201 | 400 dados inválidos, 409 email duplicado |
| GET | `/users?q=&page=&pageSize=&order=` | 200 com `data` e `meta` | 400 parâmetros inválidos |
| GET | `/users/:id` | 200 | 400 id não é UUID, 404 |
| PATCH | `/users/:id` | 200 | 400, 404, 409 |
| DELETE | `/users/:id` | 204 | 400, 404 |
| GET | `/weather/:city` | 200 | 404 cidade inexistente, 429 limite, 503 indisponível, 504 timeout |

Todos os erros seguem o formato `{ "error": { "code": "...", "message": "..." } }`, sem detalhes internos. Erros de validação trazem também `details`, com o campo e a mensagem.

## Decisões técnicas

### Banco

- **Email único sem diferenciar maiúsculas:** a API salva o email em minúsculas, e o banco garante isso com `UNIQUE (email)` e `CHECK (email = lower(email))`. Mesmo que a validação da API falhasse, o banco recusaria duplicados.
- **Índices trigram (`pg_trgm`) em nome e email:** a busca parcial usa `ILIKE '%termo%'`, que não aproveita índices comuns. Os índices trigram permitem usar índice nesse tipo de busca, o que importa com muitos registros, como os do CSV.
- **Índice em `name`:** atende a listagem ordenada por nome com paginação.

### API

- **Express 5:** framework simples e conhecido; a versão 5 encaminha erros de funções `async` para o tratador de erros.
- **SQL direto com `pg`:** consultas explícitas e sempre parametrizadas (`$1`, `$2`), o que protege contra SQL injection.
- **Zod:** valida corpo, parâmetros, query string e variáveis de ambiente, e normaliza os dados (remove espaços e deixa o email em minúsculas). Os mesmos schemas são usados pela API e pela importação do CSV.
- **Tratador de erros central:** validação vira 400, violação de unicidade do PostgreSQL vira 409, e qualquer erro inesperado vira 500 com mensagem genérica. O detalhe real só aparece no log do servidor.
- **Busca protegida:** `%` e `_` digitados pelo usuário são tratados como texto, e não como curingas.
- **Paginação com desempate por `id`:** evita que um registro apareça em duas páginas quando há nomes iguais.

### Clima

- **Contrato próprio:** a resposta da WeatherAPI é convertida para um formato nosso (cidade, região, país, temperatura, umidade, condição e temperatura por hora). Trocar de provedor mudaria só uma função.
- **Estratégia de cache:** em memória, com expiração de 10 minutos. A chave é o nome da cidade sem espaços nas pontas e em minúsculas, mantendo os acentos, porque o provedor trata grafias diferentes como buscas diferentes. Só respostas de sucesso são guardadas. O cache economiza o limite do plano gratuito e deixa consultas repetidas instantâneas, mas é perdido ao reiniciar o servidor.
- **Falhas:** timeout de 5 segundos (504), cidade inexistente (404), limite de requisições (429) e indisponibilidade ou erro do provedor (503). Erros de configuração, como uma chave inválida, aparecem só no log, nunca na resposta.

### Importação

- **Leitura em fluxo (streaming):** o arquivo é descompactado e lido linha a linha, sem carregar tudo na memória.
- **Reprodutível:** a inserção usa `ON CONFLICT (email) DO NOTHING`, então rodar a importação de novo não duplica registros.
- **Três tipos de recusa separados:** linhas inválidas, emails duplicados dentro do arquivo (vale a primeira ocorrência) e emails já existentes no banco.
- **Inserção em lotes de 500**, com o tempo total medido no relatório.

### Frontend

- **Filtros na URL:** busca, ordem, página e cidade ficam na URL, então o link pode ser recarregado ou compartilhado.
- **Debounce de 400 ms** na busca de usuários, e busca de clima só ao enviar o formulário.
- **Camada de serviço:** as telas não chamam a API diretamente. Por isso, trocar os dados simulados pela API mudou só os serviços.
- **Respostas antigas descartadas:** se duas buscas acontecem em sequência, a resposta mais antiga é ignorada.
- **Proxy do Vite:** o frontend chama `/api`, e o Vite repassa para a porta 3000, evitando configuração de CORS em desenvolvimento.

### Testes

- **Banco separado (`usuarios_test`):** os testes apagam e recriam dados sem afetar o banco de desenvolvimento.
- **Provedor de clima simulado:** permite testar timeout, limite e indisponibilidade sem depender da internet nem gastar o limite da API.
- **Formulário testado pela perspectiva do usuário:** campos e botões são encontrados pelo rótulo e pelo texto, como um leitor de tela faria.

## Simplificações e trade-offs

- **Paginação por `OFFSET`:** simples e suficiente aqui, mas fica lenta em páginas muito distantes. Com volumes muito grandes, a alternativa seria paginação por cursor.
- **Cache do clima em memória:** suficiente para o teste, mas não é compartilhado entre instâncias nem sobrevive a reinícios. Em produção, seria um Redis.
- **Detecção de duplicados no CSV em memória:** os emails já vistos ficam num conjunto em memória. Para arquivos gigantescos, a deduplicação poderia ser feita no banco.
- **Validação também no frontend:** campos vazios e formato de email são checados na tela para dar retorno imediato. A regra definitiva fica na API e no banco.
- **CSS por seletores de tag:** estilos num único arquivo, sem classes. Em um projeto maior, o ideal seriam classes ou CSS por componente.
- **Fonte Manrope via Google Fonts:** sem internet, a interface usa a fonte do sistema.

## Limitações conhecidas

- A importação foi validada com um arquivo de exemplo, porque o `users.csv.gz` real não foi recebido.
- O nome da cidade exibido é o que o provedor devolve (por exemplo, "San Paulo" para São Paulo); a região e o país aparecem logo abaixo para evitar confusão.
- O `npm audit` aponta avisos de gravidade moderada em dependências, ainda não revisados.

## Próximos passos

1. Rodar a importação com o `users.csv.gz` real e ajustar o cabeçalho, se necessário.
2. Teste ponta a ponta de um fluxo crítico (por exemplo, com Playwright) e uma pipeline simples de integração contínua.
3. Logs estruturados com um identificador por requisição.
4. Revisar os avisos do `npm audit`.

## Estrutura do projeto

- `docker-compose.yml` e `docker/`: PostgreSQL e criação do banco de testes
- `backend/src/`: aplicação Express (`app.ts`, `server.ts`, `env.ts`, `db.ts`, `errors.ts`)
- `backend/src/users/`: validação, consultas e rotas de usuários
- `backend/src/weather/`: integração com a WeatherAPI, cache e rota de clima
- `backend/migrations/`: migrations do banco
- `backend/scripts/`: importação do CSV
- `backend/data/`: arquivo de exemplo para a importação
- `backend/tests/`: testes da API
- `backend/openapi.yaml`: contrato da API
- `frontend/src/pages/`: telas
- `frontend/src/components/`: formulário e botão de tema
- `frontend/src/services/`: comunicação com a API
- `frontend/src/hooks/`: carregamento de um usuário
- `tasks/`: plano e tarefas