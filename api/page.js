'use strict';

/*
  Страницы-проверки спроса. Человек публикует мини-страницу своей идеи, а сайт считает уникальных посетителей
  и нажатия «Мне это нужно» и «Заплатил бы за это». Ни почты, ни телефонов, ни платежей: только счётчики.
  Хранилище: Upstash Redis (см. README). Без него функция честно отвечает, что хранилище не подключено.
*/

const crypto = require('crypto');
const redis = require('./_redis.js');

const TTL = 60 * 24 * 3600;
const HIDE_AT_REPORTS = 3;
const EVENTS = ['view', 'need', 'pay', 'report'];

const MSG = {
  ru: {
    method: 'Этот адрес принимает только запросы с сайта.',
    storage: 'Хранилище для страниц ещё не подключено (см. README: Upstash Redis через Vercel Storage).',
    bad: 'Не получилось прочитать запрос.',
    short: 'Нужны название и описание идеи хотя бы в одном-двух предложениях.',
    links: 'В тексте страницы нельзя оставлять ссылки, почту и телефоны. Убери их из описания идеи.',
    rate: 'Слишком много запросов. Подожди немного.',
    gone: 'Страница не найдена или скрыта.',
    auth: 'Нет доступа к этой странице.',
    down: 'Сервис временно недоступен. Попробуй позже.'
  },
  en: {
    method: 'This address only accepts requests from the website.',
    storage: 'Page storage is not connected yet (see README: Upstash Redis via Vercel Storage).',
    bad: 'Could not read the request.',
    short: 'A title and a description of the idea of at least one or two sentences are required.',
    links: 'Page text cannot contain links, emails or phone numbers. Remove them from the idea description.',
    rate: 'Too many requests. Please wait a little.',
    gone: 'The page was not found or is hidden.',
    auth: 'No access to this page.',
    down: 'The service is temporarily unavailable. Please try again later.'
  }
};

const buckets = new Map();
function limited(key, max, ms) {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, list] of buckets) if (!list.some((t) => now - t < 3600000)) buckets.delete(k);
  }
  const recent = (buckets.get(key) || []).filter((t) => now - t < ms);
  if (recent.length >= max) { buckets.set(key, recent); return true; }
  recent.push(now);
  buckets.set(key, recent);
  return false;
}

function clean(v, n) {
  return typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n) : '';
}
function hasLink(s) {
  return /(https?:|www\.|\b[a-z0-9-]+\.(com|ru|net|org|io|me|app|xyz|su|рф)\b|t\.me|@\w|\+?\d[\d\s().-]{8,}\d)/i.test(s);
}
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

function ipOf(req) {
  const f = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return f || (req.socket && req.socket.remoteAddress) || 'unknown';
}

async function load(id) {
  if (!/^[a-f0-9]{10}$/.test(id)) return null;
  const raw = await redis.cmd(['GET', 'pg:' + id]);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

async function counts(id) {
  const r = await redis.pipeline(EVENTS.map((e) => ['SCARD', 'pg:' + id + ':' + e]));
  return { views: r[0] || 0, needs: r[1] || 0, pays: r[2] || 0, reports: r[3] || 0 };
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const lang = (req.method === 'GET' ? (req.query && req.query.lang) : req.body && req.body.lang) === 'en' ? 'en' : 'ru';
  const M = MSG[lang];

  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: M.method });
  }
  if (!redis.configured()) return res.status(503).json({ error: M.storage, code: 'storage' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const ip = ipOf(req);

  try {
    if (req.method === 'GET') {
      const id = clean(req.query && req.query.id, 20);
      if (limited('g:' + ip, 120, 3600000)) return res.status(429).json({ error: M.rate });
      const page = await load(id);
      if (!page) return res.status(404).json({ error: M.gone });
      const c = await counts(id);
      if (page.hidden || c.reports >= HIDE_AT_REPORTS) return res.status(410).json({ error: M.gone });
      return res.status(200).json({ page: { title: page.title, pitch: page.pitch, audience: page.audience, pain: page.pain, lang: page.lang } });
    }

    if (!body || typeof body !== 'object') return res.status(400).json({ error: M.bad });
    const action = body.action;

    if (action === 'create') {
      if (limited('c:' + ip, 3, 3600000)) return res.status(429).json({ error: M.rate });
      const idea = body.idea && typeof body.idea === 'object' ? body.idea : {};
      const page = {
        title: clean(idea.title, 70), pitch: clean(idea.pitch, 300), audience: clean(idea.audience, 200), pain: clean(idea.pain, 200),
        lang: body.lang === 'en' ? 'en' : 'ru', created: new Date().toISOString()
      };
      if (page.title.length < 3 || page.pitch.length < 15) return res.status(400).json({ error: M.short });
      if (hasLink([page.title, page.pitch, page.audience, page.pain].join(' '))) return res.status(400).json({ error: M.links });
      const id = crypto.randomBytes(5).toString('hex');
      const token = crypto.randomBytes(16).toString('hex');
      page.tokenHash = sha(token);
      await redis.cmd(['SET', 'pg:' + id, JSON.stringify(page), 'EX', String(TTL)]);
      return res.status(200).json({ id, token });
    }

    const id = clean(body.id, 20);
    if (limited('e:' + ip, 90, 3600000)) return res.status(429).json({ error: M.rate });
    const page = await load(id);
    if (!page) return res.status(404).json({ error: M.gone });

    if (action === 'event') {
      if (EVENTS.indexOf(body.type) === -1) return res.status(400).json({ error: M.bad });
      const visitor = sha((process.env.PAGE_SALT || 'razbor') + '|' + ip + '|' + String(req.headers['user-agent'] || '') + '|' + id).slice(0, 20);
      const key = 'pg:' + id + ':' + body.type;
      const r = await redis.pipeline([['SADD', key, visitor], ['EXPIRE', key, String(TTL)]]);
      return res.status(200).json({ counted: r[0] === 1 });
    }

    const token = typeof body.token === 'string' ? body.token : '';
    if (!token || sha(token) !== page.tokenHash) return res.status(403).json({ error: M.auth });

    if (action === 'stats') {
      return res.status(200).json({ stats: await counts(id) });
    }
    if (action === 'delete') {
      await redis.pipeline([['DEL', 'pg:' + id], ['DEL', 'pg:' + id + ':view'], ['DEL', 'pg:' + id + ':need'], ['DEL', 'pg:' + id + ':pay'], ['DEL', 'pg:' + id + ':report']]);
      return res.status(200).json({ deleted: true });
    }
    return res.status(400).json({ error: M.bad });
  } catch (err) {
    console.error('page api error:', err && err.message);
    return res.status(502).json({ error: M.down });
  }
}

module.exports = handler;
module.exports.hasLink = hasLink;
