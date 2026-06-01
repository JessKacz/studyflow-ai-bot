# 🔧 Troubleshooting — Erros Reais e Soluções

> Documento vivo. Cada problema aqui foi encontrado na prática durante o desenvolvimento do StudyFlow.
> Mantido para referência futura e como parte do portfólio de resolução de problemas.

---

## ERRO 001 — ISP bloqueando api.telegram.org

**Data**: Durante a configuração inicial do bot  
**Contexto**: n8n dentro de Docker, tentando enviar mensagens via Telegram API  
**Sintoma**: Workflow executava sem erros no n8n, mas nenhuma mensagem chegava ao Telegram

### Diagnóstico
```bash
# Teste de conectividade de dentro do container n8n
docker exec n8n node -e "
const https = require('https');
https.get('https://api.telegram.org', r => console.log('Status:', r.statusCode))
  .on('error', e => console.error('ERRO:', e.message));
"
# Resultado: ERRO: connect ECONNREFUSED 149.154.166.110:443
```

O ISP (provedor de internet) estava bloqueando os IPs do Telegram (`149.154.x.x`).
Problema comum no Brasil — alguns provedores bloqueiam por pressão regulatória ou por engano.

### Solução
Criar um **Cloudflare Worker** como proxy reverso transparente entre o n8n e o `api.telegram.org`.

```javascript
// Cloudflare Worker — telegram-proxy
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = 'https://api.telegram.org' + url.pathname + url.search;
    return fetch(new Request(target, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? request.body : undefined,
    }));
  }
};
```

No n8n, nas credenciais do Telegram, configurar o campo **Base URL** com a URL do Worker:
`https://SEU-WORKER.workers.dev`

**Status**: ✅ Resolvido

---

## ERRO 002 — Webhook não registrado corretamente / "Provides secret is not valid"

**Data**: Após configurar o Cloudflare Worker  
**Sintoma**: Mensagens enviadas ao bot não disparavam o workflow no n8n

### Diagnóstico
```
GET https://SEU-WORKER.workers.dev/botTOKEN/getWebhookInfo
# Resposta: url vazia ou apontando para URL desatualizada
```

O n8n usa um **secret token interno** para validar que as requisições chegando no webhook vieram realmente do Telegram. Quando o webhook é registrado manualmente (sem incluir esse secret), o n8n rejeita todas as requisições com "Provides secret is not valid".

### Solução
**Nunca registrar o webhook manualmente.** Deixar o n8n fazer isso automaticamente:
1. Desativar o workflow no n8n
2. Reativar o workflow
3. Na ativação, o n8n registra o webhook incluindo o secret token correto

Verificar o resultado:
```
https://SEU-WORKER.workers.dev/botTOKEN/getWebhookInfo
# Campo "url" deve conter o endereço completo do n8n
# Campo "has_custom_certificate" deve ser false
```

**Status**: ✅ Resolvido

---

## ERRO 003 — Node.js não reconhecido no PowerShell (Windows)

**Data**: Durante provisionamento do Trello via scripts  
**Sintoma**: `node : O termo 'node' não é reconhecido como nome de cmdlet`

### Diagnóstico
O Node.js não estava no PATH do usuário atual no PowerShell do Windows.
Mesmo com Node instalado via nvm ou instalador, o PATH pode não estar disponível para o shell iniciado pelo Desktop Commander.

### Solução
Executar os scripts dentro de um container Docker com Node.js:
```bash
docker run --rm -v C:\n8n:/app node:18-alpine node /app/script.js
```

**Vantagem adicional**: elimina dependência da instalação local do Node.js e garante versão consistente.

**Status**: ✅ Resolvido com Docker

---

## ERRO 004 — Container sem acesso à internet (ECONNREFUSED)

**Data**: Ao tentar executar scripts Trello via Docker pela primeira vez  
**Sintoma**: `Error: connect ECONNREFUSED 13.224.252.119:443`

### Diagnóstico
O container Docker padrão (`docker run --rm`) usa a rede bridge do Docker.
Em alguns contextos no Windows (Docker Desktop), a rede bridge pode ter problemas de resolução DNS ou roteamento para IPs externos.

### Solução
Usar `--network host` para compartilhar a rede do host com o container:
```bash
docker run --rm --network host -v C:\n8n:/app node:18-alpine node /app/script.js
```

**Observação**: `--network host` no Windows com Docker Desktop tem comportamento ligeiramente diferente do Linux — o container acessa a rede do host via NAT interno do Docker Desktop, mas resolve o problema de acesso externo.

**Status**: ✅ Resolvido com --network host

---

## ERRO 005 — Card duplicado no Trello após falha parcial

**Data**: Ao criar cards S4 do Trello  
**Sintoma**: S4 com 6 cards sendo que só deveria ter 5 — Dia 16 duplicado

### Causa
O script `trello_s4_cards.js` foi executado duas vezes:
1. Primeira execução: criou o card Dia 16 com sucesso, mas falhou na conexão de rede imediatamente depois (ERRO 004 acima)
2. Segunda execução (com --network host): criou todos os cards novamente, incluindo um segundo Dia 16

Como não havia verificação de idempotência ("se já existe, não cria"), o card foi duplicado.

### Solução imediata
Script de deduplicação: buscar todos os cards da lista, identificar nomes duplicados e deletar o mais antigo:
```javascript
const cards = await trelloReq('GET', `/lists/${LIST_ID}/cards`);
const seen = {};
for (const c of cards) {
  if (seen[c.name]) {
    await trelloReq('DELETE', `/cards/${c.id}`);
  } else {
    seen[c.name] = c.id;
  }
}
```

### Lição aprendida
Scripts de provisionamento devem ser **idempotentes** — verificar se o recurso já existe antes de criar.
Para o Trello, isso significa buscar os cards existentes e comparar por nome antes de criar.

**Status**: ✅ Resolvido — duplicata deletada

---

## ERRO 006 — Erro "invalid_type: content is required" na API do n8n

**Data**: Sessão anterior de trabalho  
**Contexto**: Tentativa de atualizar cards do Trello via chamada direta à API do n8n  
**Sintoma**: Requisições retornando `invalid_type: content is required`

### Diagnóstico
A API do n8n para execução de workflows exige que o body da requisição siga um schema específico.
O campo `content` estava sendo omitido ou enviado em formato errado.

### Solução adotada
Abandonar a abordagem de chamar a API do n8n e **usar scripts Node.js diretos** chamando a API do Trello. Mais simples, mais confiável, sem dependência do n8n para tarefas de provisionamento.

Padrão adotado:
```bash
# Escrever script JS em C:\n8n\
# Executar via Docker com --network host
docker run --rm --network host -v C:\n8n:/app node:18-alpine node /app/script.js
```

**Status**: ✅ Contornado com abordagem alternativa

---

## ERRO 007 — WebhookId mudando após edição do workflow

**Data**: Durante iterações no workflow principal  
**Sintoma**: Após salvar alterações no workflow, o bot parava de responder

### Diagnóstico
O n8n gera um `webhookId` único para cada nó de Webhook Trigger.
Quando o workflow é editado e salvo via API/import (não via interface), o `webhookId` pode ser regenerado.
O Telegram continua enviando para o webhook antigo, que não existe mais.

### Solução
Após qualquer alteração no workflow:
1. Desativar o workflow (botão toggle no n8n)
2. Ativar novamente
3. O n8n re-registra o webhook com o ID atual

Verificar com:
```
https://SEU-WORKER.workers.dev/botTOKEN/getWebhookInfo
```

**Status**: ✅ Resolvido — procedimento padrão estabelecido

---

## Checklist de verificação pós-deploy

Quando algo parar de funcionar, verificar nesta ordem:

- [ ] Workflow está ativo no n8n?
- [ ] `getWebhookInfo` retorna a URL correta?
- [ ] Cloudflare Tunnel está online (painel Cloudflare Zero Trust)?
- [ ] Container n8n está rodando? (`docker ps | grep n8n`)
- [ ] Logs do n8n têm erros? (`docker logs n8n --tail 50`)
- [ ] Conectividade Telegram de dentro do container? (teste ERRO 001)
