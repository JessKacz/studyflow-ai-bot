# StudyFlow Assistant

> Assistente pessoal self-hosted de **Jessica Kaczmarkiewicz** — bot de IA no Telegram para gestão de estudos, automação de tarefas e portfólio técnico interativo.

[![n8n](https://img.shields.io/badge/n8n-self--hosted-orange)](https://n8n.io)
[![Telegram](https://img.shields.io/badge/Telegram-@JessicaKacz__StudyFlow__bot-blue)](https://t.me/JessicaKacz_StudyFlow_bot)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-brightgreen)](https://groq.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue)](https://docker.com)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Tunnel%20%2B%20Workers-orange)](https://cloudflare.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://postgresql.org)

---

## O Projeto

O **StudyFlow Assistant** nasceu de uma necessidade real: durante a transição de carreira de Jessica para a área de **Quality Assurance (QA)**, surgiu a necessidade de um sistema que centralizasse estudos, tarefas e progresso — acessível de qualquer lugar, sem depender de SaaS externos.

O resultado é um assistente de IA completamente self-hosted, acessível via Telegram, que combina automação, inteligência artificial e gestão de projetos em uma única plataforma pessoal.

### Dois papéis simultâneos

**Assistente pessoal (Jessy — uso privado)**
- Tutora de QA com contexto do plano de estudos completo
- Gerencia tarefas no Trello via comandos em linguagem natural
- Mantém histórico de conversas persistido no PostgreSQL
- Acompanha progresso e sugere próximos passos

**Portfólio técnico interativo (público)**
- Qualquer pessoa que interagir com o bot encontra a Jessy AI
- Apresenta Jessica, o projeto e a stack técnica
- Demonstra na prática: automação, IA, infra self-hosted, integração de APIs
- Prova concreta de habilidades — não apenas um currículo

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Orquestração | n8n (self-hosted) |
| IA | Groq — Llama 3.3 70B Versatile |
| Interface | Telegram Bot API |
| Memória | PostgreSQL 16 |
| Containers | Docker + Docker Compose |
| Gerenciamento | Portainer |
| Exposição pública | Cloudflare Tunnel |
| Proxy de API | Cloudflare Workers |
| Gestão de tarefas | Trello |
| Servidor | Windows 10 (máquina local como servidor) |

---

## Arquitetura

```
Usuário (Telegram)
       │
       ▼
Telegram Servers ──► Cloudflare Tunnel ──► n8n (Docker · localhost:5678)
                                                │
                              ┌─────────────────┼─────────────────┐
                              │                 │                 │
                           IF: Jess?          AI Agent         AI Agent
                           (por chat ID)      (Jessy)          (público)
                              │                 │                 │
                              │          Groq/Llama 3.3    Groq/Llama 3.3
                              │          PostgreSQL         PostgreSQL
                              │          (memória Jess)    (memória pública)
                              │                 │                 │
                              └─────────────────┴─────────────────┘
                                                │
                                         Telegram API
                                   (via Cloudflare Worker)
```

**Por que o Cloudflare Worker?**
Alguns ISPs no Brasil bloqueiam os IPs do Telegram (149.154.x.x). O Worker atua como proxy reverso entre o n8n e a API do Telegram, contornando o bloqueio sem necessidade de VPN.

---

## Funcionalidades

### Jessy (assistente privado da Jessica)
- Responde perguntas sobre o plano de estudos de QA
- Gerencia cards no Trello por comando de voz/texto
- Mantém contexto de conversas (memória persistente)
- Acompanha progresso semanal

### Jessy AI (bot público)
- Apresenta Jessica e o projeto StudyFlow
- Responde perguntas sobre a stack técnica
- Botões inline com informações rápidas
- Redireciona para o LinkedIn para contato profissional

---

## Estrutura do Repositório

```
studyflow/
├── docs/
│   ├── architecture.md         # Diagrama detalhado e decisões técnicas
│   ├── setup.md                # Guia completo de instalação
│   ├── cloudflare-worker.md    # Configuração do Worker proxy
│   └── troubleshooting.md      # Problemas conhecidos e soluções
├── n8n/
│   └── workflows/              # Workflows exportados do n8n
├── docker/
│   └── docker-compose.yml      # Configuração dos containers
└── README.md
```

---

## Como Executar

Consulte o guia completo em [docs/setup.md](docs/setup.md).

Resumo rápido:

```bash
git clone https://github.com/JessKacz/studyflow.git
cd studyflow/docker
docker compose up -d
```

Requisitos: Docker, domínio com Cloudflare, token do Telegram Bot, chave da Groq API.

---

## Contexto — Transição de Carreira para QA

Este projeto é parte da jornada de Jessica para a área de QA. A ideia é simples: ao invés de apenas estudar teoria, construir sistemas reais que demonstrem as habilidades na prática.

**Plano de estudos em andamento:**
- Módulo 1 — Fundamentos de QA, Git, Python, Testes manuais, HTTP/APIs (4 semanas)
- Módulo 2 — Automação com Pytest
- Módulo 3 — Selenium & Playwright
- Módulo 4 — CI/CD & GitHub Actions
- Módulo 5 — Agile, Scrum & trabalho em equipe
- Módulo 6 — Entrevistas & portfólio

O StudyFlow é, ao mesmo tempo, ferramenta de estudo e produto final do aprendizado.

---

## Sobre

**Jessica Kaczmarkiewicz**
Profissional em transição estratégica para QA, com background em Customer Success, operações de TI e suporte técnico. Aprendizado autodidata, mentalidade maker — aprende construindo.

- LinkedIn: [jessica-kaczmarkiewicz](https://linkedin.com/in/jessica-kaczmarkiewicz)
- Telegram Bot: [@JessicaKacz_StudyFlow_bot](https://t.me/JessicaKacz_StudyFlow_bot)
- Localização: Valença, Rio de Janeiro, Brasil
