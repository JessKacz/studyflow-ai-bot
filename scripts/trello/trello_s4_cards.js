const https = require('https');

const KEY = 'SEU_TRELLO_KEY_AQUI';
const TOKEN = 'SEU_TRELLO_TOKEN_AQUI';
const S4_LIST = '6a1dba8f2b4f87e180d6d71a';

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

// DIA 16
const DESC_D16 = `## Objetivo do Dia
Entender HTTP de verdade: como a web funciona, métodos, status codes e headers — base para testar qualquer API.

---

## Conceitos-Chave

**Request/Response — o ciclo completo**
\`\`\`
Cliente                          Servidor
  |                                  |
  |-- GET /api/users HTTP/1.1 -----> |
  |   Headers: Authorization: ...   |
  |                                  |
  |<-- HTTP/1.1 200 OK ------------- |
  |    Content-Type: application/json|
  |    Body: [{"id":1,"name":"..."}] |
\`\`\`

---

**Métodos HTTP — o que cada um significa**

| Método | Semântica | Idempotente? | Body? |
|--------|-----------|-------------|-------|
| GET | Buscar recurso | Sim | Não |
| POST | Criar recurso | Não | Sim |
| PUT | Substituir recurso completo | Sim | Sim |
| PATCH | Atualizar parcialmente | Não | Sim |
| DELETE | Remover recurso | Sim | Não |

---

**Status Codes — os mais importantes para QA**

| Código | Significado | Quando ver |
|--------|-------------|-----------|
| 200 | OK | GET com sucesso |
| 201 | Created | POST com sucesso |
| 204 | No Content | DELETE com sucesso |
| 400 | Bad Request | Dados inválidos |
| 401 | Unauthorized | Sem/token inválido |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não existe |
| 409 | Conflict | Duplicidade |
| 422 | Unprocessable | Validação falhou |
| 500 | Internal Error | Bug no servidor |
| 503 | Service Unavailable | Servidor down |

---

**Headers importantes para QA**
- \`Content-Type: application/json\` — formato do body
- \`Authorization: Bearer <token>\` — autenticação JWT
- \`Accept: application/json\` — formato que o cliente aceita
- \`X-Request-ID: uuid\` — rastreamento de requisição

---

## Links de Apoio
- HTTP Cats (divertido): https://http.cat/
- MDN HTTP: https://developer.mozilla.org/pt-BR/docs/Web/HTTP
- Status Codes: https://httpstatuses.com/

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Teoria HTTP + analisar requests no DevTools
- Bloco 2 (13h–16h): Usar DevTools para inspecionar chamadas de API em sites reais`;

async function createD16(listId) {
  console.log('Criando Dia 16...');
  const id = await createCard(listId, '📅 Dia 16 — HTTP: A Fundação de Testes de API', DESC_D16);
  await addChecklist(id, '📚 Conteúdo para estudar', [
    'Ciclo Request/Response completo',
    'Métodos HTTP: GET, POST, PUT, PATCH, DELETE',
    'Status codes 2xx, 3xx, 4xx, 5xx — todos os principais',
    'Headers essenciais para QA: Content-Type, Authorization, Accept',
    'Diferença entre REST e SOAP (visão geral)',
  ]);
  await addChecklist(id, '✏️ Exercícios do dia', [
    'Abrir DevTools (F12) em https://www.saucedemo.com/ e inspeciar aba Network',
    'Identificar 3 requisições HTTP feitas pela página e analisar headers/status',
    'Abrir https://jsonplaceholder.typicode.com/ e entender a API pública',
    'Criar mapa mental dos status codes agrupados por família (2xx, 4xx, 5xx)',
    'Anotar: para cada método HTTP, escrever um exemplo de uso real',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão', [
    'Consigo explicar o ciclo Request/Response com exemplos',
    'Sei a diferença entre GET, POST, PUT, PATCH e DELETE',
    'Memorizo os status codes mais comuns e sei quando ocorrem',
    'Usei DevTools para inspecionar requisições reais',
  ]);
  console.log('Dia 16 OK!');
}

// DIA 17
const DESC_D17 = `## Objetivo do Dia
Instalar e dominar o Postman — a ferramenta número 1 de testes de API no mercado.

---

## Conceitos-Chave

**Postman — o que é e por que usar**
Postman é uma plataforma para construir, testar e documentar APIs. Permite:
- Fazer qualquer tipo de requisição HTTP visualmente
- Salvar e organizar requisições em Collections
- Usar variáveis de ambiente (tokens, URLs)
- Escrever scripts de testes automatizados
- Gerar documentação de API

---

**Interface do Postman — o que cada parte faz**
- **Collections**: pastas que organizam suas requisições por projeto
- **Environments**: conjuntos de variáveis (ex: dev, staging, prod)
- **Variables**: \`{{base_url}}\`, \`{{token}}\` — evitam repetição
- **Pre-request Script**: código JS que roda antes da requisição
- **Tests**: código JS que valida a resposta

---

**Primeiro teste no Postman**
\`\`\`javascript
// Aba "Tests" no Postman
pm.test("Status code é 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response é JSON", function () {
    pm.response.to.be.json;
});

pm.test("Body tem campo 'id'", function () {
    const json = pm.response.json();
    pm.expect(json).to.have.property('id');
});

pm.test("Tempo de resposta < 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
\`\`\`

---

**Configurando Environment**
1. New → Environment → "JSONPlaceholder DEV"
2. Adicionar variável: \`base_url\` = \`https://jsonplaceholder.typicode.com\`
3. Nas requisições, usar: \`{{base_url}}/users\`

---

## Links de Apoio
- Postman Learning Center: https://learning.postman.com/docs/getting-started/introduction/
- JSONPlaceholder (API pública para treino): https://jsonplaceholder.typicode.com/
- Download Postman: https://www.postman.com/downloads/

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Instalar Postman, configurar ambiente, primeiras requisições
- Bloco 2 (13h–16h): Criar Collection completa com testes para JSONPlaceholder`;

async function createD17(listId) {
  console.log('Criando Dia 17...');
  const id = await createCard(listId, '📅 Dia 17 — Postman: Ferramenta de Testes de API', DESC_D17);
  await addChecklist(id, '📚 Conteúdo para estudar', [
    'Instalar e configurar o Postman',
    'Entender a interface: Collections, Environments, Variables',
    'Criar e organizar requisições em Collections',
    'Escrever testes básicos com pm.test() e pm.expect()',
    'Usar variáveis de ambiente para URLs e tokens',
  ]);
  await addChecklist(id, '✏️ Exercícios do dia', [
    'Instalar Postman e criar conta gratuita',
    'Criar Environment "JSONPlaceholder" com variável base_url',
    'Criar Collection "JSONPlaceholder API" com pastas por recurso',
    'GET /users — testar status 200, response JSON, campo "id" presente',
    'GET /users/1 — testar dados específicos do usuário',
    'GET /users/999 — testar status 404',
    'POST /posts — criar post e testar status 201 e body retornado',
    'Adicionar testes de tempo de resposta em todas as requisições',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão', [
    'Postman instalado e configurado com Environment',
    'Collection com 6+ requisições e testes em cada uma',
    'Todos os testes pm.test() passando ou falhando com descrição clara',
    'Collection exportada (.json) e commitada no GitHub',
  ]);
  console.log('Dia 17 OK!');
}

// DIA 18
const DESC_D18 = `## Objetivo do Dia
Testar APIs com autenticação, fluxos encadeados e validações avançadas — padrão do dia a dia em QA.

---

## Conceitos-Chave

**Tipos de Autenticação em APIs**

| Tipo | Como funciona | Onde usar |
|------|--------------|-----------|
| API Key | Header ou query param fixo | Serviços simples |
| Bearer Token (JWT) | \`Authorization: Bearer <token>\` | Apps modernos |
| Basic Auth | \`Authorization: Basic base64(user:pass)\` | APIs legadas |
| OAuth 2.0 | Fluxo de autorização complexo | Apps de terceiros |

---

**Fluxo de login → usar token → logout**
\`\`\`javascript
// Pre-request Script (no GET protegido)
// Pega o token do Environment salvo pelo login

// Tests no POST /auth/login:
pm.test("Login bem sucedido", () => {
    pm.response.to.have.status(200);
    const token = pm.response.json().token;
    pm.environment.set("auth_token", token);
    pm.expect(token).to.be.a("string");
});

// Headers na requisição protegida:
// Authorization: Bearer {{auth_token}}
\`\`\`

---

**Validações avançadas com Chai (no Postman)**
\`\`\`javascript
const json = pm.response.json();

// Estrutura
pm.expect(json).to.be.an("object");
pm.expect(json.users).to.be.an("array");
pm.expect(json.users).to.have.lengthOf.above(0);

// Valores específicos
pm.expect(json.user.email).to.include("@");
pm.expect(json.user.age).to.be.above(0);
pm.expect(json.status).to.equal("active");

// Campos obrigatórios
["id", "name", "email", "created_at"].forEach(field => {
    pm.expect(json).to.have.property(field);
});
\`\`\`

---

**API para praticar autenticação**
- ReqRes: https://reqres.in/ — tem login, cadastro, tokens

---

## Links de Apoio
- JWT Explained: https://jwt.io/introduction
- Postman Auth: https://learning.postman.com/docs/sending-requests/authorization/
- ReqRes API docs: https://reqres.in/

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Teoria de autenticação + JWT + tipos de auth
- Bloco 2 (13h–16h): Praticar fluxo completo login→autenticado→logout com ReqRes`;

async function createD18(listId) {
  console.log('Criando Dia 18...');
  const id = await createCard(listId, '📅 Dia 18 — APIs com Autenticação e Fluxos Encadeados', DESC_D18);
  await addChecklist(id, '📚 Conteúdo para estudar', [
    'Tipos de autenticação: API Key, Bearer Token, Basic Auth, OAuth 2.0',
    'Como funciona JWT (header.payload.signature)',
    'Salvar token do login em variável de Environment no Postman',
    'Usar token em requisições subsequentes via {{auth_token}}',
    'Validações avançadas com Chai no Postman',
  ]);
  await addChecklist(id, '✏️ Exercícios do dia', [
    'POST https://reqres.in/api/login — fazer login e salvar token',
    'Usar token salvo para GET /api/users (header Authorization)',
    'Testar login com credenciais inválidas — validar erro 400',
    'Criar fluxo: Login → Listar usuários → Criar usuário → Deletar usuário',
    'Validar que todos os campos obrigatórios existem na resposta',
    'Testar comportamento com token expirado/inválido',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão', [
    'Fluxo completo Login → Autenticado → Logout funcionando no Postman',
    'Token sendo salvo automaticamente via Tests do endpoint de login',
    'Validações Chai cobrindo estrutura, tipos e valores',
    'Collection atualizada e exportada no GitHub',
  ]);
  console.log('Dia 18 OK!');
}

// DIA 19
const DESC_D19 = `## Objetivo do Dia
Aprender a testar APIs de forma sistemática: casos de borda, testes negativos e o que o QA deve sempre verificar.

---

## Conceitos-Chave

**O QA de API não testa só o happy path**

Para cada endpoint, pensar em:
1. **Happy path**: tudo certo, resposta esperada
2. **Dados inválidos**: tipos errados, campos faltando, formato incorreto
3. **Limites**: campos muito longos, números negativos, zero
4. **Autenticação**: sem token, token expirado, token de outro usuário
5. **Autorização**: usuário sem permissão tentando acessar recurso
6. **Concorrência**: múltiplas requisições simultâneas (básico)

---

**Checklist de testes para um endpoint POST**

\`\`\`
POST /api/users
✓ Body válido → 201 Created + body correto
✓ Campos obrigatórios ausentes → 400 Bad Request + mensagem
✓ Email inválido → 422 Unprocessable
✓ Email já cadastrado → 409 Conflict
✓ Campo com string vazia → validação correta
✓ Campo com valor nulo → validação correta
✓ Campo além do limite de caracteres → validação
✓ Sem autenticação → 401 Unauthorized
✓ Token inválido → 401 Unauthorized
✓ Sem permissão → 403 Forbidden
✓ Dados com caracteres especiais → sem crash, resposta segura
✓ SQL injection básico → sem expor dados
✓ Tempo de resposta < 500ms
✓ Content-Type correto no response
\`\`\`

---

**Testes de contrato de API**
Verificar que a API mantém o "contrato" prometido:
- Mesmos campos sempre presentes
- Mesmos tipos (string não vira int)
- Mesmo comportamento entre versões

\`\`\`javascript
// Postman — validar schema
const schema = {
    type: "object",
    required: ["id", "name", "email"],
    properties: {
        id: { type: "number" },
        name: { type: "string" },
        email: { type: "string" }
    }
};

pm.test("Schema válido", () => {
    pm.response.to.have.jsonSchema(schema);
});
\`\`\`

---

## Links de Apoio
- API Testing Checklist: https://www.guru99.com/api-testing.html
- OWASP API Security Top 10: https://owasp.org/www-project-api-security/

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Teoria + criar checklist pessoal de testes de API
- Bloco 2 (13h–16h): Aplicar checklist completo na API do ReqRes`;

async function createD19(listId) {
  console.log('Criando Dia 19...');
  const id = await createCard(listId, '📅 Dia 19 — Testes de API: Sistemático e Completo', DESC_D19);
  await addChecklist(id, '📚 Conteúdo para estudar', [
    'As 6 dimensões de teste de API (happy path até concorrência)',
    'Checklist completo para endpoints POST, GET, PUT, DELETE',
    'Testes de contrato com jsonSchema no Postman',
    'OWASP API Security Top 10 — visão geral dos riscos',
    'Como organizar casos de teste de API em Collections',
  ]);
  await addChecklist(id, '✏️ Exercícios do dia', [
    'Criar sua checklist pessoal de testes de API em Markdown',
    'Aplicar checklist completo no POST /api/users do ReqRes',
    'Testar todos os cenários negativos: sem auth, token inválido, body errado',
    'Implementar validação de schema (jsonSchema) em 3 endpoints',
    'Criar pasta "Testes Negativos" na Collection com casos documentados',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão', [
    'Checklist pessoal de testes de API criada e documentada',
    'Apliquei 10+ casos de teste (positivos e negativos) em um endpoint',
    'Validação de schema implementada',
    'Todos os cenários organizados na Collection do Postman',
    'Material no GitHub',
  ]);
  console.log('Dia 19 OK!');
}

// DIA 20
const DESC_D20 = `## Objetivo do Dia
Projeto final do Módulo 1: ciclo completo de testes de API + retrospectiva geral + planejamento do próximo módulo.

---

## O Projeto: QA Completo da API do GitHub

A API do GitHub é pública, robusta e usada no mundo real — perfeito para portfolio.

**Base URL**: \`https://api.github.com\`
**Docs**: https://docs.github.com/en/rest

**Endpoints para testar:**
\`\`\`
GET  /users/{username}              # Dados de um usuário
GET  /users/{username}/repos        # Repositórios do usuário
GET  /repos/{owner}/{repo}          # Dados de um repo
GET  /repos/{owner}/{repo}/issues   # Issues do repo
GET  /search/repositories?q={query} # Busca de repos
\`\`\`

---

## Entregáveis do Projeto

**1. Collection Postman "GitHub API QA"** com:
- Environment configurado com base_url e seu token GitHub
- Pasta por recurso (Users, Repos, Issues, Search)
- Happy path + testes negativos em cada pasta
- Validações de schema, status code, tempo de resposta

**2. Bug Reports** (se encontrar comportamentos inesperados)

**3. Relatório de Cobertura**
\`\`\`markdown
# Relatório — GitHub API QA Testing

## Endpoints cobertos: X/Y
## Testes executados: XX
## Passou: XX (XX%)
## Casos negativos cobertos: XX

## Observações
[Comportamentos interessantes encontrados]
\`\`\`

**4. README do projeto no GitHub**
\`\`\`markdown
# GitHub API — Test Suite

Projeto de estudos de QA: testes de API usando Postman.

## O que está sendo testado
- Endpoints de usuários, repositórios, issues e busca
- Testes positivos e negativos
- Validação de schema, status codes e performance

## Como usar
1. Importar collection: \`github-api-tests.json\`
2. Importar environment: \`github-env.json\`
3. Configurar GITHUB_TOKEN no environment
4. Executar via Collection Runner
\`\`\`

---

## Retrospectiva do Módulo 1 (4 semanas)

Refletir profundamente sobre:
1. O que eu sabia antes vs o que sei agora?
2. Qual foi o aprendizado mais transformador?
3. Onde ainda me sinto insegura?
4. Estou pronta para avançar para automação? O que precisa reforçar?
5. O que vou mudar na minha rotina de estudos no próximo módulo?

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Construir Collection + executar todos os testes
- Bloco 2 (13h–16h): Relatório + README + retrospectiva do módulo`;

async function createD20(listId) {
  console.log('Criando Dia 20...');
  const id = await createCard(listId, '📅 Dia 20 — Projeto Final: QA Completo de API Real', DESC_D20);
  await addChecklist(id, '📚 Revisão do módulo API', [
    'Revisar métodos HTTP e status codes (Dia 16)',
    'Revisar Postman: Collections, Environments, pm.test() (Dia 17)',
    'Revisar autenticação e fluxos encadeados (Dia 18)',
    'Revisar checklist de testes sistemáticos (Dia 19)',
  ]);
  await addChecklist(id, '✏️ Entregáveis do projeto', [
    'Environment "GitHub API" configurado com base_url e token',
    'Pasta Users: GET /users/seu-usuario + testes completos',
    'Pasta Repos: GET /users/seu-usuario/repos + testes',
    'Pasta Repo Específico: GET /repos/{owner}/{repo} + testes',
    'Testes negativos: usuário inexistente → 404, endpoint inválido → status correto',
    'Validação de schema em pelo menos 3 endpoints',
    'Collection Runner executada — screenshot dos resultados',
    'Relatório de cobertura escrito',
    'README do projeto publicado no GitHub',
  ]);
  await addChecklist(id, '✅ Critérios de conclusão do Módulo 1', [
    'Collection Postman exportada e no GitHub',
    '20+ testes (positivos e negativos) passando',
    'README completo explicando o projeto',
    'Retrospectiva do Módulo 1 escrita honestamente',
    'LinkedIn atualizado com "Concluí Módulo 1 de QA" (post ou conquista)',
    'Pronta para iniciar Módulo 2: Pytest e automação!',
  ]);
  console.log('Dia 20 OK!');
}

// MAIN S4
async function main() {
  console.log('=== Criando cards S4 Backlog ===\n');
  await createD16(S4_LIST);
  await createD17(S4_LIST);
  await createD18(S4_LIST);
  await createD19(S4_LIST);
  await createD20(S4_LIST);
  console.log('\n=== S4 Completo! ===');
}

main().catch(console.error);
