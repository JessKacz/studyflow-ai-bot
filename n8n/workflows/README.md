# 🔄 Workflows do n8n

## studyflow-assistant-ai-bot.json

**ID**: `bg8uGb8VbgO9Wrdu`  
**Status**: ativo em produção

### O que faz
Workflow principal do StudyFlow. Recebe mensagens do Telegram, identifica se é a Jessica (pelo chat ID) ou usuário público, e roteia para o AI Agent correto.

### Arquitetura do workflow

```
Telegram Trigger
      │
      ▼
   IF (chat ID == Jessica?)
      │
      ├── SIM ──► AI Agent "Jessy Tutora"
      │               │ Groq: llama-3.1-8b-instant
      │               │ Memory: Postgres (tabela messages)
      │               │ Tools: criar lista, criar card, mover card (Trello)
      │               ▼
      │           Send Message (Telegram)
      │
      └── NÃO ──► AI Agent "Jessy Pública"
                      │ Groq: groq/compound-mini
                      │ Memory: Postgres (tabela messages_public)
                      ▼
                  Send Message (Telegram, com Markdown)
```

### Nodes (13 total)
| Node | Tipo | Função |
|------|------|--------|
| Telegram Trigger | Trigger | Recebe mensagens |
| If | Condição | Filtra por chat ID da Jessica |
| AI Agent | LangChain Agent | Tutora pessoal (acesso privado) |
| AI Agent1 | LangChain Agent | Face pública (Jessy AI) |
| Groq Chat Model | LLM | llama-3.1-8b-instant (agente privado) |
| Groq Chat Model1 | LLM | compound-mini (agente público) |
| Postgres Chat Memory | Memory | Histórico da Jessica |
| Postgres Chat Memory1 | Memory | Histórico público |
| Send a text message | Telegram | Resposta para a Jessica |
| Send a text message1 | Telegram | Resposta pública (com Markdown) |
| Criar Lista Trello | Tool | Cria lista no quadro |
| Criar Card Trello | Tool | Cria card com conteúdo |
| Mover Card Trello | Tool | Move card entre listas |

### Como importar
1. No n8n: menu → **Import workflow** → selecione este JSON
2. Configure as credenciais: Telegram, Groq, PostgreSQL, Trello
3. Ative o workflow
4. O n8n re-registra o webhook automaticamente na ativação

### ⚠️ Credenciais
O JSON exportado **não contém** tokens ou senhas — o n8n separa credenciais do workflow intencionalmente. Após importar, reconfigure manualmente:
- Telegram: Base URL do Cloudflare Worker + token do bot
- Groq: API key do console.groq.com
- PostgreSQL: host `postgres`, porta 5432, db `n8n`
- Trello: API key + token do trello.com/app-key
