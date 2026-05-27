# ☁️ Cloudflare Worker — Proxy Telegram

## Por que é necessário?

Alguns ISPs no Brasil bloqueiam os IPs do Telegram (`149.154.x.x`). O Cloudflare Worker atua como proxy reverso, recebendo as requisições do n8n e repassando para `api.telegram.org`, contornando o bloqueio.

---

## Criando o Worker

1. Acesse **dash.cloudflare.com → Workers & Pages → Create → Create Worker**
2. Dê o nome `telegram-proxy`
3. Clique em **Deploy**
4. Clique em **Edit code** e substitua tudo pelo código abaixo:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = 'https://api.telegram.org' + url.pathname + url.search;

    const newRequest = new Request(target, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD'
        ? request.body
        : undefined,
    });

    return fetch(newRequest);
  }
};
```

5. Clique em **Deploy**

---

## Configurando no n8n

1. Vá em **Credentials → Telegram account**
2. No campo **Base URL**, coloque a URL do seu Worker (sem barra no final):
```
https://SEU-WORKER.workers.dev
```
3. Salve e teste a conexão

---

## Verificando o webhook

Para confirmar que o webhook está registrado corretamente:

```
https://SEU-WORKER.workers.dev/botSEU_TOKEN/getWebhookInfo
```
