# 📜 CHANGELOG

Histórico de desenvolvimento do StudyFlow.

---

## [Não lançado] — Em andamento

### Planejado
- Tool n8n para marcar checklists como concluídas
- Dashboard de progresso via bot
- Início dos estudos pelo Módulo 1

---

## [0.4.0] — Junho 2025

### Adicionado
- `.gitignore` cobrindo dados sensíveis, node_modules, scripts temporários
- `.env.example` com todas as variáveis necessárias documentadas
- `n8n/workflows/README.md` explicando arquitetura do workflow, nodes e como importar
- `docker/docker-compose.yml` atualizado com variáveis de ambiente (sem senhas hardcoded)
- Workflow `studyflow-assistant-ai-bot.json` atualizado para versão atual (13 nodes, versionId: f1672dae)

### Alterado
- docker-compose.yml migrado de senhas hardcoded para `${VAR}` com .env
- Workflow JSON sincronizado com estado real do n8n via API

---

## [0.3.0] — Junho 2025

### Adicionado
- Cards S2 Backlog (Dias 6–10) populados com conteúdo completo
- Cards S3 Backlog criados do zero (Dias 11–15) — Testes Manuais
- Cards S4 Backlog criados do zero (Dias 16–20) — HTTP e APIs
- Scripts de provisionamento Trello publicados em `scripts/trello/`
- README reescrito com estado real do projeto
- CHANGELOG, docs/study-plan.md, docs/trello-structure.md criados

### Corrigido
- Card Dia 16 duplicado removido (falha parcial na primeira execução)

### Técnico
- Padrão estabelecido: `docker run --rm --network host -v C:\n8n:/app node:18-alpine node /app/script.js`

---

## [0.2.0] — Maio 2025

### Adicionado
- Cards S1 Backlog (Dias 1–5) com conteúdo completo
- Cards S2–S4 com estrutura inicial (títulos)
- Workflow n8n publicado e operacional (`bg8uGb8VbgO9Wrdu`)
- Bot Jessy AI respondendo no Telegram
- 3 tools Trello no AI Agent: criar lista, criar card, mover card
- Dois agentes: Jessy Tutora (Jessica) e Jessy Pública (mundo)
- Documentação inicial no GitHub

### Corrigido
- Webhook secret: resolvido "Provides secret is not valid"
- Procedimento de reativação do workflow estabelecido

---

## [0.1.0] — Início do Projeto

### Adicionado
- Infraestrutura Docker: n8n + PostgreSQL 16 + Portainer CE
- Cloudflare Tunnel (studyflow.jessicakacz.com.br)
- Cloudflare Worker proxy para contornar bloqueio ISP do Telegram
- Repositório GitHub criado (JessKacz/studyflow)

### Problemas encontrados e resolvidos
- ISP bloqueando api.telegram.org → Cloudflare Worker
- Node.js fora do PATH no Windows → execução via Docker
- Containers sem acesso externo → `--network host`
