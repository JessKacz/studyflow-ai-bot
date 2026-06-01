# 📋 Estrutura do Quadro Trello

**URL**: https://trello.com/b/Y92y3fVT  
**Board ID**: `6a1848ea51e9dd133ebab35f`

---

## Listas do Quadro

| Lista | ID | Função |
|-------|-----|--------|
| 📚 S1 Backlog | — | Cards dos Dias 1–5 (Semana 1) |
| 📚 S2 Backlog | `6a1dba8d011199cb4c4e3899` | Cards dos Dias 6–10 (Semana 2) |
| 📚 S3 Backlog | `6a1dba8e7e34abd1b0325cd2` | Cards dos Dias 11–15 (Semana 3) |
| 📚 S4 Backlog | `6a1dba8f2b4f87e180d6d71a` | Cards dos Dias 16–20 (Semana 4) |
| 📅 Esta Semana | — | Cards da semana corrente |
| ⚡ Em Andamento | — | Card do dia sendo estudado |
| 🔄 Revisão | — | Cards concluídos aguardando revisão |
| ✅ Concluído | — | Cards finalizados |

---

## IDs dos Cards

### S2 Backlog (Dias 6–10)
| Card | ID |
|------|----|
| Dia 6 — Git na Prática | `6a1dd8df50ab7ba2ecada34b` |
| Dia 7 — Terminal Avançado e VS Code | `6a1dd8edebf269ca50c148a0` |
| Dia 8 — Python: Variáveis, Tipos e Estruturas | `6a1dd932d21447429c97d55d` |
| Dia 9 — Python: Loops, Funções e Módulos | `6a1dd9342ced0bc98fdf8e65` |
| Dia 10 — Mini Projeto Python + Revisão S2 | `6a1dd9356f4c3fe17d7cecca` |

### S3 Backlog (Dias 11–15)
| Card | ID |
|------|----|
| Dia 11 — Casos de Teste: Escrita Profissional | criado |
| Dia 12 — Bug Report: Arte de Reportar Defeitos | criado |
| Dia 13 — Teste Exploratório e Heurísticas | criado |
| Dia 14 — Planos de Teste e Documentação QA | criado |
| Dia 15 — Projeto S3: Ciclo Completo | criado |

### S4 Backlog (Dias 16–20)
| Card | ID |
|------|----|
| Dia 16 — HTTP: A Fundação de Testes de API | criado |
| Dia 17 — Postman: Ferramenta de Testes de API | criado |
| Dia 18 — APIs com Autenticação e Fluxos | criado |
| Dia 19 — Testes de API: Sistemático e Completo | criado |
| Dia 20 — Projeto Final: QA Completo de API Real | criado |

---

## Fluxo de Trabalho (Kanban)

```
BACKLOG → ESTA SEMANA → EM ANDAMENTO → REVISÃO → CONCLUÍDO
```

**Movimentação via Jessy AI (Telegram)**:
- "mover dia X para em andamento"
- "marcar dia X como concluído"

---

## Integração n8n ↔ Trello

O AI Agent do n8n tem 3 tools conectadas ao Trello:

| Tool | Ação | Parâmetros |
|------|------|-----------|
| Criar Lista | POST /1/lists | nome, idBoard |
| Criar Card | POST /1/cards | nome, idList, desc |
| Mover Card | PUT /1/cards/{id} | idList (destino) |
