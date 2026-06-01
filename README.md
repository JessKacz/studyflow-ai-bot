# 🤖 StudyFlow — Assistente de Transição de Carreira para QA

> Plataforma self-hosted de **Jessica Kaczmarkiewicz** que combina automação inteligente, IA conversacional e gestão de estudos estruturada para acelerar a transição de carreira para **Quality Assurance**.

[![n8n](https://img.shields.io/badge/n8n-self--hosted-orange)](https://n8n.io)
[![Telegram](https://img.shields.io/badge/Telegram-Jessy_AI_Bot-blue)](https://t.me/JessicaKacz_StudyFlow_bot)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-green)](https://groq.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docker.com)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Tunnel%20%2B%20Workers-orange)](https://cloudflare.com)
[![Trello](https://img.shields.io/badge/Trello-Quadro_de_Estudos-0052CC)](https://trello.com/b/Y92y3fVT)
[![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento_Ativo-brightgreen)]()

---

## 🎯 O Projeto

O **StudyFlow** nasceu de uma necessidade concreta: criar uma infraestrutura de apoio real para uma transição de carreira séria — não apenas um repositório de anotações, mas um sistema vivo que acompanha, organiza e potencializa o aprendizado.

O projeto serve dois propósitos simultâneos e complementares:

### 📚 Ferramenta Pessoal de Estudos
- Gestão do quadro Trello de estudos via Telegram (cria listas, cards, move tarefas)
- Assistente de IA acessível a qualquer momento para tirar dúvidas
- Central de controle da rotina de estudos (seg–sex, 9h–17h, ciclo Pomodoro)
- 20 dias de conteúdo estruturado já mapeados e organizados no Trello

### 💼 Projeto de Portfólio Técnico
Enquanto estudo QA, estou construindo e documentando na prática:
- Automação real com n8n (workflows publicados e em produção)
- Integração de múltiplas APIs (Telegram, Groq, Trello)
- Infraestrutura self-hosted com Docker, PostgreSQL e Cloudflare
- Resolução de problemas reais de infraestrutura (ISP blocking, webhook validation, container networking)

---

## 🤖 Jessy AI — O Bot

O bot **Jessy AI** está disponível publicamente no Telegram: [@JessicaKacz_StudyFlow_bot](https://t.me/JessicaKacz_StudyFlow_bot)

Para Jessica (acesso privado via chat ID), o bot oferece:
- Criação e gerenciamento de cards no Trello via linguagem natural
- Consultas ao plano de estudos
- Suporte contextual de IA durante os estudos

Para o público geral, o bot se apresenta como **Jessy AI** — uma IA que fala sobre Jessica, seus projetos e demonstra na prática as competências técnicas desenvolvidas durante a transição de carreira.

---

## 🏗️ Arquitetura

```
Usuário (Telegram)
       │
       ▼
Telegram Servers (api.telegram.org)
       │  webhook POST
       ▼
Cloudflare Tunnel (studyflow.jessicakacz.com.br)
       │
       ▼
n8n — Workflow "StudyFlow Assistant AI Bot" (Docker, localhost:5678)
       │
       ├─► AI Agent ─────────────► Groq API (Llama 3.3 70B Versatile)
       │        │
       │        └─► Tools Trello:
       │              • Criar lista
       │              • Criar card
       │              • Mover card
       │
       ├─► PostgreSQL 16 (persistência, memória de conversação)
       │
       └─► Telegram API (resposta) ─► Cloudflare Worker (proxy)
```

**Por que o Cloudflare Worker?**
ISPs brasileiros bloqueiam os IPs do Telegram (`149.154.x.x`). O Worker atua como proxy transparente entre o n8n e o `api.telegram.org`, contornando o bloqueio sem custo adicional.

---

## 🛠️ Stack Técnica

| Componente | Tecnologia | Função |
|---|---|---|
| Automação/Orquestração | n8n self-hosted | Workflows, lógica, integrações |
| IA | Groq — Llama 3.3 70B Versatile | Processamento de linguagem natural |
| Interface | Telegram Bot (Jessy AI) | Canal de comunicação |
| Banco de dados | PostgreSQL 16 | Persistência do n8n e memória |
| Containerização | Docker + Docker Compose | Isolamento e portabilidade |
| Gerenciamento | Portainer CE | Dashboard de containers |
| Exposição pública | Cloudflare Tunnel | HTTPS sem abrir portas |
| Proxy de API | Cloudflare Workers | Contornar bloqueio ISP |
| Gestão de tarefas | Trello API | Quadro de estudos QA |
| Provisionamento Trello | Node.js (scripts) | Criação automática de cards |

---

## 📚 Plano de Estudos QA — Módulo 1

O quadro Trello ([ver aqui](https://trello.com/b/Y92y3fVT)) está completamente estruturado com **20 dias de conteúdo** divididos em 4 semanas temáticas.

Rotina de estudos: **seg–sex, 9h–11h30 e 13h–16h** (ciclo Pomodoro 25/5min, ~10 pomodoros/dia)

| Semana | Tema | Status | Dias |
|--------|------|--------|------|
| S1 | Fundamentos QA & Mentalidade de Teste | 🗂️ Backlog | 1–5 |
| S2 | Git, Terminal e Python Básico | 🗂️ Backlog | 6–10 |
| S3 | Testes Manuais na Prática | 🗂️ Backlog | 11–15 |
| S4 | HTTP, APIs e Postman | 🗂️ Backlog | 16–20 |

Módulos futuros planejados:
- **M2**: Pytest e automação de testes
- **M3**: Selenium / Playwright (E2E)
- **M4**: CI/CD com GitHub Actions
- **M5**: Agile/Scrum na prática
- **M6**: Entrevistas, portfólio e recolocação

Cada card do Trello contém: teoria, links de apoio, curso Alura vinculado, ciclo Pomodoro planejado e 3 checklists (conteúdo, exercícios, critérios de conclusão).

---

## 📁 Estrutura do Repositório

```
studyflow/
├── README.md                          # Este arquivo
├── CHANGELOG.md                       # Histórico de desenvolvimento
├── docker/
│   └── docker-compose.yml             # Configuração dos containers
├── docs/
│   ├── architecture.md                # Diagrama e decisões técnicas
│   ├── setup.md                       # Guia completo de instalação
│   ├── cloudflare-worker.md           # Configuração do proxy Telegram
│   ├── study-plan.md                  # Plano de estudos QA detalhado
│   ├── trello-structure.md            # Documentação do quadro Trello
│   └── troubleshooting.md             # Erros reais e soluções encontradas
├── n8n/
│   └── workflows/
│       └── studyflow-assistant-ai-bot.json   # Workflow exportado do n8n
└── scripts/
    └── trello/                        # Scripts de provisionamento do Trello
        ├── trello_semana1.js          # Cria cards S1 (Dias 1–5)
        ├── trello_semana2.js          # Base S2 (estrutura inicial)
        ├── trello_s2_fill.js          # Popula S2 com conteúdo completo
        ├── trello_s3_cards.js         # Cria e popula S3 (Dias 11–15)
        └── trello_s4_cards.js         # Cria e popula S4 (Dias 16–20)
```

---

## 🚀 Como Executar

Veja o guia completo em [docs/setup.md](docs/setup.md).

**Requisitos mínimos:**
- Docker + Docker Compose
- Domínio com Cloudflare
- Contas: Telegram BotFather, Groq, Trello

---

## 📋 Status do Projeto

### ✅ Concluído
- [x] Infraestrutura Docker (n8n + PostgreSQL + Portainer)
- [x] Cloudflare Tunnel configurado e funcional
- [x] Cloudflare Worker proxy para Telegram
- [x] Workflow n8n publicado e operacional (`bg8uGb8VbgO9Wrdu`)
- [x] Bot Jessy AI respondendo no Telegram
- [x] 3 tools Trello integradas ao AI Agent (criar lista, criar card, mover card)
- [x] Quadro Trello estruturado com 20 dias de conteúdo (S1–S4)
- [x] Cards S1 com conteúdo completo (teoria + checklists + links)
- [x] Cards S2, S3 e S4 com conteúdo completo
- [x] Documentação do projeto no GitHub

### 🔄 Em Andamento
- [ ] Início dos estudos pelo plano (Módulo 1, Semana 1)
- [ ] Workflows adicionais do n8n (registro de progresso, relatórios)

### 📋 Planejado
- [ ] Tool n8n para atualizar status de cards (marcar checklist)
- [ ] Dashboard de progresso via bot
- [ ] Módulo 2 do plano de estudos (Pytest)
- [ ] Integração com LinkedIn (posts automáticos de progresso)

---

## 👩‍💻 Sobre

Projeto desenvolvido por **Jessica Kaczmarkiewicz** — profissional com background em TI, Customer Success e QA, em transição de carreira ativa para especialização em Quality Assurance.

- 🔗 [LinkedIn](https://linkedin.com/in/jessicakaczmarkiewicz)
- 🤖 [Telegram Bot — Jessy AI](https://t.me/JessicaKacz_StudyFlow_bot)
- 📋 [Quadro Trello de Estudos](https://trello.com/b/Y92y3fVT)

---

*"Não estou só estudando QA. Estou construindo a infraestrutura enquanto a uso."*
