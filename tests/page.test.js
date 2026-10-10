'use strict';
const test = require('node:test');
const assert = require('node:assert');

// Фальшивый Redis REST для проверки логики функции (не имитация результата продукта).
const store = new Map();
const sets = new Map();
function run(args) {
  const [c, k, ...rest] = args;
  if (c === 'SET') { store.set(k, rest[0]); return 'OK'; }
  if (c === 'GET') return store.has(k) ? store.get(k) : null;
  if (c === 'SADD') { const s = sets.get(k) || new Set(); const had = s.has(rest[0]); s.add(rest[0]); sets.set(k, s); return had ? 0 : 1; }
  if (c === 'SCARD') return (sets.get(k) || new Set()).size;
  if (c === 'EXPIRE') return 1;
  if (c === 'DEL') { const had = store.delete(k) || sets.delete(k); return had ? 1 : 0; }
  throw new Error('cmd ' + c);
}
global.fetch = async (url, o) => {
  const body = JSON.parse(o.body);
  if (url.endsWith('/pipeline')) return { ok: true, json: async () => body.map((a) => ({ result: run(a) })) };
  return { ok: true, json: async () => ({ result: run(body) }) };
};
process.env.KV_REST_API_URL = 'https://redis.example';
process.env.KV_REST_API_TOKEN = 't';
const handler = require('../api/page.js');

function call(method, body, ip, ua, query) {
  return new Promise((resolve) => {
    const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(o) { resolve({ code: this.code, body: o }); } };
    handler({ method, body, query: query || {}, headers: { 'x-forwarded-for': ip || '1.1.1.1', 'user-agent': ua || 'ua' }, socket: {} }, res);
  });
}
const IDEA = { title: 'Напоминания для репетиторов', pitch: 'Сервис сам напоминает ученикам о занятиях и оплате.', audience: 'Репетиторы', pain: 'Ученики забывают оплатить' };

test('links, emails and phones are rejected', async () => {
  for (const bad of ['https://evil.example', 'пиши @user', 'звони +7 999 123 45 67', 'сайт my.shop.ru', 't.me/x']) {
    const r = await call('POST', { action: 'create', idea: Object.assign({}, IDEA, { pitch: IDEA.pitch + ' ' + bad }) }, '9.9.9.' + Math.floor(Math.random() * 200));
    assert.strictEqual(r.code, 400, bad);
  }
});

test('create, view, unique counting, stats and delete with token', async () => {
  const c = await call('POST', { action: 'create', idea: IDEA, lang: 'ru' }, '2.2.2.2');
  assert.strictEqual(c.code, 200);
  const { id, token } = c.body;
  const g = await call('GET', null, '3.3.3.3', 'ua', { id });
  assert.strictEqual(g.code, 200);
  assert.strictEqual(g.body.page.title, IDEA.title);
  assert.strictEqual(g.body.page.tokenHash, undefined);
  assert.strictEqual((await call('POST', { action: 'event', id, type: 'view' }, '4.4.4.4', 'a')).body.counted, true);
  assert.strictEqual((await call('POST', { action: 'event', id, type: 'view' }, '4.4.4.4', 'a')).body.counted, false); // тот же посетитель
  await call('POST', { action: 'event', id, type: 'view' }, '5.5.5.5', 'a');
  await call('POST', { action: 'event', id, type: 'pay' }, '5.5.5.5', 'a');
  assert.strictEqual((await call('POST', { action: 'stats', id, token: 'wrong' }, '6.6.6.6')).code, 403);
  const s = await call('POST', { action: 'stats', id, token }, '6.6.6.6');
  assert.deepStrictEqual(s.body.stats, { views: 2, needs: 0, pays: 1, reports: 0 });
  assert.strictEqual((await call('POST', { action: 'delete', id, token: 'wrong' }, '6.6.6.6')).code, 403);
  assert.strictEqual((await call('POST', { action: 'delete', id, token }, '6.6.6.6')).code, 200);
  assert.strictEqual((await call('GET', null, '7.7.7.7', 'ua', { id })).code, 404);
});

test('three reports hide the page', async () => {
  const { id } = (await call('POST', { action: 'create', idea: IDEA }, '8.1.1.1')).body;
  for (const ip of ['1.0.0.1', '1.0.0.2', '1.0.0.3']) await call('POST', { action: 'event', id, type: 'report' }, ip, 'x');
  assert.strictEqual((await call('GET', null, '8.2.2.2', 'ua', { id })).code, 410);
});

test('bad ids and event types are rejected', async () => {
  assert.strictEqual((await call('GET', null, '8.3.3.3', 'ua', { id: '../etc' })).code, 404);
  const { id } = (await call('POST', { action: 'create', idea: IDEA }, '8.4.4.4')).body;
  assert.strictEqual((await call('POST', { action: 'event', id, type: 'hack' }, '8.5.5.5')).code, 400);
});

test('creation is rate limited per address', async () => {
  const codes = [];
  for (let i = 0; i < 4; i++) codes.push((await call('POST', { action: 'create', idea: IDEA }, '8.6.6.6')).code);
  assert.deepStrictEqual(codes, [200, 200, 200, 429]);
});

test('without storage the function says so', async () => {
  const saved = process.env.KV_REST_API_URL;
  delete process.env.KV_REST_API_URL;
  const r = await call('POST', { action: 'create', idea: IDEA }, '8.7.7.7');
  assert.strictEqual(r.code, 503);
  assert.strictEqual(r.body.code, 'storage');
  process.env.KV_REST_API_URL = saved;
});
