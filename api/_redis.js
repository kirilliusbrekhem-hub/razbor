'use strict';

/*
  Минимальный клиент Upstash Redis по REST. Подходит и для Vercel Marketplace (переменные KV_REST_API_URL и
  KV_REST_API_TOKEN), и для самого Upstash (UPSTASH_REDIS_REST_URL и UPSTASH_REDIS_REST_TOKEN).
  Файлы с подчёркиванием в начале имени Vercel не считает функциями.
*/

function conf() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

function configured() {
  return !!conf();
}

async function post(path, body) {
  const c = conf();
  if (!c) throw new Error('storage not configured');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(c.url + path, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + c.token, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok) throw new Error('redis ' + response.status + ' ' + String((data && data.error) || '').slice(0, 120));
    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function cmd(args) {
  const data = await post('', args);
  if (data.error) throw new Error('redis ' + String(data.error).slice(0, 120));
  return data.result;
}

async function pipeline(commands) {
  const data = await post('/pipeline', commands);
  return data.map((x) => {
    if (x && x.error) throw new Error('redis ' + String(x.error).slice(0, 120));
    return x.result;
  });
}

module.exports = { configured, cmd, pipeline };
