const https = require('https');

const KEY = 'SEU_TRELLO_KEY_AQUI';
const TOKEN = 'SEU_TRELLO_TOKEN_AQUI';

// IDs dos cards S2 já existentes
const CARDS = {
  d6:  '6a1dd8df50ab7ba2ecada34b',
  d7:  '6a1dd8edebf269ca50c148a0',
  d8:  '6a1dd932d21447429c97d55d',
  d9:  '6a1dd9342ced0bc98fdf8e65',
  d10: '6a1dd9356f4c3fe17d7cecca',
};

function trelloReq(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const sep = path.includes('?') ? '&' : '?';
    const fullPath = `/1${path}${sep}key=${KEY}&token=${TOKEN}`;
    const opts = {
      hostname: 'api.trello.com',
      path: fullPath,
      method,
      headers: data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}
    };
    const req = https.request(opts, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => {
        try { resolve(JSON.parse(d)); }
        catch(e) { resolve(d); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function updateDesc(cardId, desc) {
  await trelloReq('PUT', `/cards/${cardId}`, { desc });
  await sleep(300);
}

async function addChecklist(cardId, name, items) {
  const cl = await trelloReq('POST', `/cards/${cardId}/checklists`, { name });
  for (const item of items) {
    await trelloReq('POST', `/checklists/${cl.id}/checkItems`, { name: item });
    await sleep(150);
  }
  await sleep(300);
}

// ===== DIA 6 =====
const DESC_D6 = `## Objetivo do Dia
Dominar o fluxo de trabalho com Git — do init ao pull request — com foco no contexto real de times de QA.

---

## Conceitos-Chave

**Por que Git é essencial para QA?**
- Versionar casos de teste, scripts de automação e relatórios de bugs
- Colaborar com devs sem sobrescrever trabalho alheio
- Entender o histórico: quando um bug foi introduzido? qual commit?

---

**Fluxo Git na prática**

\`\`\`bash
git init / git clone <repo>     # Inicia ou clona repositório
git status                      # Vê o que mudou
git add .                       # Stageia mudanças
git commit -m "mensagem clara"  # Salva snapshot
git push origin main            # Envia ao remoto
git pull                        # Atualiza local
git branch feature/login-test   # Cria branch
git checkout feature/login-test # Muda de branch
git merge feature/login-test    # Integra branch
\`\`\`

---

**Boas mensagens de commit (padrão Conventional Commits)**
- \`feat: adiciona teste E2E para login\`
- \`fix: corrige seletor do botão de submit\`
- \`test: adiciona casos de borda para formulário\`
- \`docs: atualiza README com instruções de setup\`

---

**Branches e Pull Request**
- main/master: código estável
- develop: integração contínua
- feature/xxx: sua feature ou teste
- PR = pedido de revisão antes de merge

---

## Links de Apoio
- Git - Guia Prático: https://rogerdudler.github.io/git-guide/index.pt_BR.html
- Conventional Commits: https://www.conventionalcommits.org/pt-br/
- GitHub Skills (gratuito): https://skills.github.com/

## Curso Alura
https://www.alura.com.br/curso-online-git-github-controle-e-compartilhe-seu-codigo

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Teoria Git + instalar/configurar git local
- Bloco 2 (13h–16h): Criar repo no GitHub, simular fluxo completo`;

async function fillD6(cardId) {
  console.log('Atualizando Dia 6...');
  await updateDesc(cardId, DESC_D6);
  await addChecklist(cardId, '📚 Conteúdo para estudar', [
    'Instalar e configurar Git (user.name, user.email)',
    'Entender a diferença entre repositório local e remoto',
    'Aprender o fluxo: init → add → commit → push',
    'Praticar criação e troca de branches',
    'Entender o que é um Pull Request e por que existe',
    'Aprender o padrão Conventional Commits',
  ]);
  await addChecklist(cardId, '✏️ Exercícios do dia', [
    'Criar repositório "qa-estudos" no GitHub',
    'Criar arquivo README.md descrevendo seu plano de estudos',
    'Fazer pelo menos 3 commits com mensagens no padrão Conventional Commits',
    'Criar branch "feature/semana1-notas", adicionar anotações e fazer merge',
    'Simular conflito de merge simples e resolver',
  ]);
  await addChecklist(cardId, '✅ Critérios de conclusão', [
    'Tenho repositório "qa-estudos" público no GitHub com commits reais',
    'Consigo fazer o fluxo completo sem consultar tutorial',
    'Sei escrever mensagens de commit no padrão Conventional Commits',
    'Entendo o conceito de branch e PR no contexto de times',
  ]);
  console.log('Dia 6 OK!');
}

// ===== DIA 7 =====
const DESC_D7 = `## Objetivo do Dia
Dominar o terminal (bash/zsh) para o dia a dia de QA e configurar o VS Code como ambiente profissional de trabalho.

---

## Conceitos-Chave

**Terminal — comandos essenciais para QA**

\`\`\`bash
# Navegação
pwd             # onde estou
ls -la          # lista tudo incluindo ocultos
cd caminho/     # navega para pasta
cd ..           # sobe um nível

# Arquivos
mkdir pasta     # cria pasta
touch arquivo   # cria arquivo
cp orig dest    # copia
mv orig dest    # move ou renomeia
rm arquivo      # apaga (cuidado!)
cat arquivo     # exibe conteúdo
grep "texto" arquivo  # busca texto em arquivo

# Processos e rede
ps aux          # processos rodando
kill PID        # mata processo
curl URL        # faz requisição HTTP
ping dominio    # verifica conectividade
\`\`\`

---

**VS Code para QA — extensões essenciais**
- **Python** (Microsoft): syntax, linting, debug
- **Pylance**: IntelliSense avançado para Python
- **GitLens**: visualiza histórico git inline
- **REST Client**: testa APIs direto no editor
- **Prettier**: formata código automaticamente
- **Material Icon Theme**: ícones por tipo de arquivo

---

**Estrutura de projeto QA**
\`\`\`
qa-estudos/
├── tests/
│   ├── manual/          # casos de teste manuais
│   ├── api/             # testes de API
│   └── e2e/             # testes end-to-end
├── reports/             # relatórios de bugs
├── docs/                # documentação
└── README.md
\`\`\`

---

## Links de Apoio
- Terminal Básico: https://ubuntu.com/tutorials/command-line-for-beginners
- VS Code Tips: https://code.visualstudio.com/docs/getstarted/tips-and-tricks
- Shell Scripting Cheatsheet: https://devhints.io/bash

## Curso Alura
https://www.alura.com.br/curso-online-linux-ubuntu-ambiente-shell

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Terminal — praticar todos os comandos essenciais
- Bloco 2 (13h–16h): Configurar VS Code + criar estrutura de projeto no repo GitHub`;

async function fillD7(cardId) {
  console.log('Atualizando Dia 7...');
  await updateDesc(cardId, DESC_D7);
  await addChecklist(cardId, '📚 Conteúdo para estudar', [
    'Navegar pelo sistema de arquivos via terminal',
    'Criar, copiar, mover e apagar arquivos/pastas via terminal',
    'Usar grep para buscar texto em arquivos',
    'Instalar e configurar VS Code com extensões essenciais para QA',
    'Entender a estrutura ideal de um projeto de QA',
  ]);
  await addChecklist(cardId, '✏️ Exercícios do dia', [
    'Criar estrutura completa de pastas "qa-estudos" via terminal',
    'Commitar a estrutura no repositório GitHub',
    'Instalar todas as extensões listadas no VS Code',
    'Criar um arquivo .txt com anotações usando só o terminal (touch + echo)',
    'Usar grep para encontrar uma palavra em múltiplos arquivos',
  ]);
  await addChecklist(cardId, '✅ Critérios de conclusão', [
    'Navego por pastas e manipulo arquivos sem usar interface gráfica',
    'VS Code configurado com todas as extensões do dia',
    'Estrutura de projeto criada e commitada no GitHub',
    'Me sinto confortável abrindo o terminal sem medo',
  ]);
  console.log('Dia 7 OK!');
}

// ===== DIA 8 =====
const DESC_D8 = `## Objetivo do Dia
Aprender Python do zero focado em QA: variáveis, tipos de dados, estruturas condicionais e listas/dicionários.

---

## Conceitos-Chave

**Por que Python para QA?**
- Linguagem padrão de automação de testes (Pytest, Selenium, Playwright)
- Scripts para gerar massa de dados, parsear logs, automatizar tarefas
- Simples, legível, mercado valoriza muito

---

**Variáveis e Tipos**
\`\`\`python
nome = "Jessica"        # str (texto)
idade = 30              # int (inteiro)
altura = 1.65           # float (decimal)
ativo = True            # bool (verdadeiro/falso)
nada = None             # NoneType (ausência de valor)

# Verificar tipo
print(type(nome))       # <class 'str'>
\`\`\`

---

**Estruturas de Dados**
\`\`\`python
# Lista (ordenada, mutável)
bugs = ["login falhou", "botão sumiu", "timeout na API"]
bugs.append("erro 500")
print(bugs[0])          # login falhou

# Dicionário (chave: valor)
bug = {
    "id": 101,
    "titulo": "Login falha com email inválido",
    "severidade": "alta",
    "status": "aberto"
}
print(bug["titulo"])
\`\`\`

---

**Condicionais**
\`\`\`python
status_code = 404

if status_code == 200:
    print("Sucesso!")
elif status_code == 404:
    print("Não encontrado")
elif status_code >= 500:
    print("Erro no servidor — reportar bug!")
else:
    print(f"Status inesperado: {status_code}")
\`\`\`

---

## Links de Apoio
- Python para Iniciantes: https://docs.python.org/pt-br/3/tutorial/
- Exercícios práticos: https://www.hackerrank.com/domains/python
- Cheatsheet: https://www.pythoncheatsheet.org/

## Curso Alura
https://www.alura.com.br/curso-online-python-3-introducao-a-nova-versao-da-linguagem

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Variáveis, tipos e estruturas condicionais
- Bloco 2 (13h–16h): Listas, dicionários e exercícios práticos`;

async function fillD8(cardId) {
  console.log('Atualizando Dia 8...');
  await updateDesc(cardId, DESC_D8);
  await addChecklist(cardId, '📚 Conteúdo para estudar', [
    'Entender variáveis e os tipos de dados principais em Python',
    'Usar print() e f-strings para exibir informações',
    'Criar e manipular listas (append, remove, indexação)',
    'Criar e acessar dicionários',
    'Escrever estruturas if/elif/else',
  ]);
  await addChecklist(cardId, '✏️ Exercícios do dia', [
    'Criar dicionário representando um bug report com 6+ campos',
    'Criar lista com 5 cenários de teste e imprimir cada um',
    'Escrever função que recebe status_code e retorna descrição do status HTTP',
    'Criar lista de bugs e filtrar os de severidade "alta" com condicional',
  ]);
  await addChecklist(cardId, '✅ Critérios de conclusão', [
    'Consigo criar e manipular listas e dicionários sem consultar tutorial',
    'Escrevo estruturas condicionais corretamente',
    'Entendo por que Python é útil para QA',
    'Scripts salvos e commitados no GitHub',
  ]);
  console.log('Dia 8 OK!');
}

// ===== DIA 9 =====
const DESC_D9 = `## Objetivo do Dia
Avançar em Python com loops, funções e módulos — ferramentas que você vai usar toda hora em automação de testes.

---

## Conceitos-Chave

**Loops**
\`\`\`python
# for — quando sei quantas iterações
cenarios = ["login válido", "senha errada", "usuário bloqueado"]
for cenario in cenarios:
    print(f"Executando: {cenario}")

# range() — iterar N vezes
for i in range(1, 6):
    print(f"Teste {i}")

# while — quando não sei quantas iterações
tentativas = 0
while tentativas < 3:
    print(f"Tentativa {tentativas + 1}")
    tentativas += 1
\`\`\`

---

**Funções**
\`\`\`python
# Definindo e chamando funções
def verificar_status(code):
    """Retorna descrição do status HTTP"""
    status_map = {
        200: "OK",
        201: "Created",
        400: "Bad Request",
        401: "Unauthorized",
        404: "Not Found",
        500: "Internal Server Error"
    }
    return status_map.get(code, f"Status desconhecido: {code}")

print(verificar_status(404))  # Not Found
print(verificar_status(201))  # Created

# Funções com múltiplos parâmetros e valor padrão
def criar_bug(titulo, severidade="media", status="aberto"):
    return {"titulo": titulo, "severidade": severidade, "status": status}
\`\`\`

---

**Módulos essenciais para QA**
\`\`\`python
import json          # parsear respostas de API
import os            # variáveis de ambiente, paths
import datetime      # timestamps em relatórios
import random        # gerar dados de teste
import re            # regex para validar formatos

# Exemplo prático: parsear resposta JSON de API
resposta = '{"id": 1, "nome": "Jessica", "ativo": true}'
dados = json.loads(resposta)
print(dados["nome"])  # Jessica
\`\`\`

---

## Links de Apoio
- Python Funções: https://docs.python.org/pt-br/3/tutorial/controlflow.html#defining-functions
- Módulos built-in: https://docs.python.org/pt-br/3/py-modindex.html
- Exercícios: https://www.hackerrank.com/domains/python

## Curso Alura
https://www.alura.com.br/curso-online-python-3-avancando-na-linguagem

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Loops for/while e list comprehension
- Bloco 2 (13h–16h): Funções, parâmetros, return e módulos JSON/OS`;

async function fillD9(cardId) {
  console.log('Atualizando Dia 9...');
  await updateDesc(cardId, DESC_D9);
  await addChecklist(cardId, '📚 Conteúdo para estudar', [
    'Dominar loops for e while com break/continue',
    'Criar funções com parâmetros, retorno e docstrings',
    'Entender escopo de variáveis (local vs global)',
    'Usar módulos: json, os, datetime, random',
    'Parsear JSON simulando resposta de API',
  ]);
  await addChecklist(cardId, '✏️ Exercícios do dia', [
    'Criar função que recebe lista de bugs e retorna apenas os de status "aberto"',
    'Criar função gerar_dados_teste() que retorna dict com dados fake aleatórios',
    'Usar json.loads() para parsear uma resposta de API simulada e extrair campos',
    'Criar loop que simula 5 tentativas de login e imprime o resultado de cada',
  ]);
  await addChecklist(cardId, '✅ Critérios de conclusão', [
    'Escrevo funções com parâmetros opcionais e docstrings',
    'Uso loops para processar listas de cenários de teste',
    'Consigo parsear JSON e acessar campos específicos',
    'Scripts commitados e organizados no GitHub',
  ]);
  console.log('Dia 9 OK!');
}

// ===== DIA 10 =====
const DESC_D10 = `## Objetivo do Dia
Consolidar a Semana 2 com um mini projeto Python real + retrospectiva pessoal e planejamento da próxima semana.

---

## Mini Projeto: Bug Tracker em Python

Construir um script de linha de comando simples para gerenciar bugs — aplicando tudo da semana.

\`\`\`python
# bug_tracker.py
import json
import datetime
import os

ARQUIVO = "bugs.json"

def carregar_bugs():
    if os.path.exists(ARQUIVO):
        with open(ARQUIVO, "r") as f:
            return json.load(f)
    return []

def salvar_bugs(bugs):
    with open(ARQUIVO, "w") as f:
        json.dump(bugs, f, indent=2, ensure_ascii=False)

def criar_bug(titulo, severidade, descricao=""):
    bugs = carregar_bugs()
    novo = {
        "id": len(bugs) + 1,
        "titulo": titulo,
        "severidade": severidade,  # alta | media | baixa
        "status": "aberto",
        "descricao": descricao,
        "criado_em": datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    }
    bugs.append(novo)
    salvar_bugs(bugs)
    print(f"Bug #{novo['id']} criado: {titulo}")
    return novo

def listar_bugs(filtro_status=None):
    bugs = carregar_bugs()
    if filtro_status:
        bugs = [b for b in bugs if b["status"] == filtro_status]
    for b in bugs:
        print(f"[{b['id']}] {b['titulo']} | {b['severidade'].upper()} | {b['status']}")
    return bugs

def fechar_bug(bug_id):
    bugs = carregar_bugs()
    for b in bugs:
        if b["id"] == bug_id:
            b["status"] = "fechado"
            salvar_bugs(bugs)
            print(f"Bug #{bug_id} fechado!")
            return
    print(f"Bug #{bug_id} não encontrado.")

# Teste manual
criar_bug("Login falha com email maiúsculo", "alta", "Campo email é case-sensitive indevidamente")
criar_bug("Botão salvar some após timeout", "media")
criar_bug("Tooltip com texto errado", "baixa")
listar_bugs()
print("--- Apenas abertos ---")
listar_bugs("aberto")
fechar_bug(2)
listar_bugs()
\`\`\`

---

## Retrospectiva da Semana 2

Perguntas para responder no seu diário de estudos:
1. O que aprendi essa semana que me surpreendeu?
2. Qual foi o maior obstáculo? Como resolvi?
3. Em que preciso praticar mais antes de avançar?
4. O que vou fazer diferente na próxima semana?

---

## Links de Apoio
- Python JSON: https://docs.python.org/pt-br/3/library/json.html
- Boas práticas Python: https://peps.python.org/pep-0008/

---

## Ciclo Pomodoro
- Bloco 1 (9h–11h30): Construir o Bug Tracker do zero, passo a passo
- Bloco 2 (13h–16h): Refatorar, commentar, commitar + retrospectiva`;

async function fillD10(cardId) {
  console.log('Atualizando Dia 10...');
  await updateDesc(cardId, DESC_D10);
  await addChecklist(cardId, '📚 Conteúdo para estudar', [
    'Revisar: dicionários, listas, loops e funções (Dias 8 e 9)',
    'Aprender a ler/escrever arquivos JSON com Python',
    'Entender list comprehension para filtrar dados',
    'Praticar estrutura de projeto Python organizado',
  ]);
  await addChecklist(cardId, '✏️ Exercícios do dia', [
    'Implementar o Bug Tracker completo do zero (não copiar, digitar)',
    'Adicionar função gerar_relatorio() que conta bugs por severidade',
    'Adicionar função buscar_bug(titulo_parcial) com busca por substring',
    'Commitar o projeto com README explicando como usar',
    'Escrever retrospectiva da Semana 2 em arquivo RETROSPECTIVA.md',
  ]);
  await addChecklist(cardId, '✅ Critérios de conclusão', [
    'Bug Tracker funciona: criar, listar, fechar bugs, salvar em JSON',
    'Código limpo, comentado e com nomes de variáveis descritivos',
    'Projeto no GitHub com README e retrospectiva',
    'Consigo explicar cada linha do código que escrevi',
    'Retrospectiva escrita honestamente',
  ]);
  console.log('Dia 10 OK!');
}

// ===== MAIN =====
async function main() {
  console.log('=== Populando S2 Backlog ===\n');
  await fillD6(CARDS.d6);
  await fillD7(CARDS.d7);
  await fillD8(CARDS.d8);
  await fillD9(CARDS.d9);
  await fillD10(CARDS.d10);
  console.log('\n=== S2 Completo! ===');
}

main().catch(console.error);
