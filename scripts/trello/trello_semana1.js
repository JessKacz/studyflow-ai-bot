const https = require('https');

const KEY = 'SEU_TRELLO_KEY_AQUI';
const TOKEN = 'SEU_TRELLO_TOKEN_AQUI';
const BOARD = '6a1848ea51e9dd133ebab35f';

function trello(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const sep = path.includes('?') ? '&' : '?';
    const fullPath = `/1${path}${sep}key=${KEY}&token=${TOKEN}`;
    const options = {
      hostname: 'api.trello.com',
      path: fullPath,
      method,
      headers: data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}
    };
    const req = https.request(options, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { resolve(d); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function createList(name) {
  const r = await trello('POST', '/lists', { name, idBoard: BOARD, pos: 'bottom' });
  console.log(`Lista criada: ${name} → ${r.id}`);
  return r.id;
}

async function createCard(listId, name, desc) {
  const r = await trello('POST', '/cards', { name, idList: listId, desc });
  console.log(`Card criado: ${name} → ${r.id}`);
  return r.id;
}

async function addChecklist(cardId, name, items) {
  const cl = await trello('POST', '/checklists', { idCard: cardId, name });
  for (const item of items) {
    await trello('POST', `/checklists/${cl.id}/checkItems`, { name: item, checked: false });
  }
  return cl.id;
}

async function main() {
  // LISTAS
  const backlogId = await createList('📚 BACKLOG');
  await createList('📅 ESTA SEMANA');
  await createList('⚡ EM ANDAMENTO');
  await createList('🔄 REVISÃO');
  await createList('✅ CONCLUÍDO');

  // DIA 1
  const d1 = await createCard(backlogId, '📅 Dia 1 — QA, QC, Testing e Tipos de Teste', `## Objetivo do Dia
Entender o que é QA, qual o papel no time e dominar os tipos de teste do mercado.

---

## Conceitos-Chave

**QA vs QC vs Testing**
- QA (Quality Assurance): processo preventivo — garante que o processo produza qualidade. Pensa no processo.
- QC (Quality Control): processo reativo — verifica se o produto atende aos requisitos. Pensa no produto.
- Testing: execução de testes para encontrar defeitos. Ferramenta do QC.

Analogia: QA é o arquiteto que define como construir certo. QC é o inspetor. Testing é o teste de carga.

---

**O papel do QA no time**
- Não é "quem testa no final" — entra desde o planejamento
- Shift-left testing: testar mais cedo = economizar mais
- Comunica com Dev, PO, Designer e Stakeholders

---

**Tipos de Teste**

| Tipo | O que testa | Quando usar |
|------|-------------|-------------|
| Funcional | O que o sistema FAZ | Sempre |
| Não-funcional | COMO se comporta (performance, segurança) | Releases importantes |
| Regressão | Mudanças não quebraram nada | A cada PR/deploy |
| Smoke | Sanidade básica após deploy | Todo deploy |
| Sanidade | Verificação após correção | Após bugfix |
| Unidade | Uma função isolada | Durante desenvolvimento |
| Integração | Comunicação entre módulos | Após integrar features |
| E2E | Fluxo completo do usuário | Features críticas |

---

## Links de Apoio
- QA vs QC vs Testing: https://www.guru99.com/difference-between-quality-assurance-and-quality-control.html
- Shift-Left Testing: https://www.atlassian.com/agile/software-testing
- YouTube: "What does a QA Engineer do" (Software Testing Mentor)

## Curso Alura
https://www.alura.com.br/curso-online-fundamentos-qualidade-software

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Teoria — QA/QC/Testing + Tipos de teste
- Bloco 2 (13h–16h): Exercícios práticos`);

  await addChecklist(d1, '📚 Conteúdo para estudar', [
    'Entender a diferença entre QA, QC e Testing',
    'Compreender o papel do QA no ciclo de desenvolvimento',
    'Estudar o conceito de Shift-Left Testing',
    'Dominar os tipos de teste: Funcional e Não-funcional',
    'Dominar os tipos de teste: Regressão, Smoke e Sanidade',
    'Dominar os tipos de teste: Unidade, Integração e E2E',
  ]);
  await addChecklist(d1, '✏️ Exercícios do dia', [
    'Para cada situação, identificar o tipo de teste mais adequado e justificar',
    'Pesquisar uma empresa tech e descrever o papel do QA lá',
    'Escrever com suas próprias palavras: diferença QA x QC x Testing',
  ]);
  await addChecklist(d1, '✅ Critérios de conclusão', [
    'Consigo explicar QA, QC e Testing com minhas próprias palavras',
    'Sei identificar o tipo de teste correto para cada cenário',
    'Entendo por que o QA não é só quem clica no botão',
  ]);
  console.log('Dia 1 completo!');

  // DIA 2
  const d2 = await createCard(backlogId, '📅 Dia 2 — SDLC, STLC e Pirâmide de Testes', `## Objetivo do Dia
Entender o ciclo de vida completo do desenvolvimento e dos testes, e dominar a pirâmide de testes.

---

## Conceitos-Chave

**SDLC — Software Development Life Cycle**
Fases: Planejamento → Análise → Design → Desenvolvimento → Testes → Deploy → Manutenção

| Fase | O que o QA faz |
|------|----------------|
| Planejamento | Revisa requisitos, levanta riscos |
| Design | Revisa arquitetura, aponta problemas cedo |
| Desenvolvimento | Prepara casos de teste, setup do ambiente |
| Testes | Executa, reporta bugs, retesta |
| Deploy | Smoke test em produção |
| Manutenção | Monitora, regride em patches |

---

**STLC — Software Testing Life Cycle**
Análise de requisitos → Planejamento → Design dos testes → Setup do ambiente → Execução → Encerramento

O STLC roda dentro do SDLC. Enquanto devs desenvolvem, o QA já está escrevendo casos de teste.

---

**Pirâmide de Testes**

      /E2E          (poucos, lentos, caros)
     /--------
    / Integração    (médios)
   /------------
  / Unidade         (muitos, rápidos, baratos)

Por que essa proporção?
- Testes de unidade: rápidos, baratos, fáceis de manter
- Testes E2E: lentos, frágeis, caros de manter
- Anti-padrão: pirâmide invertida (muitos E2E) = CI lento e frágil

Troféu de Testes (visão moderna de Kent C. Dodds):
Static → Unit → Integration → E2E — foco maior em integração.

---

## Links de Apoio
- Practical Test Pyramid (Martin Fowler): https://martinfowler.com/articles/practical-test-pyramid.html
- SDLC: https://www.guru99.com/software-development-life-cycle-tutorial.html
- STLC: https://www.guru99.com/software-testing-life-cycle.html

## Curso Alura
https://www.alura.com.br/curso-online-fundamentos-qualidade-software

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): SDLC + STLC
- Bloco 2 (13h–16h): Pirâmide de testes + exercícios`);

  await addChecklist(d2, '📚 Conteúdo para estudar', [
    'Estudar as fases do SDLC e o papel do QA em cada uma',
    'Estudar as fases do STLC e suas entradas/saídas',
    'Entender a relação entre SDLC e STLC',
    'Compreender a Pirâmide de Testes e a proporção ideal',
    'Entender o anti-padrão da pirâmide invertida',
    'Conhecer o Troféu de Testes (visão moderna)',
  ]);
  await addChecklist(d2, '✏️ Exercícios do dia', [
    'Desenhar o SDLC de um e-commerce com as fases do STLC paralelas',
    'Para cada fase do SDLC: o que o QA faz, que documento produz, com quem se comunica',
    'Montar pirâmide de testes com 3 exemplos por camada para um app de to-do list',
  ]);
  await addChecklist(d2, '✅ Critérios de conclusão', [
    'Sei explicar SDLC e STLC com minhas próprias palavras',
    'Consigo identificar o papel do QA em cada fase do SDLC',
    'Entendo por que a base da pirâmide deve ser maior',
  ]);
  console.log('Dia 2 completo!');

  // DIA 3
  const d3 = await createCard(backlogId, '📅 Dia 3 — Bug Lifecycle e Bug Report Profissional', `## Objetivo do Dia
Dominar o ciclo de vida de um bug e aprender a escrever bug reports profissionais.

---

## Conceitos-Chave

**Bug Lifecycle**
Novo → Atribuído → Em análise → Corrigindo → Em reteste → Fechado (ou Reaberto)

**Severidade vs Prioridade**

| | Descrição | Quem define |
|--|-----------|-------------|
| Severidade | Impacto técnico do bug | QA |
| Prioridade | Urgência de correção | PO / Dev |

Exemplo clássico: erro de digitação no nome da empresa na home = baixa severidade, ALTA prioridade (impacto na marca!).

---

**Estrutura do Bug Report Perfeito**

Título: [Módulo] Comportamento inesperado ao [ação]
Exemplo: [Login] Usuário consegue logar após conta deveria estar bloqueada

Ambiente: Windows 10 / Chrome 124 / App v2.3.1
Pré-condições: Usuário cadastrado com senha "1234"

Passos para reproduzir:
1. Acessar tela de login
2. Inserir e-mail válido
3. Inserir senha incorreta 3 vezes
4. Na 4ª tentativa, inserir senha correta

Resultado esperado: Conta bloqueada após 3 tentativas falhas
Resultado atual: Login realizado normalmente sem bloqueio

Severidade: Alta | Prioridade: Alta
Evidência: [print/vídeo]

**O que NÃO fazer:**
- Título vago: "Botão não funciona"
- Passos incompletos
- Sem resultado esperado
- Sem evidência

---

## Sandbox para praticar
- ParaBank (sistema bancário de testes): https://parabank.parasoft.com/parabank/index.htm
  Login: john / demo

## Links de Apoio
- Bug Life Cycle: https://www.guru99.com/defect-life-cycle.html

## Curso Alura
https://www.alura.com.br/curso-online-fundamentos-qualidade-software

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Bug lifecycle + estrutura do bug report
- Bloco 2 (13h–16h): Prática no ParaBank — encontrar e reportar bugs reais`);

  await addChecklist(d3, '📚 Conteúdo para estudar', [
    'Estudar os estados do Bug Lifecycle (Novo → Fechado)',
    'Entender a diferença entre Severidade e Prioridade',
    'Aprender a estrutura completa de um bug report profissional',
    'Estudar o que NÃO fazer em um bug report',
    'Conhecer ferramentas de bug tracking: Jira, GitHub Issues, Linear',
  ]);
  await addChecklist(d3, '✏️ Exercícios práticos — ParaBank', [
    'Acessar parabank.parasoft.com e explorar o sistema',
    'Encontrar pelo menos 2 comportamentos estranhos ou erros',
    'Escrever bug report completo para cada bug encontrado',
    'Classificar cada bug com severidade e prioridade justificadas',
  ]);
  await addChecklist(d3, '✅ Critérios de conclusão', [
    'Sei escrever um bug report que qualquer dev consegue reproduzir',
    'Entendo a diferença entre severidade e prioridade',
    'Consigo identificar o estado atual de um bug no lifecycle',
  ]);
  console.log('Dia 3 completo!');

  // DIA 4
  const d4 = await createCard(backlogId, '📅 Dia 4 — Critérios de Aceite, BDD e Mentalidade de Teste', `## Objetivo do Dia
Dominar critérios de aceite no formato BDD e desenvolver a mentalidade destrutiva saudável do QA.

---

## Conceitos-Chave

**Critérios de Aceite**
Condições que o software deve satisfazer para ser aceito. Ponte entre o que o PO quer e o que o QA vai testar.

**Formato Given/When/Then (BDD)**

Given [contexto/pré-condição]
When  [ação do usuário]
Then  [resultado esperado]

Exemplo — Feature: Redefinir senha

Cenário 1 — E-mail válido:
Given usuário cadastrado com e-mail "jess@email.com"
When solicitar redefinição de senha
Then receber e-mail com link em até 2 minutos

Cenário 2 — E-mail inválido:
Given usuário na tela de recuperação
When inserir e-mail não cadastrado
Then exibir mensagem "E-mail não encontrado" sem revelar se existe

Cenário 3 — Link expirado:
Given link com mais de 24h
When tentar acessar o link
Then exibir "Link expirado" e oferecer novo envio

---

**Mentalidade Destrutiva Saudável**
O QA deve pensar como:
- Usuário descuidado: campos em branco, dados inválidos
- Usuário malicioso: limites extremos, fluxos inesperados
- Usuário criativo: ordem errada de ações, ações simultâneas

Técnicas:
- Boundary Testing: testar nos limites (0, 1, máximo, máximo+1)
- Negative Testing: o que acontece ao fazer o errado?

**Heurística SFDPOT**
S = Structure | F = Function | D = Data | P = Platform | O = Operations | T = Time

---

## Sandboxes para praticar
- The Internet: https://the-internet.herokuapp.com
- Evil Tester: https://testpages.eviltester.com

## Links de Apoio
- BDD e Given/When/Then: https://cucumber.io/docs/bdd/

## Curso Alura
https://www.alura.com.br/curso-online-fundamentos-qualidade-software

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Critérios de aceite + BDD
- Bloco 2 (13h–16h): Mentalidade destrutiva + exercícios práticos`);

  await addChecklist(d4, '📚 Conteúdo para estudar', [
    'Entender o que é um critério de aceite e por que importa',
    'Aprender o formato Given/When/Then (BDD)',
    'Praticar transformar user stories em critérios de aceite',
    'Identificar critérios de aceite ambíguos',
    'Desenvolver mentalidade destrutiva: usuário descuidado, malicioso e criativo',
    'Aprender a heurística SFDPOT',
    'Entender Boundary Testing e Negative Testing',
  ]);
  await addChecklist(d4, '✏️ Exercícios do dia', [
    'Escrever 3+ critérios BDD para: Redefinir senha por e-mail',
    'Escrever 3+ critérios BDD para: Adicionar produto ao carrinho',
    'Escrever 3+ critérios BDD para: Admin desativar usuário',
    'Explorar the-internet.herokuapp.com e documentar 5 cenários negativos',
  ]);
  await addChecklist(d4, '✅ Critérios de conclusão', [
    'Consigo escrever critérios de aceite no formato BDD',
    'Sei identificar quando um critério de aceite é ambíguo',
    'Tenho mentalidade de testar o que pode dar ERRADO, não só o que deve funcionar',
  ]);
  console.log('Dia 4 completo!');

  // DIA 5
  const d5 = await createCard(backlogId, '📅 Dia 5 — Revisão e Consolidação da Semana 1', `## Objetivo do Dia
Consolidar toda a Semana 1. Exercício integrador completo + curso da Alura.

---

## Mapa mental da Semana 1

QA Engineering
├── Papéis: QA vs QC vs Testing
├── Ciclos: SDLC → STLC
├── Estratégia: Pirâmide de Testes
├── Bugs: Lifecycle → Bug Report
├── Requisitos: Critérios de Aceite → BDD
└── Mentalidade: Destrutiva → SFDPOT

---

## Perguntas de revisão — responda sem consultar

1. Qual a diferença entre QA e Testing?
2. Explique o STLC com suas próprias palavras
3. Por que a pirâmide de testes tem mais testes de unidade na base?
4. Qual a diferença entre severidade e prioridade de um bug?
5. O que é um critério de aceite e por que ele importa?
6. Escreva um critério BDD para o fluxo de login

---

## Sandbox do exercício integrador
- Sauce Demo (e-commerce de testes): https://www.saucedemo.com
  Login: standard_user / secret_sauce

## Curso Alura
https://www.alura.com.br/curso-online-fundamentos-qualidade-software
Objetivo: assistir e anotar o que diferir ou complementar o que estudou.

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Revisão + exercício integrador
- Bloco 2 (13h–16h): Curso Alura + anotações finais`);

  await addChecklist(d5, '📝 Revisão teórica', [
    'Responder as 6 perguntas de revisão sem consultar o material',
    'Rever anotações dos dias 1 a 4 e completar o que estiver incompleto',
    'Criar mapa mental ou resumo visual da Semana 1',
  ]);
  await addChecklist(d5, '🏋️ Exercício integrador — Sauce Demo', [
    'Acessar saucedemo.com (user: standard_user / pass: secret_sauce)',
    'Escrever plano de teste resumido (escopo, o que testar, o que não testar)',
    'Escrever casos de teste para: login, adicionar produto, carrinho e checkout',
    'Encontrar e reportar 2+ bugs no formato profissional',
    'Produzir relatório final: sistema está pronto para release? Por quê?',
  ]);
  await addChecklist(d5, '🎓 Alura', [
    'Assistir: Fundamentos de Qualidade de Software',
    'Anotar conceitos que diferem ou complementam o que estudou',
    'Marcar curso como concluído na plataforma',
  ]);
  await addChecklist(d5, '✅ Critérios de conclusão da Semana 1', [
    'Consigo explicar QA com propriedade para alguém de fora da área',
    'Sei escrever um bug report profissional',
    'Sei escrever critérios de aceite em BDD',
    'Entendo a pirâmide de testes e quando usar cada tipo',
    'Tenho mentalidade de QA: penso no que pode dar errado',
  ]);
  console.log('Dia 5 completo!');
  console.log('\n✅ SEMANA 1 COMPLETA — 5 listas e 5 cards criados!');
}

main().catch(console.error);
