# Uso de IA

## Ferramenta e modelo

- Claude (Anthropic), via claude.ai
- Modelo: Claude Opus 5.5

Usei a IA como par de programação e tutora. Como eu estava começando em React e TypeScript, pedi que cada passo viesse explicado, e só incorporei o código depois de pedir a explicação do que ele faz e testar no navegador.

## Skills, agentes e workflows

| Skill/origem | Objetivo | Fase | Influência no projeto | Minha decisão | Validação |
|---|---|---|---|---|---|
| `frontend-design` (skill pública da Anthropic, disponível no claude.ai) 
| Orientar o redesenho visual com uma direção definida, evitando aparência de template 
| Implement (FE-08) | `src/index.css`, menu no `App.tsx`, fonte no `index.html` 
| Aceitei a paleta, a tipografia e a ideia de cortar elementos genéricos (cartão com sombra, menu em "pílulas", cabeçalhos em caixa alta). Adaptei pedindo tema claro e escuro com botão, e depois pedi um botão de tema mais discreto 
| Revisão visual nos dois temas, no modo celular do navegador e navegando só com teclado |

Não usei agentes nem comandos reutilizáveis. O fluxo de trabalho foi o Spec-Driven Development pedido no enunciado (Specify → Plan → Tasks → Implement), conduzido na conversa: uma tarefa por vez, com verificação e commit antes de passar para a próxima.

## Em quais etapas a IA foi usada

Em todas: rascunho das especificações, plano, divisão das tarefas, código, explicações do código, diagnóstico de erros e documentação.

## Specify

A IA leu o enunciado e sugeriu fazer uma "fatia fina" de tudo (banco, API, frontend e clima). Avaliei meu tempo e meu nível de experiência e decidi priorizar só o frontend com dados simulados, deixando o restante como próximos passos documentados. A IA então gerou o rascunho do `SPEC.md` para esse escopo, e eu revisei antes de aceitar. Na revisão, percebi que o arquivo tinha sido cortado no meio e que faltavam seções exigidas pelo enunciado (estrutura, convenções, estratégia de testes, limites), e pedi para completar.

## Plan

A IA propôs a ordem de implementação em `tasks/plan.md`: projeto Vite, rotas, lista, busca/ordenação/paginação, formulário, detalhes e clima. Mantive essa ordem porque cada tela depende das anteriores (as rotas vêm antes das telas, e a lista vem antes dos detalhes). Os riscos registrados foram minha pouca experiência com React/TS e a ausência de backend.

## Tasks

As tarefas ficaram em `tasks/todo.md`, cada uma com critério de aceite, forma de verificação e estado. Quando uma tarefa se mostrava grande demais para validar de uma vez, eu a dividia no `todo.md` **antes** de escrever o código (FE-04 virou quatro subtarefas, e FE-05 virou duas).

## Implement

Implementei uma tarefa por vez. Para cada uma: pedia o código explicado, lia e entendia, aplicava, testava os critérios de aceite no navegador, marcava como feita e fazia um commit próprio. Quando algo não estava claro, pedia a explicação linha por linha (por exemplo, o `App.tsx` gerado pelo Vite, a arrow function do contador e o código da busca com `useSearchParams`).

## Resumo por fase

| Fase | Objetivo | Como a IA foi orientada | Decisão tomada | Artefato alterado | Como foi verificado |
|---|---|---|---|---|---|

| Specify | Definir escopo e critérios | Enviei o enunciado e expliquei meu nível e o prazo | Rejeitei o escopo completo sugerido e fiquei com frontend + mock | `SPEC.md` | Revisão do SPEC contra os itens obrigatórios do enunciado |

| Plan | Ordenar a implementação | Pedi um plano com riscos e checkpoints | Aceitei a ordem proposta | `tasks/plan.md` | Checagem de dependências entre as telas |

| Tasks | Tarefas pequenas e verificáveis | Pedi critérios de aceite para cada tarefa | Dividi a FE-04 e a FE-05 antes de implementar | `tasks/todo.md` | Cada critério testado antes de marcar como feito |

| Implement | Código e visual | Uma tarefa por vez, com o critério de aceite da tarefa | Corrigi nomes de arquivos, pedi ajustes no visual | Código em `frontend/src` | Testes manuais no navegador, modo celular e teclado |

## Exemplos de instruções dadas à IA

1. **"Olha, eu tenho esse projeto pra fazer e 24h pra entregar [...] meu plano é criar pelo menos o front-end e uma documentação simples. O que você me diz?"**
   A IA recomendou fazer um pouco de cada parte e alertou que o frontend precisava ser em React + TypeScript (a stack é obrigatória). Aceitei o alerta da stack, mas mantive minha decisão de priorizar o frontend.

2. **"Quero entender melhor o que faz cada linha desse código TypeScript."** (sobre a busca da lista)
   A IA explicou bloco por bloco: `useSearchParams`, o `filter`, o `replace: true` no histórico e o ciclo entre campo, URL e lista. Só segui para a próxima tarefa depois de entender.

3. **"Eu queria um visual mais moderno e centralizado ao centro da tela."** e depois **"Quero a opção tema claro e escuro."**
   A IA primeiro entregou um visual só claro, porque entendeu errado meu pedido. Corrigi a instrução, e ela refez com os dois temas e um botão para alternar.

4. **"O botão de tema claro poderia ser mais discreto."**
   A IA trocou o botão com texto por um ícone, mantendo um `aria-label` para leitores de tela.

## Sugestões da IA que corrigi, adaptei ou rejeitei

- **Escopo rejeitado:** a IA sugeriu implementar uma versão mínima de todas as partes (banco, API, frontend e clima). Rejeitei por causa do prazo e da minha experiência, e preferi entregar um frontend completo e bem verificado, documentando o resto como próximos passos.
- **SPEC cortado:** o `SPEC.md` gerado tinha um bloco de código dentro de outro, o que cortou o arquivo na seção "Estrutura do projeto". Percebi na revisão, e a estrutura foi reescrita como lista.
- **Pedido mal interpretado:** quando pedi tema claro e escuro, a IA entendeu que eu queria só o tema claro. Corrigi a instrução antes de fazer o commit.
- **Botão de tema:** a primeira versão tinha texto e borda, chamando atenção demais. Pedi uma versão mais discreta.
- **Nome da cidade no clima:** ao buscar "São Paulo", a tela mostrava "San Paulo". A IA concluiu
  primeiro que o provedor tinha encontrado outro lugar. Para verificar, atualizei o contrato no SPEC
  e passei a exibir região e país, o que mostrou que era a cidade correta ("Sao Paulo, Brazil"),
  apenas com a grafia usada pelo provedor. O diagnóstico inicial da IA estava errado; a exibição de
  região e país ficou, porque ajuda em nomes ambíguos.

## Mudanças na especificação ou no plano antes do código

- **FE-04:** dividida em FE-04a (busca), FE-04b (debounce), FE-04c (ordenação) e FE-04d (paginação) antes de implementar, por ser grande demais para validar de uma vez.
- **FE-05:** antes de implementar, adicionei ao SPEC a camada de serviço em memória (`src/services`) e o critério de email duplicado, e dividi a tarefa em FE-05a (cadastro) e FE-05b (edição).
- **FE-08:** criei a tarefa de visual no `todo.md` antes do CSS. Quando decidi ter tema claro e escuro, atualizei primeiro o critério no SPEC e no `todo.md`, e só depois implementei.

- **Ampliação do escopo:** depois de entregar o frontend, reavaliei e decidi implementar
  também a stack obrigatória (backend, banco e clima real). Antes de escrever qualquer código,
  atualizei o SPEC (escopo, stack, contrato da API e critérios), o CAPABILITY_MAP, o plano e as tarefas.

## Rastreabilidade

| Requisito/critério | Tarefa | Commit | Verificação |
|---|---|---|---|
| Rotas navegáveis | FE-02 | `<hash>` | Cada URL abre a tela certa |
| Busca parcial por nome e email | FE-04a | `<hash>` | Buscar "ana" mostra só a Ana; "xyz" mostra lista vazia |
| Filtros na URL | FE-04a, FE-04c, FE-04d | `<hash>` | F5 mantém busca, ordem e página |
| Não buscar a cada tecla | FE-04b | `<hash>` | URL só muda após parar de digitar |
| Ordenação | FE-04c | `<hash>` | Botão alterna A-Z/Z-A |
| Paginação com metadados | FE-04d | `<hash>` | "Página X de Y"; `?page=99` vai para a última |
| Validação do formulário | FE-05a | `<hash>` | Campos vazios e email inválido mostram erro |
| Rejeitar email duplicado | FE-05a, FE-05b | `<hash>` | Email existente (inclusive em maiúsculas) é rejeitado |
| Usuário inexistente | FE-05b, FE-06 | `<hash>` | `/users/abc` mostra "Usuário não encontrado" |
| Detalhes, edição e exclusão | FE-06 | `<hash>` | Editar salva; excluir pede confirmação |
| Clima com gráfico e estados | FE-07 | `<hash>` | Cidade válida, inexistente e "erro" |
| Responsivo, teclado e temas | FE-08 | `<hash>` | Modo celular, navegação por Tab, F5 mantém o tema |

## Como validei o código

- Antes de aplicar qualquer código, pedia a explicação e conferia se entendia o que ele fazia.
- Depois de cada tarefa, testava todos os critérios de aceite no navegador, incluindo casos de erro (campos vazios, email duplicado, ids inexistentes, valores inválidos na URL).
- Testei a responsividade no modo celular do navegador e a acessibilidade navegando só com teclado.
- Acompanhei o painel de Problemas do VS Code, que precisava estar zerado antes de cada commit.
- Erros encontrados nos testes: imports quebrados por nomes de arquivo diferentes (`weatherPage.tsx`, `types/users.ts`, `useService.ts`, `themeToggle.tsx`), porque o Linux diferencia maiúsculas de minúsculas, e uma `div` sem fechamento no formulário, que eu mesmo encontrei. Todos corrigidos antes do commit.

## Limitações percebidas e onde não usei IA

**Limitações da IA:**
- Ela não vê a aplicação rodando. Eu precisava enviar prints para ela diagnosticar problemas.
- Gerou documento com erro de formatação (o SPEC cortado) e interpretou errado um pedido meu. Por isso, revisar tudo foi indispensável.
- Como ela explica com confiança, o risco é aceitar código sem entender. Para evitar isso, pedia explicações antes de seguir.

**Onde não usei IA:**
- A decisão de escopo e de prioridades.
- A execução de todos os testes no navegador.
- A configuração do Git e do GitHub. Não enviei email, credenciais ou dados pessoais para a ferramenta.

Os dados de exemplo usam o domínio `example.com`, reservado para testes, para não envolver dados de pessoas reais.