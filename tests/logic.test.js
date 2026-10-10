'use strict';
const test = require('node:test');
const assert = require('node:assert');
const L = require('../logic.js');

test('no data is inconclusive, score UNVALIDATED', () => {
  const ev = L.evaluate({});
  assert.strictEqual(ev.outcome, 'inconclusive');
  assert.strictEqual(L.realityScore({ experiments: [] }).label, 'UNVALIDATED');
  assert.strictEqual(L.realityScore({ experiments: [] }).score, 0);
});

test('views alone never support a hypothesis', () => {
  const ev = L.evaluate({ views: 5000 });
  assert.strictEqual(ev.outcome, 'inconclusive');
  assert.strictEqual(ev.tier, 'attention');
  assert.ok(ev.reasons.includes('attention'));
});

test('payments with enough conversations support', () => {
  const ev = L.evaluate({ conversations: 8, paid: 3, leads: 4 });
  assert.strictEqual(ev.outcome, 'supported');
  assert.strictEqual(ev.strength, 'strong');
});

test('leads need a ratio to conversations', () => {
  assert.strictEqual(L.evaluate({ conversations: 30, leads: 3 }).outcome, 'inconclusive');
  assert.strictEqual(L.evaluate({ conversations: 10, leads: 3 }).outcome, 'supported');
});

test('ten conversations and zero intent reject', () => {
  const ev = L.evaluate({ conversations: 12, positive: 1, negative: 6 });
  assert.strictEqual(ev.outcome, 'rejected');
});

test('mixed yes and no is contradictory', () => {
  assert.strictEqual(L.evaluate({ conversations: 10, positive: 4, negative: 4 }).outcome, 'contradictory');
});

test('metrics are sanitized', () => {
  const m = L.cleanMetrics({ views: -5, paid: 'abc', leads: 3.9, spend: 1e15 });
  assert.strictEqual(m.views, 0);
  assert.strictEqual(m.paid, 0);
  assert.strictEqual(m.leads, 3);
  assert.strictEqual(m.spend, 100000000);
});

test('score grows with stronger evidence and stays within 0..100', () => {
  const weak = L.realityScore({ experiments: [{ status: 'done', metrics: { views: 300 }, evaluation: { outcome: 'inconclusive' } }] });
  const strong = L.realityScore({ experiments: [{ status: 'done', metrics: { views: 300, conversations: 20, leads: 12, paid: 6 }, evaluation: { outcome: 'supported' } }] });
  assert.ok(weak.score > 0 && weak.score < 25);
  assert.strictEqual(weak.label, 'EARLY');
  assert.ok(strong.score > weak.score && strong.score <= 100);
  assert.strictEqual(strong.label, 'STRONGER');
});

test('unfinished experiments do not count', () => {
  const rs = L.realityScore({ experiments: [{ status: 'active', metrics: { paid: 5, conversations: 15 } }] });
  assert.strictEqual(rs.score, 0);
});

test('next moves reflect outcome and never claim doom', () => {
  const rej = L.nextMoves(L.evaluate({ conversations: 12, negative: 5 }), 'en');
  assert.strictEqual(rej.length, 3);
  assert.ok(rej.some((m) => m.id === 'stop'));
  rej.forEach((m) => { assert.ok(m.why && m.basis && m.time && m.useful && m.steps.length); assert.ok(!/doomed|guaranteed/i.test(m.why)); });
  const ok = L.nextMoves(L.evaluate({ conversations: 8, paid: 1 }), 'ru');
  assert.ok(ok.some((m) => m.id === 'price'));
  assert.ok(ok[0].basis.includes('оплат'));
});

test('report encoding round-trips unicode and rejects junk', () => {
  const enc = L.encodeReport({ t: 'Идея <b>x</b>', r: 'Риск', s: 'PARTIAL', n: 2, k: 'вывод', l: 'ru', v: 41 });
  const dec = L.decodeReport(enc);
  assert.strictEqual(dec.t, 'Идея  b x /b');
  assert.strictEqual(dec.s, 'PARTIAL');
  assert.strictEqual(dec.n, 2);
  assert.strictEqual(L.decodeReport('!!!'), null);
  assert.strictEqual(L.decodeReport('x'.repeat(5000)), null);
  const evil = Buffer.from(JSON.stringify({ t: 'a', s: 'HACKED', n: 'zzz', extra: { a: 1 } })).toString('base64url');
  const d2 = L.decodeReport(evil);
  assert.strictEqual(d2.s, 'UNVALIDATED');
  assert.strictEqual(d2.n, 0);
  assert.strictEqual(d2.extra, undefined);
});

test('page clicks count as weak intent, never as payment', () => {
  const ev = L.evaluate({ views: 100, wants: 12, wouldpay: 11 });
  assert.strictEqual(ev.outcome, 'supported');
  assert.strictEqual(ev.strength, 'weak');
  assert.ok(ev.reasons.includes('pageintent'));
  assert.notStrictEqual(ev.tier, 'payment');
  const zero = L.evaluate({ views: 80, measured: true });
  assert.strictEqual(zero.outcome, 'inconclusive');
  assert.ok(zero.reasons.includes('pagezero'));
  const rs = L.realityScore({ experiments: [{ status: 'done', metrics: { wouldpay: 10 }, evaluation: { outcome: 'inconclusive' } }] });
  assert.ok(rs.score > 0 && rs.score < 25);
});

test('simulator: arithmetic, scenarios and break-even', () => {
  const p = { model: 'subscription', price: 10, visitors: 1000, conv: 5, churn: 10, growth: 0, fixed: 100, marketing: 0, varCost: 1, startup: 0 };
  const base = L.simulate(p, 'base');
  assert.strictEqual(base.rows.length, 12);
  assert.ok(Math.abs(base.rows[0].customers - 50) < 1e-9);
  assert.ok(Math.abs(base.rows[0].revenue - 500) < 1e-9);
  assert.ok(Math.abs(base.rows[0].profit - (500 - 100 - 50)) < 1e-9);
  assert.strictEqual(base.breakEvenMonth, 1);
  assert.strictEqual(base.needCustomers, Math.ceil(100 / 9));
  assert.ok(L.simulate(p, 'pess').profit12 < base.profit12 && base.profit12 < L.simulate(p, 'opt').profit12);
  const loss = L.simulate({ model: 'onetime', price: 5, visitors: 100, conv: 1, fixed: 200, startup: 300 }, 'base');
  assert.strictEqual(loss.breakEvenMonth, null);
  assert.ok(loss.cashNeeded > 300);
  const junk = L.simulate({ price: 'abc', conv: 500, churn: -5 }, 'base');
  assert.ok(junk.params.conv === 100 && junk.params.churn === 0 && isFinite(junk.profit12));
});
