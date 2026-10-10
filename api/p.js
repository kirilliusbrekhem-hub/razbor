'use strict';

/*
  Публичная страница идеи: /p/<id>. Собирается на сервере, чтобы ссылку можно было красиво показывать в мессенджерах
  (заголовок и описание), а текст попадал в страницу сразу. Все значения экранируются.
*/

const redis = require('./_redis.js');
const pages = require('./page.js');

const T = {
  ru: {
    badge: 'Идея в проверке: продукта пока нет', need: 'Мне это нужно', pay: 'Заплатил бы за это', sub: 'Оплаты здесь нет: кнопки только отмечают интерес. Ничего вводить не нужно.',
    thanks: 'Спасибо, ответ записан.', benefits: 'Что это даст', steps: 'Как это будет работать', aud: 'Для кого', pain: 'Какую проблему решает', faq: 'Частые вопросы',
    proof: 'человек уже отметил интерес', share: 'Знаешь, кому это тоже нужно?', shareSub: 'Отправь ссылку: чем больше людей ответит, тем яснее, стоит ли это делать.',
    copy: 'Копировать ссылку', copied: 'Ссылка скопирована', made: 'Страница создана на razbor.', cta: 'Проверь свою идею за 2 минуты', report: 'Пожаловаться', reported: 'Спасибо, жалоба отправлена.',
    gone: 'Страница не найдена или скрыта.', store: 'Хранилище страниц не подключено.', home: 'На главную'
  },
  en: {
    badge: 'Idea in testing: there is no product yet', need: 'I need this', pay: 'I would pay for this', sub: 'There is no payment here: the buttons only mark interest. You do not need to enter anything.',
    thanks: 'Thanks, your answer is recorded.', benefits: 'What you would get', steps: 'How it would work', aud: 'Who it is for', pain: 'The problem it solves', faq: 'Questions',
    proof: 'person already marked interest', share: 'Know someone who needs this too?', shareSub: 'Send the link: the more people answer, the clearer it is whether it is worth building.',
    copy: 'Copy the link', copied: 'Link copied', made: 'Page made on razbor.', cta: 'Validate your idea in 2 minutes', report: 'Report', reported: 'Thanks, the report was sent.',
    gone: 'The page was not found or is hidden.', store: 'Page storage is not connected.', home: 'Home'
  }
};

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const CSS = `
:root{--paper:#F6F8FC;--surface:#fff;--grid:rgba(43,75,219,.10);--ink:#16213E;--muted:#56617F;--line:#C3CCE2;--pen:#2B4BDB;--marker:#FFE14D;--accent:#FFE14D;--on:#16213E;--red:#C8372B}
[data-theme=sky]{--accent:#2B4BDB;--on:#fff}
[data-theme=night]{--paper:#0E1630;--surface:#152042;--grid:rgba(140,165,255,.10);--ink:#E9EDFA;--muted:#9AA6C8;--line:#2C3860;--pen:#9DB0FF;--accent:#FFE14D;--on:#16213E}
[data-theme=paper]{--accent:#16213E;--on:#F6F8FC}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background-color:var(--paper);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:28px 28px;color:var(--ink);font:400 1.0625rem/1.6 "Golos Text",system-ui,sans-serif}
.wrap{max-width:720px;margin:0 auto;padding:20px 20px 56px}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 20px}
.top img{height:36px;width:auto;display:block}
.badge{display:inline-block;padding:.2rem .7rem;background:var(--accent);color:var(--on);border:2px solid var(--ink);border-radius:6px;font:600 .8rem "Golos Text",sans-serif}
.hero{background:var(--surface);border:2px solid var(--ink);border-radius:6px;padding:26px 22px;box-shadow:6px 6px 0 var(--accent)}
h1{margin:12px 0 10px;font:700 clamp(1.6rem,6vw,2.5rem)/1.1 "Unbounded","Arial Black",sans-serif;letter-spacing:-.02em}
.lead{margin:0;font-size:1.12rem;max-width:56ch}
.btns{display:grid;gap:10px;margin:22px 0 8px;grid-template-columns:1fr}
@media(min-width:560px){.btns{grid-template-columns:1fr 1fr}}
button,.btn{font:600 1rem "Golos Text",sans-serif;padding:.85rem 1.2rem;border:2px solid var(--ink);border-radius:6px;background:var(--ink);color:var(--paper);cursor:pointer;text-align:center;text-decoration:none;display:inline-block}
button.alt{background:var(--accent);color:var(--on)}
button:disabled{opacity:.6;cursor:default}
button:hover:not(:disabled),.btn:hover{transform:translateY(-1px)}
.note{margin:6px 0 0;color:var(--muted);font-size:.85rem}
.thanks{margin:10px 0 0;font:600 1.5rem "Caveat",cursive;color:var(--pen);min-height:1.6em}
.proof{margin:12px 0 0;font-weight:600}
section{margin:26px 0 0}
h2{margin:0 0 10px;font:700 1.15rem "Unbounded","Arial Black",sans-serif}
.cards{display:grid;gap:10px;grid-template-columns:1fr}
@media(min-width:560px){.cards{grid-template-columns:repeat(3,1fr)}}
.card{background:var(--surface);border:2px solid var(--ink);border-radius:6px;padding:14px 16px}
ol.steps{list-style:none;margin:0;padding:0;display:grid;gap:10px;counter-reset:s}
ol.steps li{counter-increment:s;background:var(--surface);border:2px solid var(--ink);border-radius:6px;padding:12px 16px 12px 52px;position:relative}
ol.steps li::before{content:counter(s);position:absolute;left:12px;top:10px;width:28px;height:28px;border-radius:50%;background:var(--accent);color:var(--on);border:2px solid var(--ink);font:700 .9rem "Unbounded",sans-serif;display:flex;align-items:center;justify-content:center}
.two{display:grid;gap:10px}
@media(min-width:560px){.two{grid-template-columns:1fr 1fr}}
.card h3{margin:0 0 4px;font:600 .9rem "Golos Text",sans-serif;color:var(--muted)}
.card p{margin:0}
details.q{background:var(--surface);border:2px solid var(--ink);border-radius:6px;padding:10px 16px;margin:0 0 8px}
details.q summary{cursor:pointer;font-weight:600}
details.q p{margin:8px 0 0}
.sharebox{background:var(--accent);color:var(--on);border:2px solid var(--ink);border-radius:6px;padding:18px}
.sharebox h2{margin:0 0 4px}
.sharebox p{margin:0 0 12px}
.sh{display:flex;flex-wrap:wrap;gap:8px}
.sh a,.sh button{padding:.5rem .9rem;font-size:.9rem;background:var(--surface);color:var(--ink);border:2px solid var(--ink);border-radius:6px;text-decoration:none;font-weight:600}
.foot{margin-top:24px;display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;color:var(--muted);font-size:.85rem}
.foot a{color:var(--pen)}
.linkbtn{background:none;border:0;padding:0;color:var(--pen);font:500 .85rem "Golos Text",sans-serif;text-decoration:underline}
.mk{display:block;margin:26px 0 0;text-align:center}
:focus-visible{outline:3px solid var(--pen);outline-offset:3px}
@media(prefers-reduced-motion:reduce){button,.btn{transition:none}}
`;

const SCRIPT = `
(function(){
  var id=document.body.getAttribute('data-id');
  var T=JSON.parse(document.getElementById('tx').textContent);
  function post(type){return fetch('/api/page',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'event',id:id,type:type})}).then(function(r){return r.json()}).catch(function(){return null});}
  function done(t){try{return localStorage.getItem('razbor.page.'+id+'.'+t)==='1'}catch(e){return false}}
  function mark(t){try{localStorage.setItem('razbor.page.'+id+'.'+t,'1')}catch(e){}}
  var thanks=document.getElementById('thanks');
  var shareBox=document.getElementById('sharebox');
  Array.prototype.forEach.call(document.querySelectorAll('[data-ev]'),function(b){
    var t=b.getAttribute('data-ev');
    if(done(t))b.disabled=true;
    b.addEventListener('click',function(){
      b.disabled=true;mark(t);
      post(t).then(function(){thanks.textContent=T.thanks;if(shareBox)shareBox.scrollIntoView({behavior:'smooth',block:'center'});});
    });
  });
  var rep=document.getElementById('rep');
  if(rep){if(done('report'))rep.disabled=true;rep.addEventListener('click',function(){rep.disabled=true;mark('report');post('report').then(function(){rep.textContent=T.reported;});});}
  var url=location.origin+location.pathname;
  var sh=document.getElementById('sh-copy');
  if(sh)sh.addEventListener('click',function(){
    var ok=function(){sh.textContent=T.copied;post('share');};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(ok,function(){});}
  });
  Array.prototype.forEach.call(document.querySelectorAll('a[data-share]'),function(a){a.addEventListener('click',function(){if(!done('share')){mark('share');}post('share');});});
  if(!done('view')){mark('view');}
  post('view');
})();
`;

function shell(lang, theme, head, body, id) {
  return '<!doctype html><html lang="' + lang + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<meta name="robots" content="noindex, nofollow"><meta name="color-scheme" content="light dark">' + head +
    '<link rel="icon" href="/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">' +
    '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Golos+Text:wght@400;500;600&family=Unbounded:wght@500;700&display=swap" rel="stylesheet">' +
    '<style>' + CSS + '</style></head><body data-theme="' + esc(theme) + '"' + (id ? ' data-id="' + esc(id) + '"' : '') + '><div class="wrap">' + body + '</div></body></html>';
}

function render(page, id, counts, origin) {
  const lang = page.lang === 'en' ? 'en' : 'ru';
  const t = T[lang];
  const L = page.landing || {};
  const headline = L.headline || page.title;
  const lead = L.sub || page.pitch;
  const url = origin + '/p/' + id;
  const interested = counts.needs + counts.pays;

  const meta = '<title>' + esc(headline) + ' — razbor</title>' +
    '<meta name="description" content="' + esc(lead) + '">' +
    '<meta property="og:type" content="website"><meta property="og:title" content="' + esc(headline) + '"><meta property="og:description" content="' + esc(lead) + '">' +
    '<meta property="og:url" content="' + esc(url) + '"><meta property="og:image" content="' + esc(origin + '/icon-512.png') + '"><meta name="twitter:card" content="summary">';

  let b = '<header class="top"><a href="/"><img src="/logo.png" width="624" height="207" alt="razbor — Idea starts here."></a></header>';
  b += '<main><div class="hero"><span class="badge">' + esc(t.badge) + '</span><h1>' + esc(headline) + '</h1><p class="lead">' + esc(lead) + '</p>' +
    '<div class="btns"><button type="button" data-ev="need">' + esc(t.need) + '</button><button type="button" class="alt" data-ev="pay">' + esc(t.pay) + '</button></div>' +
    '<p class="note">' + esc(t.sub) + '</p><p class="thanks" id="thanks" role="status"></p>' +
    (interested >= 3 ? '<p class="proof">' + interested + ' ' + esc(t.proof) + '</p>' : '') + '</div>';

  if (L.benefits && L.benefits.length) {
    b += '<section><h2>' + esc(t.benefits) + '</h2><div class="cards">' + L.benefits.map((x) => '<div class="card"><p>' + esc(x) + '</p></div>').join('') + '</div></section>';
  }
  if (L.steps && L.steps.length) {
    b += '<section><h2>' + esc(t.steps) + '</h2><ol class="steps">' + L.steps.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol></section>';
  }
  const two = [];
  if (page.audience) two.push('<div class="card"><h3>' + esc(t.aud) + '</h3><p>' + esc(page.audience) + '</p></div>');
  if (page.pain) two.push('<div class="card"><h3>' + esc(t.pain) + '</h3><p>' + esc(page.pain) + '</p></div>');
  if (two.length) b += '<section><div class="two">' + two.join('') + '</div></section>';
  if (L.faq && L.faq.length) {
    b += '<section><h2>' + esc(t.faq) + '</h2>' + L.faq.map((f) => '<details class="q"><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>').join('') + '</section>';
  }
  const text = encodeURIComponent(headline);
  const u = encodeURIComponent(url);
  b += '<section><div class="sharebox" id="sharebox"><h2>' + esc(t.share) + '</h2><p>' + esc(t.shareSub) + '</p><div class="sh">' +
    '<a data-share href="https://t.me/share/url?url=' + u + '&text=' + text + '" target="_blank" rel="noopener noreferrer">Telegram</a>' +
    '<a data-share href="https://wa.me/?text=' + text + '%20' + u + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
    '<a data-share href="https://vk.com/share.php?url=' + u + '&title=' + text + '" target="_blank" rel="noopener noreferrer">VK</a>' +
    '<a data-share href="https://twitter.com/intent/tweet?url=' + u + '&text=' + text + '" target="_blank" rel="noopener noreferrer">X</a>' +
    '<button type="button" id="sh-copy">' + esc(t.copy) + '</button></div></div></section>';
  b += '<a class="btn mk" href="/">' + esc(t.cta) + '</a></main>';
  b += '<div class="foot"><span>' + esc(t.made) + '</span><button type="button" class="linkbtn" id="rep">' + esc(t.report) + '</button></div>';
  b += '<script type="application/json" id="tx">' + JSON.stringify({ thanks: t.thanks, copied: t.copied, reported: t.reported }).replace(/</g, '\\u003c') + '</script><script>' + SCRIPT + '</script>';
  return shell(lang, page.theme || 'sun', meta, b, id);
}

function message(lang, text, code) {
  const t = T[lang] || T.ru;
  return { code, html: shell(lang, 'sun', '<title>razbor</title>', '<main class="hero"><h1>' + esc(text) + '</h1><p><a class="btn" href="/">' + esc(t.home) + '</a></p></main>', '') };
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const id = String((req.query && req.query.id) || '').toLowerCase();
  const send = (m) => res.status(m.code).send(m.html);
  if (!redis.configured()) return send(message('ru', T.ru.store, 503));
  try {
    const page = await pages.load(id);
    if (!page) return send(message('ru', T.ru.gone, 404));
    const counts = await pages.counts(id);
    if (page.hidden || counts.reports >= pages.HIDE_AT_REPORTS) return send(message(page.lang === 'en' ? 'en' : 'ru', (T[page.lang === 'en' ? 'en' : 'ru']).gone, 410));
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').replace(/[^a-zA-Z0-9.:-]/g, '');
    const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0] === 'http' ? 'http' : 'https';
    return res.status(200).send(render(page, id, counts, host ? proto + '://' + host : ''));
  } catch (err) {
    console.error('page render error:', err && err.message);
    return send(message('ru', 'Сервис временно недоступен.', 502));
  }
};
module.exports.render = render;
