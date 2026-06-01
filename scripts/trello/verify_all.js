const https = require('https');
const KEY = 'SEU_TRELLO_KEY_AQUI';
const TOKEN = 'SEU_TRELLO_TOKEN_AQUI';

const LISTS = {
  'S2': '6a1dba8d011199cb4c4e3899',
  'S3': '6a1dba8e7e34abd1b0325cd2',
  'S4': '6a1dba8f2b4f87e180d6d71a',
};

function get(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname: 'api.trello.com', path: `/1${path}?key=${KEY}&token=${TOKEN}`, method: 'GET' }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', reject); req.end();
  });
}

async function main() {
  for (const [name, id] of Object.entries(LISTS)) {
    const cards = await get(`/lists/${id}/cards`);
    console.log(`\n${name}: ${cards.length} cards`);
    for (const c of cards) {
      const hasDesc = c.desc && c.desc.length > 10 ? '✓' : '✗';
      console.log(`  ${hasDesc} ${c.name.substring(0,55)}`);
    }
  }
}
main().catch(console.error);
