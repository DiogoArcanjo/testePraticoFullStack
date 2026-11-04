# Uso de IA

## Ferramenta e modelo

- Claude (Anthropic), via claude.ai
- Modelo: Claude Opus 5.5

Usei a IA em todas as etapas, como par de programação e tutora. Como React, TypeScript, Node.js, Docker e PostgreSQL eram novos para mim, pedi que cada passo viesse explicado, e só incorporei o código depois de entender o que ele fazia e verificar o resultado.

## Skills, agentes e workflows

| Skill/origem | Objetivo | Fase | Influência no projeto | Minha decisão | Validação |
|---|---|---|---|---|---|
| `frontend-design` (skill pública da Anthropic, disponível no claude.ai) | Orientar o redesenho visual com uma direção definida, evitando aparência de template | Implement (FE-08) | `frontend/src/index.css`, menu no `App.tsx`, fonte no `index.html` | Aceitei a paleta, a tipografia e o corte de elementos genéricos. Adaptei pedindo tema claro e escuro com botão, e depois um botão de tema mais discreto | Revisão visual nos dois temas, no modo celular e navegando só com teclado |

Não usei agentes nem comandos reutilizáveis. O fluxo foi o Spec-Driven Development pedido no enunciado (Specify → Plan → Tasks → Implement), conduzido na conversa: uma tarefa por vez, com verificação e commit antes da próxima.

## Em quais etapas a IA foi usada

Em todas: especificação, plano, divisão das tarefas, código, explicações, diagnóstico de erros, testes e documentação.

## Specify

Na primeira fase, a IA sugeriu fazer uma versão mínima de todas as partes. Avaliei meu tempo e experiência e decidi priorizar o frontend com dados simulados. A IA gerou o rascunho do `SPEC.md`, e eu revisei, encontrando um trecho cortado e seções faltando.

Depois de entregar o frontend, decidi implementar também a stack obrigatória. Antes de qualquer código, atualizei o `SPEC.md` com o novo escopo, a stack do backend, o contrato da API (rotas, códigos HTTP e formato de erro) e os novos critérios de sucesso. Como o `users.csv.gz` não veio com o teste, registrei uma premissa sobre o formato do arquivo nas questões em aberto antes de escrever a importação.

## Plan

O `tasks/plan.md` ficou em duas fases. Na segunda, ordenei as tarefas por prioridade e risco: banco, API de usuários, testes e integração com o frontend primeiro; importação, clima real e OpenAPI depois. Assim, a qualquer momento, o que estivesse pronto funcionaria de ponta a ponta. Com o prazo apertando, cheguei a adiar essas três últimas tarefas, registrando a decisão no `todo.md`; depois decidi retomá-las e também registrei isso.

## Tasks

As tarefas ficaram em `tasks/todo.md`, com critério de aceite, verificação e estado. Tarefas grandes foram divididas antes do código (FE-04 em quatro e FE-05 em duas). Ao ampliar o escopo, criei as tarefas BE-01 a BE-09, FE-09 a FE-11 e DOC-01 antes de implementar.

## Implement

Uma tarefa por vez: pedia o código explicado, aplicava, verificava os critérios (no navegador, com curl ou com testes automatizados), marcava como feita e fazia um commit próprio. Quando algo não estava claro, pedia a explicação linha por linha.

## Resumo por fase

| Fase | Objetivo | Como a IA foi orientada | Decisão tomada | Artefato alterado | Como foi verificado |
|---|---|---|---|---|---|
| Specify | Definir escopo, contrato e critérios | Enviei o enunciado, meu nível de experiência e o prazo | Primeiro só frontend; depois a stack completa, sempre atualizando a spec antes do código | `SPEC.md` | Revisão contra os itens obrigatórios do enunciado |
| Plan | Ordenar por prioridade e risco | Pedi plano com riscos e checkpoints | Núcleo (banco, API, testes, integração) antes de CSV, clima e OpenAPI | `tasks/plan.md`, `CAPABILITY_MAP.md` | Checagem de dependências entre as tarefas |
| Tasks | Tarefas pequenas e verificáveis | Pedi critério de aceite e forma de verificação para cada tarefa | Dividi tarefas grandes; registrei tarefas adiadas e retomadas | `tasks/todo.md` | Cada critério conferido antes de marcar como feito |
| Implement | Código, testes e integração | Uma tarefa por vez, com o critério de aceite da tarefa | Corrigi nomes de arquivo, configuração de testes, commits incompletos e um diagnóstico errado da IA | `backend/`, `frontend/` | curl, `npm test` (19 testes na API e 3 no frontend) e testes no navegador |

## Exemplos de instruções dadas à IA

1. **"Tenho esse projeto pra fazer e 24h pra entregar [...] meu plano é criar pelo menos o front-end e uma documentação simples. O que você me diz?"**
   A IA recomendou fazer um pouco de cada parte e alertou que o frontend precisava ser em React + TypeScript. Aceitei o alerta da stack, mas mantive a decisão de priorizar o frontend naquele momento.

2. **"Quero entender melhor o que faz cada linha desse código TypeScript."** (busca da lista de usuários)
   A IA explicou bloco por bloco o `useSearchParams`, o `filter` e o ciclo entre campo, URL e lista. Só segui depois de entender.

3. **"Vou ter que realizar as stacks obrigatórias mesmo não sabendo. Como podemos planejar e fazer isso juntos?"**
   A IA propôs ferramentas simples (Express, SQL direto com `pg`, Zod), uma ordem por prioridade e começar atualizando a spec. Aceitei e segui a ordem, adaptando ao prazo.

4. **"São Paulo quebrou."** (a tela mostrava "San Paulo")
   A IA concluiu primeiro que o provedor tinha encontrado outro lugar e propôs exibir região e país. A exibição desmentiu o diagnóstico: era a cidade certa, com a grafia do provedor.

## Sugestões da IA que corrigi, adaptei ou rejeitei

- **Escopo inicial rejeitado:** não segui a sugestão de fazer um pouco de tudo logo no início; priorizei o frontend e, depois, ampliei o escopo de forma planejada.
- **SPEC cortado:** o arquivo gerado tinha um bloco de código dentro de outro e foi cortado. Percebi na revisão e corrigi.
- **Pedido mal interpretado:** a IA entendeu "tema claro" como tema único. Corrigi a instrução antes do commit.
- **Botão de tema:** pedi uma versão mais discreta que a primeira proposta.
- **Nome da cidade no clima:** ao buscar "São Paulo", a tela mostrava "San Paulo". A IA concluiu primeiro que o provedor tinha encontrado outro lugar. Para verificar, atualizei o contrato no SPEC e passei a exibir região e país, o que mostrou que era a cidade correta ("Sao Paulo, Brazil"), apenas com a grafia usada pelo provedor. O diagnóstico inicial estava errado; a exibição de região e país ficou, porque ajuda em nomes ambíguos.

## Mudanças na especificação ou no plano antes do código

- **FE-04 e FE-05:** divididas em subtarefas antes de implementar. Na FE-05, adicionei antes ao SPEC a camada de serviço e o critério de email duplicado.
- **FE-08:** ao decidir ter tema claro e escuro, atualizei primeiro o critério no SPEC e no `todo.md`.
- **Ampliação do escopo:** antes de escrever o backend, atualizei SPEC, CAPABILITY_MAP, plano e tarefas.
- **Tarefas adiadas e retomadas:** BE-07, BE-08 e BE-09 foram marcadas como adiadas e depois retomadas, sempre registrando a decisão no `todo.md` antes de mudar o código.
- **Premissa do CSV:** registrada no SPEC antes de escrever a importação.
- **Contrato do clima:** região e país foram adicionados ao contrato no SPEC antes da mudança no código.

## Rastreabilidade

| Requisito/critério | Tarefa | Commit | Verificação |
|---|---|---|---|
| PostgreSQL com docker compose | BE-01 | `<hash>` | `docker compose ps` mostra `healthy` |
| Variáveis de ambiente validadas | BE-02 | `<hash>` | Servidor recusa subir sem `DATABASE_URL` |
| Tabela `users` via migration, com email único | BE-03 | `<hash>` | `\d users` mostra colunas, índices e restrições |
| Códigos HTTP coerentes e erro consistente | BE-04 | `<hash>` | curl: 201, 200, 204, 400, 404 e 409 |
| Criação de usuário e rejeição de email duplicado | BE-04, BE-06 | `<hash>` | Testes "cria um usuário..." e "rejeita email duplicado, mesmo com maiúsculas diferentes" |
| Filtros e paginação da listagem | BE-05, BE-06 | `<hash>` | Testes de filtro, paginação, ordenação e curinga |
| Identificador inválido e usuário inexistente | BE-04, BE-06 | `<hash>` | Testes de 400 e 404 em `GET /users/:id` |
| Importação com inválidos e duplicados | BE-07 | `<hash>` | Arquivo de exemplo: 4 importadas, 2 inválidas, 2 duplicadas; segunda execução não duplica |
| Clima com contrato próprio e cache | BE-08 | `<hash>` | Testes de conversão e de cache |
| Tratamento de falha da API de clima | BE-08 | `<hash>` | Testes de 404, 429, 503 e 504, e de não exposição da chave |
| Contrato documentado em OpenAPI | BE-09 | `<hash>` | Teste do `/openapi.json` e página `/docs` |
| Filtros na URL e debounce | FE-04a a FE-04d | `<hash>` | F5 mantém busca, ordem e página; URL só muda após a pausa |
| Frontend consumindo a API | FE-09, FE-11 | `<hash>` | Dados permanecem após F5; mensagens com a API desligada |
| Fluxo do frontend testado | FE-10 | `<hash>` | 3 testes do formulário: validação, envio e email duplicado |
| Responsivo e utilizável por teclado | FE-08 | `<hash>` | Modo celular do navegador e navegação por Tab |

## Como validei o código

- Antes de aplicar qualquer código, pedia a explicação e conferia se entendia o que ele fazia.
- Depois de cada tarefa, testava os critérios de aceite, incluindo os casos de erro: no navegador, com curl ou com testes automatizados.
- Conferi que os testes realmente verificam algo, mudando o código de propósito para ver o teste falhar e depois desfazendo.
- Os testes da API passavam, mas o arquivo de configuração estava com o nome errado (`viteste.config.ts`), e eles rodavam no banco de desenvolvimento. O erro foi notado na revisão de um print; corrigi e confirmei criando um usuário antes dos testes e verificando que ele continuava lá depois.
- Ao mudar o contrato do clima, um teste falhou, mostrando exatamente os campos novos. Atualizei o teste conscientemente.
- Pelo `git status`, percebi que um commit tinha ficado incompleto (o `git add .` foi rodado de dentro de `backend`) e fiz um commit complementar.
- Acompanhei o painel de Problemas do VS Code antes de cada commit.
- Erros encontrados e corrigidos: imports quebrados por nomes de arquivo diferentes (o Linux diferencia maiúsculas de minúsculas), uma `div` sem fechamento e arquivos criados na pasta errada.
- Antes de testar com volume, a IA previu que a aplicação aguentaria 100 mil usuários e que a
  página distante seria o ponto mais lento. Em vez de aceitar a previsão, gerei um arquivo com
  100 mil linhas, importei e medi os tempos com curl. Os números confirmaram a previsão.

## Limitações percebidas e onde não usei IA

**Limitações da IA:**
- Ela não vê a aplicação rodando. Eu precisava enviar prints para ela diagnosticar problemas.
- Gerou documento com erro de formatação, interpretou errado um pedido meu e deu um diagnóstico errado sobre o clima. Revisar e verificar tudo foi indispensável.
- Como ela explica com confiança, o risco é aceitar código sem entender. Para evitar isso, pedia explicações antes de seguir.

**Onde não usei IA:**
- As decisões de escopo e de prioridade, incluindo adiar e depois retomar tarefas.
- A execução de todos os testes no navegador e no terminal.
- A configuração do Git e do GitHub, e a criação da conta na WeatherAPI.
- A chave da WeatherAPI: ela nunca foi enviada à ferramenta, fica só no `.env` local.
- A correção da `div` sem fechamento, que encontrei sozinho.

Os dados de exemplo usam o domínio `example.com`, reservado para testes, para não envolver dados de pessoas reais.