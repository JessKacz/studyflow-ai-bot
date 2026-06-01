const https = require('https');

const KEY = 'SEU_TRELLO_KEY_AQUI';
const TOKEN = 'SEU_TRELLO_TOKEN_AQUI';
const S3_LIST = '6a1dba8e7e34abd1b0325cd2';

function trelloReq(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const sep = path.includes('?') ? '&' : '?';
    const fullPath = `/1${path}${sep}key=${KEY}&token=${TOKEN}`;
    const opts = {
      hostname: 'api.trello.com', path: fullPath, method,
      headers: data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}
    };
    const req = https.request(opts, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve(d); } });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function createCard(listId, name, desc) {
  const card = await trelloReq('POST', '/cards', { idList: listId, name, desc });
  await sleep(400);
  return card.id;
}

async function addChecklist(cardId, name, items) {
  const cl = await trelloReq('POST', `/cards/${cardId}/checklists`, { name });
  for (const item of items) {
    await trelloReq('POST', `/checklists/${cl.id}/checkItems`, { name: item });
    await sleep(150);
  }
  await sleep(300);
}

// ===== DIA 11 — Casos de Teste: Escrita Profissional =====
const DESC_D11 = `## Objetivo do Dia
Aprender a escrever casos de teste profissionais, seguindo os padrões usados em times reais de QA.

---

## Conceitos-Chave

**O que é um Caso de Teste?**
Um caso de teste documenta: qual condição estou testando, como reproduzir e qual resultado é esperado.
É a "receita de bolo" que qualquer pessoa pode seguir e obter o mesmo resultado.

---

**Estrutura de um Caso de Teste completo**

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| ID | Identificador único | TC-001 |
| Título | O que está sendo testado | Login com credenciais válidas |
| Pré-condições | O que precisa existir antes | Usuário cadastrado no sistema |
| Passos | Ações numeradas | 1. Acessar /login 2. Preencher email... |
| Dados de teste | Inputs específicos | email: test@qa.com, senha: Test@123 |
| Resultado Esperado | O que deve acontecer | Redirecionar para /dashboard |
| Resultado Obtido | O que aconteceu de fato | (preenchido na execução) |
| Status | Passou/Falhou/Bloqueado | Pass |
| Severidade | Se falhar, o quão grave é | Alta |
| Prioridade | Ordem de execução | P1 |

---

**Técnicas de design de casos de teste**

**Partição de Equivalência**: dividir inputs em grupos válidos e inválidos
- Senha: válido (8–20 chars), inválido (<8 chars), inválido (>20 chars)
- Testar um representante de cada grupo

**Análise de Valor de Fronteira (BVA)**: focar nos extremos
- Mínimo: 8 chars ✓, 7 chars ✗
- Máximo: 20 chars ✓, 21 chars ✗

**Tabela de Decisão**: combinar condições
- Usuário ativo + senha correta → Login OK
- Usuário ativo + senha errada → Erro
- Usuário inativo + senha correta → Conta bloqueada

---

## Links de Apoio
- Test Case Writing: https://www.guru99.com/test-case.html
- Test Design Techniques: https://www.softwaretestinghelp.com/what-is-boundary-value-analysis-and-equivalence-partitioning/

## Curso Alura
https://www.alura.com.br/curso-online-testes-manuais-fundamentos-profissional-qa

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Teoria + análise de exemplos reais
- Bloco 2 (13h–16h): Escrever casos de teste para sistema real`;

async function createD11(listId) {
  console.log('Criando Dia 11...');
  const id = await createCard(listId,
    '📅 Dia 11 — Casos de Teste: Escrita Profissional', DESC_D11);
  await addChecklist(id, '📚 Conteúdo para estudar', [
    'Entender a estrutura completa de um caso de teste',
    'Aprender Partição de Equivalência',
    'Aprender Análise de Valor de Fronteira (BVA)',
    'Entender Tabela de Decisão',
    'Diferenciar severidade de prioridade',
  ]);
  await addChecklist(id, '✏️ Exercícios do dia', [
    'Escrever 5 casos de teste para a tela de Login (usando https://the-internet.herokuapp.com/login)',
    'Aplicar Partição de Equivalência para campo de senha',
    'Aplicar BVA para campo de nome (mínimo e máximo de caracteres)',
    'Criar tabela de decisão para fluxo de login',
    'Organizar casos de teste em planilha Google Sheets ou Markdown',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão', [
    'Tenho 5+ casos de teste escritos seguindo a estrutura completa',
    'Apliquei pelo menos 2 técnicas de design (EP e BVA)',
    'Consigo explicar a diferença entre severidade e prioridade',
    'Material salvo e commitado no GitHub',
  ]);
  console.log('Dia 11 OK!');
}

// ===== DIA 12 — Bug Report: Arte de Reportar Defeitos =====
const DESC_D12 = `## Objetivo do Dia
Dominar a arte de escrever bug reports que devs amam — claros, reproduzíveis e com contexto suficiente.

---

## Conceitos-Chave

**O que torna um bug report excelente?**
Um bug ruim: "Login não funciona" — inútil.
Um bug bom: título claro + passos reproduzíveis + evidências + ambiente + impacto.

---

**Estrutura do Bug Report**

| Campo | Descrição |
|-------|-----------|
| ID | BUG-001 |
| Título | Verbo + objeto + condição — "Login falha ao usar email com letras maiúsculas" |
| Ambiente | Browser, SO, versão do app |
| Severidade | Crítica / Alta / Média / Baixa |
| Prioridade | P1 (urgente) a P4 (cosmético) |
| Pré-condições | O que precisa existir |
| Passos para reproduzir | Numerados e específicos |
| Resultado obtido | O que aconteceu |
| Resultado esperado | O que deveria acontecer |
| Evidências | Screenshot, vídeo, log |
| Frequência | Sempre / Às vezes / Uma vez |

---

**Severidade vs Prioridade — diferença crucial**

| | Severidade Alta | Severidade Baixa |
|--|--|--|
| Prioridade Alta | Crash na tela de pagamento | Typo no nome do CEO na homepage |
| Prioridade Baixa | Bug em feature beta não lançada | Cor errada em tooltip raramente usado |

---

**Títulos de bug report — boas práticas**
❌ "Botão não funciona"
✅ "Botão 'Salvar' não responde ao clique quando formulário tem campo vazio obrigatório"

❌ "Erro no login"
✅ "Login retorna erro 500 ao tentar autenticar usuário com email contendo caracteres especiais"

---

**Ferramentas de Bug Tracking**
- Jira (mais comum no mercado)
- GitHub Issues (muito usado em open source)
- Trello (times menores)
- Linear, Azure DevOps, Bugzilla

---

## Links de Apoio
- How to Write a Bug Report: https://www.guru99.com/how-to-write-a-bug-report.html
- Bug Severity vs Priority: https://www.softwaretestinghelp.com/what-is-the-difference-between-bug-severity-and-priority/

## Site para praticar (tem bugs reais propositais)
- https://the-internet.herokuapp.com/
- https://www.saucedemo.com/

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Teoria + analisar exemplos de bug reports bons e ruins
- Bloco 2 (13h–16h): Explorar sites de prática e reportar bugs reais`;

async function createD12(listId) {
  console.log('Criando Dia 12...');
  const id = await createCard(listId,
    '📅 Dia 12 — Bug Report: Arte de Reportar Defeitos', DESC_D12);
  await addChecklist(id, '📚 Conteúdo para estudar', [
    'Estrutura completa de um bug report profissional',
    'Diferença entre severidade e prioridade — com exemplos',
    'Como escrever títulos de bugs claros e acionáveis',
    'Como capturar e anexar evidências (screenshot, console log)',
    'Principais ferramentas de bug tracking do mercado',
  ]);
  await addChecklist(id, '✏️ Exercícios do dia', [
    'Explorar https://the-internet.herokuapp.com/ por 30 min em modo exploratório',
    'Encontrar pelo menos 3 comportamentos inesperados/bugs',
    'Escrever bug report completo para cada um no padrão profissional',
    'Classificar cada bug por severidade e prioridade com justificativa',
    'Salvar reports em Markdown no GitHub',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão', [
    'Tenho 3+ bug reports escritos no padrão profissional completo',
    'Todos os bugs têm passos reproduzíveis e evidências (screenshot)',
    'Consigo justificar a severidade e prioridade de cada bug',
    'Material salvo e organizado no GitHub',
  ]);
  console.log('Dia 12 OK!');
}

// ===== DIA 13 — Teste Exploratório e Heurísticas =====
const DESC_D13 = `## Objetivo do Dia
Aprender teste exploratório estruturado — a habilidade mais valorizada em QA manual sênior.

---

## Conceitos-Chave

**O que é Teste Exploratório?**
Não é "clicar em tudo aleatoriamente". É aprendizado + design + execução simultâneos, guiados por hipóteses e heurísticas.

James Bach: "Exploratório é qualquer teste na medida em que o testador é livre para variar os testes durante a execução."

---

**Session-Based Testing (SBET)**
Estrutura para exploração com propósito:
- **Charter**: missão da sessão ("Explorar o fluxo de cadastro focando em validações de campo")
- **Timebox**: tempo fixo (ex: 90 min)
- **Notas**: registrar o que fez, encontrou e aprendeu
- **Debriefing**: analisar o que cobriu e o que ficou de fora

---

**Heurísticas de Teste — SFDIPOT (San Francisco Depot)**

| Letra | Heurística | O que testar |
|-------|-----------|--------------|
| S | Structure | Estrutura do sistema, arquitetura |
| F | Function | O que o sistema faz (happy path e variações) |
| D | Data | Inputs: vazio, nulo, especial, limite, injeção |
| I | Interface | UI, UX, acessibilidade, responsividade |
| P | Platform | Browsers, SO, dispositivos, versões |
| O | Operations | Uso em produção: volume, carga, manutenção |
| T | Time | Timeouts, expiração de sessão, datas-limite |

---

**Heurística CRUD para dados**
- Create (criar registro)
- Read (ler/exibir registro)
- Update (editar registro)
- Delete (excluir registro)
Para cada entidade, testar todas as 4 operações!

---

**Notas de sessão exploratória**
\`\`\`
Charter: Explorar tela de cadastro — foco em validações
Timebox: 90 min — 09h00 às 10h30
Testador: Jess
Ambiente: Chrome 124, Windows 11

DESCOBERTAS:
- BUG-001: Campo email aceita formato inválido (sem @)
- BUG-002: Senha não tem feedback de força
- NOTA: Formulário sem autofill — UX ruim para mobile

COBERTURA: cadastro happy path ✓, validações ✓, mobile ✗
PRÓXIMA SESSÃO: testar em Firefox e mobile
\`\`\`

---

## Links de Apoio
- Session-Based Testing: https://www.satisfice.com/download/session-based-test-management
- Heurísticas SFDIPOT: https://www.developsense.com/resources/Heuristic-Test-Strategy-Model.pdf

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Teoria + aprender SBET e heurísticas
- Bloco 2 (13h–16h): Conduzir 2 sessões exploratórias em site de prática`;

async function createD13(listId) {
  console.log('Criando Dia 13...');
  const id = await createCard(listId,
    '📅 Dia 13 — Teste Exploratório e Heurísticas', DESC_D13);
  await addChecklist(id, '📚 Conteúdo para estudar', [
    'Definição de teste exploratório e diferença de teste scripted',
    'Session-Based Testing: charter, timebox, notas e debriefing',
    'Heurísticas SFDIPOT — uma por uma com exemplos',
    'Heurística CRUD aplicada a sistemas com dados',
    'Como documentar uma sessão exploratória',
  ]);
  await addChecklist(id, '✏️ Exercícios do dia', [
    'Criar charter para sessão exploratória em https://www.saucedemo.com/',
    'Conduzir sessão de 60 min com timebox definido e anotar descobertas',
    'Aplicar heurística SFDIPOT: cobrir pelo menos 4 dimensões',
    'Aplicar CRUD para o módulo de produtos do saucedemo',
    'Escrever relatório da sessão com cobertura e próximos passos',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão', [
    'Conduzi sessão exploratória real com charter e timebox definidos',
    'Documentei descobertas, bugs e áreas não cobertas',
    'Apliquei pelo menos 4 heurísticas SFDIPOT',
    'Entendo por que teste exploratório ≠ teste aleatório',
  ]);
  console.log('Dia 13 OK!');
}

// ===== DIA 14 — Planos de Teste e Documentação QA =====
const DESC_D14 = `## Objetivo do Dia
Aprender a criar documentação QA profissional: plano de teste, suíte de testes e relatório de execução.

---

## Conceitos-Chave

**Hierarquia da documentação QA**
\`\`\`
Plano de Teste (estratégia geral)
└── Suíte de Testes (grupo de casos relacionados)
    └── Caso de Teste (cenário específico)
        └── Passo de Teste (ação individual)
\`\`\`

---

**Plano de Teste — seções essenciais**

1. **Escopo**: o que VAI e o que NÃO VAI ser testado
2. **Objetivos**: o que queremos garantir
3. **Abordagem**: tipos de teste, ferramentas, ambiente
4. **Cronograma**: quando, quem faz o quê
5. **Critérios de entrada**: o que precisa estar pronto para começar
6. **Critérios de saída**: quando os testes estão "prontos"
7. **Riscos**: o que pode dar errado e mitigações

---

**Critérios de entrada e saída (Definition of Done para QA)**

Critérios de entrada:
- Ambiente de teste disponível e estável
- Build implantado e acessível
- Dados de teste preparados
- Casos de teste revisados e aprovados

Critérios de saída (exemplo rigoroso):
- 100% dos casos de teste executados
- 0 bugs críticos abertos
- Taxa de defeitos abaixo de X%
- Regressão automatizada passou

---

**Relatório de Execução — métricas que importam**

| Métrica | Como calcular |
|---------|--------------|
| Taxa de aprovação | (Passou / Total) × 100 |
| Taxa de falha | (Falhou / Total) × 100 |
| Cobertura de requisitos | Requisitos testados / Total |
| Densidade de defeitos | Bugs / Pontos de função |

---

**Template de Suíte de Testes em Markdown**
\`\`\`markdown
# Suite: Autenticação de Usuários

## TC-001 — Login com credenciais válidas
**Prioridade**: P1 | **Severidade**: Alta
**Pré-condições**: Usuário ativo cadastrado
**Passos**:
1. Acessar /login
2. Inserir email: valid@test.com
3. Inserir senha: Valid@123
4. Clicar em "Entrar"
**Esperado**: Redirecionar para /dashboard com nome do usuário
**Status**: [ ] Pendente
\`\`\`

---

## Links de Apoio
- Test Plan Template: https://www.guru99.com/what-everybody-ought-to-know-about-test-planing.html
- IEEE 829 (padrão de documentação): https://en.wikipedia.org/wiki/Software_test_documentation

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Teoria + analisar templates reais de planos de teste
- Bloco 2 (13h–16h): Criar plano de teste + suíte para projeto fictício`;

async function createD14(listId) {
  console.log('Criando Dia 14...');
  const id = await createCard(listId,
    '📅 Dia 14 — Planos de Teste e Documentação QA', DESC_D14);
  await addChecklist(id, '📚 Conteúdo para estudar', [
    'Hierarquia: Plano → Suíte → Caso → Passo',
    'Seções de um plano de teste profissional',
    'Critérios de entrada e saída (Definition of Done QA)',
    'Métricas de qualidade: taxa de aprovação, cobertura, densidade de defeitos',
    'Padrão de documentação IEEE 829 (visão geral)',
  ]);
  await addChecklist(id, '✏️ Exercícios do dia', [
    'Criar Plano de Teste para o site https://www.saucedemo.com/ (todas as seções)',
    'Criar Suíte de Testes "Autenticação" com 6+ casos de teste',
    'Criar Suíte de Testes "Carrinho de Compras" com 5+ casos de teste',
    'Definir critérios de entrada e saída para o projeto',
    'Salvar toda a documentação em Markdown no GitHub',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão', [
    'Plano de Teste criado com todas as seções preenchidas',
    'Duas suítes com 11+ casos de teste no total',
    'Critérios de entrada e saída definidos claramente',
    'Documentação organizada e commitada no GitHub',
  ]);
  console.log('Dia 14 OK!');
}

// ===== DIA 15 — Projeto S3: Ciclo Completo de Testes Manuais =====
const DESC_D15 = `## Objetivo do Dia
Executar um ciclo completo de QA manual: planejar → escrever → executar → reportar → retrospectiva.

---

## O Projeto: QA Completo do SauceDemo

O SauceDemo (https://www.saucedemo.com/) é uma loja virtual de demonstração criada pela Sauce Labs especialmente para treino de QA. Tem bugs propositais e fluxos completos.

**Credenciais de teste:**
- standard_user / secret_sauce (usuário normal)
- locked_out_user / secret_sauce (usuário bloqueado)
- problem_user / secret_sauce (usuário com problemas visuais)
- performance_glitch_user / secret_sauce (usuário com lentidão)

---

## Entregáveis do Projeto

**1. Plano de Teste** (revisado e finalizado do Dia 14)

**2. Suítes de Teste** cobrindo:
- Autenticação (login, logout, usuários diferentes)
- Catálogo de Produtos (listagem, ordenação, filtros)
- Carrinho de Compras (adicionar, remover, atualizar)
- Checkout (fluxo completo, validações, confirmação)

**3. Execução e Bug Reports**
- Executar todos os casos de teste
- Registrar Pass/Fail com evidências
- Bug report completo para cada falha encontrada

**4. Relatório Final**
\`\`\`markdown
# Relatório de Execução — SauceDemo QA

**Data**: xx/xx/xxxx
**Testadora**: Jessica
**Ambiente**: Chrome 124, Windows 11

## Resumo
- Total de casos: XX
- Passou: XX (XX%)
- Falhou: XX (XX%)
- Bloqueado: XX

## Bugs encontrados
| ID | Título | Severidade | Status |
|----|--------|------------|--------|
| BUG-001 | ... | Alta | Aberto |

## Conclusão
[Avaliação: o sistema está pronto para produção? Por quê?]
\`\`\`

**5. Retrospectiva da Semana 3**
- O que aprendi de mais importante?
- Que habilidade ainda preciso fortalecer?
- O que vou aplicar de diferente na próxima semana?

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Executar testes + registrar resultados
- Bloco 2 (13h–16h): Escrever bug reports + relatório final + retrospectiva`;

async function createD15(listId) {
  console.log('Criando Dia 15...');
  const id = await createCard(listId,
    '📅 Dia 15 — Projeto S3: Ciclo Completo de Testes Manuais', DESC_D15);
  await addChecklist(id, '📚 Revisão da semana', [
    'Revisar estrutura de caso de teste (Dia 11)',
    'Revisar estrutura de bug report (Dia 12)',
    'Revisar heurísticas SFDIPOT e CRUD (Dia 13)',
    'Revisar plano de teste e métricas (Dia 14)',
  ]);
  await addChecklist(id, '✏️ Entregáveis do projeto', [
    'Plano de Teste finalizado para SauceDemo',
    'Suíte "Autenticação": 6+ casos de teste executados',
    'Suíte "Produtos": 5+ casos de teste executados',
    'Suíte "Carrinho": 5+ casos de teste executados',
    'Suíte "Checkout": 6+ casos de teste executados',
    'Bug reports para todos os bugs encontrados (espere achar pelo menos 5)',
    'Relatório de execução com métricas preenchidas',
    'Retrospectiva da Semana 3 escrita',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão', [
    '22+ casos de teste executados com resultado registrado',
    '5+ bug reports completos com evidências',
    'Relatório final com métricas (taxa de aprovação, bugs por suíte)',
    'Todo material commitado e organizado no GitHub',
    'Retrospectiva honesta escrita em RETROSPECTIVA.md',
    'Portfolio: README do projeto atualizado descrevendo o que fez',
  ]);
  console.log('Dia 15 OK!');
}

// ===== MAIN S3 =====
async function main() {
  console.log('=== Criando cards S3 Backlog ===\n');
  await createD11(S3_LIST);
  await createD12(S3_LIST);
  await createD13(S3_LIST);
  await createD14(S3_LIST);
  await createD15(S3_LIST);
  console.log('\n=== S3 Completo! ===');
}

main().catch(console.error);
