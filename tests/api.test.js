'use strict';
const test = require('node:test');
const assert = require('node:assert');
process.env.YANDEX_API_KEY = 'k';
process.env.YANDEX_FOLDER_ID = 'f';
process.env.RATE_PER_MINUTE = '3';
const handler = require('../api/agent.js');

function call(body, ip) {
  return new Promise((resolve) => {
    const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(o) { resolve({ code: this.code, body: o, headers: this.headers }); } };
    handler({ method: 'POST', body, headers: { 'x-forwarded-for': ip }, socket: {} }, res);
  });
}

const GOODREALITY = {
  assumptions: [{ text: 'a1', importance: 'high' }, { text: 'a2', importance: 'weird' }],
  unknowns: ['u'],
  risks: [{ title: 'r1', why_critical: 'w', if_wrong: 'i', confidence: 'HIGH', cheapest_test: 't' }, { title: 'r2', why_critical: 'w', if_wrong: 'i', confidence: 'x', cheapest_test: 't' }],
  primary_index: 9,
  experiment: { title: 'e', hypothesis: 'h', why_now: 'n', steps: ['s1', 's2'], budget: '0', duration: '48h', tools: ['t'], success_metric: 'm', fail_criterion: 'f', ambiguous: 'a', next_if_success: 'x', next_if_fail: 'y', next_if_ambiguous: 'z' },
  score: 99
};

test('normalizeReality clamps enums and primary index, drops model numbers', () => {
  const r = handler.normalizeReality(GOODREALITY);
  assert.strictEqual(r.assumptions[1].importance, 'medium');
  assert.strictEqual(r.risks[0].confidence, 'high');
  assert.strictEqual(r.risks[1].confidence, 'low');
  assert.strictEqual(r.primary_index, 0);
  assert.strictEqual(r.score, undefined);
});

test('normalizeReality rejects empty experiment', () => {
  assert.strictEqual(handler.normalizeReality({ assumptions: [], risks: [] }), null);
  const loose = handler.normalizeReality({ risks: ['Only a title'], experiment: { steps: '1. one\n2. two' } });
  assert.ok(loose && loose.experiment.steps.length === 2 && loose.risks[0].title === 'Only a title');
});

test('per-minute limit returns 429 with Retry-After', async () => {
  const origFetch = global.fetch;
  global.fetch = async () => ({ ok: true, text: async () => JSON.stringify({ choices: [{ message: { content: JSON.stringify(GOODREALITY) } }] }) });
  try {
    const body = { mode: 'reality', lang: 'en', idea: { title: 'Reminders for tutors', pitch: 'SMS reminders for lessons and payments' } };
    const codes = [];
    let last;
    for (let i = 0; i < 4; i++) { last = await call(body, '1.2.3.4'); codes.push(last.code); }
    assert.deepStrictEqual(codes, [200, 200, 200, 429]);
    assert.ok(Number(last.headers['Retry-After']) >= 1);
    const other = await call(body, '5.6.7.8');
    assert.strictEqual(other.code, 200);
    assert.ok(other.body.result.experiment.steps.length >= 2);
  } finally { global.fetch = origFetch; }
});

test('reality validates input and mode', async () => {
  assert.strictEqual((await call({ mode: 'reality', idea: {} }, '9.9.9.9')).code, 400);
  assert.strictEqual((await call({ mode: 'hack' }, '9.9.9.9')).code, 400);
  assert.strictEqual((await call({ mode: 'analyze', text: 'x'.repeat(2000) }, '9.9.9.9')).code, 400);
});

test('truncated model JSON is repaired', () => {
  const parse = (t) => require('../api/agent.js').__parse(t);
  const cut = '{"risks":[{"title":"a","cheapest_test":"b"},{"title":"c","cheapest_test":"d"}],"experiment":{"title":"e","steps":["s1","s2"],"budget":"0","duration":"48';
  const r = parse(cut);
  assert.ok(r && r.risks.length === 2 && r.experiment.steps.length === 2);
});

test('assist mode returns a draft and validates the step', async () => {
  const origFetch = global.fetch;
  global.fetch = async () => ({ ok: true, text: async () => JSON.stringify({ choices: [{ message: { content: JSON.stringify({ title: 'Script', draft: 'Q1? Q2?', tips: ['a', 'b'] }) } }] }) });
  try {
    const bad = await call({ mode: 'assist', step: 'x', idea: { title: 't' } }, '8.8.8.8');
    assert.strictEqual(bad.code, 400);
    const ok = await call({ mode: 'assist', lang: 'ru', step: 'Найди 10 репетиторов', idea: { title: 'Напоминания' }, experiment: { title: 'e', hypothesis: 'h' } }, '8.8.4.4');
    assert.strictEqual(ok.code, 200);
    assert.strictEqual(ok.body.result.draft, 'Q1? Q2?');
    assert.strictEqual(ok.body.result.tips.length, 2);
  } finally { global.fetch = origFetch; }
});
