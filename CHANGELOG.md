# 📜 CHANGELOG

Histórico de desenvolvimento do projeto StudyFlow.

---

## [Não lançado] — Em andamento

### Planejado
- Tool n8n para marcar checklists como concluídas
- Dashboard de progresso via bot
- Início dos estudos pelo Módulo 1

---

## [0.3.0] — Junho 2025

### Adicionado
- Cards S2 Backlog (Dias 6–10) populados com conteúdo completo
  - Teoria detalhada com exemplos de código
  - Links de apoio e cursos Alura vinculados
  - 3 checklists por card (conteúdo, exercícios, critérios)
- Cards S3 Backlog criados do zero (Dias 11–15) — Testes Manuais
- Cards S4 Backlog criados do zero (Dias 16–20) — HTTP e APIs
- Script `trello_s2_fill.js` — popula cards S2 existentes via API
- Script `trello_s3_cards.js` — cria e popula S3 completo
- Script `trello_s4_cards.js` — cria e popula S4 completo
- Script `verify_all.js` — verifica estado de todos os cards
- Script `fix_dup.js` — remove card duplicado (Dia 16)

### Corrigido
- Card Dia 16 duplicado removido (falha parcial na primeira execução)
- Método de execução: migrado de `docker run --rm` para `docker run --rm --network host`

### Técnico
- Padrão estabelecido: scripts Node.js em C:\n8n\ executados via Docker
- `--network host` necessário para acesso externo em Docker no Windows

---

## [0.2.0] — Maio 2025

### Adicionado
- Cards S1 Backlog (Dias 1–5) com conteúdo completo
- Cards S2 Backlog (Dias 6–10) com títulos apenas
- Listas S3 e S4 criadas (vazias)
- Script `trello_semana1.js` — cria S1 completa
- Script `trello_semana2.js` — cria estrutura S2
- Script `trello_s2_base.js` — variante da criação S2
- Workflow n8n `bg8uGb8VbgO9Wrdu` publicado e operacional
- Bot Jessy AI respondendo no Telegram (@JessicaKacz_StudyFlow_bot)
- 3 tools Trello integradas: criar lista, criar card, mover card
- Documentação inicial no GitHub (README, setup, architecture)

### Corrigido
- Webhook secret: resolvido problema "Provides secret is not valid"
- Webhook ID: estabelecido procedimento de reativação do workflow

---

## [0.1.0] — Início do Projeto

### Adicionado
- Infraestrutura Docker: n8n + PostgreSQL 16 + Portainer CE
- Cloudflare Tunnel configurado (studyflow.jessicakacz.com.br)
- Cloudflare Worker proxy para contornar bloqueio ISP do Telegram
- docker-compose.yml com todos os serviços configurados
- Repositório GitHub criado (JessKacz/studyflow)

### Problemas encontrados e resolvidos
- ISP bloqueando api.telegram.org → resolvido com Cloudflare Worker
- Node.js não disponível no PATH do Windows → resolvido com Docker
- Containers sem acesso externo → resolvido com --network host
