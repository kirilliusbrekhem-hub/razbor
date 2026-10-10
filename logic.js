/*
  Деловая логика razbor без привязки к странице: оценка результатов эксперимента,
  Reality Score, рекомендации следующего шага, ссылки для публикации.
  Всё считается по понятным правилам, а не придумывается языковой моделью.
  Файл работает и в браузере (window.RZLogic), и в Node (для тестов).
*/
(function (root) {
  'use strict';

  var STATUSES = ['UNTESTED', 'TESTING', 'SUPPORTED', 'REJECTED', 'INCONCLUSIVE'];

  function int(v, max) {
    var n = Math.floor(Number(v));
    if (!isFinite(n) || n < 0) return 0;
    return n > max ? max : n;
  }

  function cleanMetrics(m) {
    m = m || {};
    return {
      views: int(m.views, 1000000),
      conversations: int(m.conversations, 100000),
      positive: int(m.positive, 100000),
      negative: int(m.negative, 100000),
      leads: int(m.leads, 100000),
      paid: int(m.paid, 100000),
      spend: int(m.spend, 100000000)
    };
  }

  /*
    Оценка результата эксперимента.
    outcome: supported | rejected | inconclusive | contradictory
    strength: none | weak | moderate | strong
    tier: самый сильный сигнал: none < attention < conversation < intent < payment
    Просмотры и лайки внимание, но не готовность платить.
  */
  function evaluate(raw) {
    var m = cleanMetrics(raw);
    var tier = m.paid > 0 ? 'payment' : m.leads > 0 ? 'intent' : m.conversations > 0 ? 'conversation' : m.views > 0 ? 'attention' : 'none';
    var reasons = [];
    var outcome = 'inconclusive';
    var strength = 'none';

    var hi = Math.max(m.positive, m.negative);
    var lo = Math.min(m.positive, m.negative);

    if (tier === 'none') {
      reasons.push('nodata');
    } else if (m.positive >= 2 && m.negative >= 2 && lo / hi >= 0.5) {
      outcome = 'contradictory';
      reasons.push('mixed');
    } else if (m.paid >= 1 && m.conversations >= 5) {
      outcome = 'supported';
      strength = m.paid >= 3 ? 'strong' : 'moderate';
      reasons.push('paid');
    } else if (m.leads >= 3 && m.conversations >= 5 && m.leads / m.conversations >= 0.2) {
      outcome = 'supported';
      strength = m.leads >= 5 ? 'moderate' : 'weak';
      reasons.push('intent');
    } else if (m.conversations >= 10 && m.leads === 0 && m.paid === 0) {
      outcome = 'rejected';
      strength = 'moderate';
      reasons.push('nobody');
    } else if (m.conversations >= 5 && m.negative >= 3 && m.positive === 0 && m.leads + m.paid === 0) {
      outcome = 'rejected';
      strength = 'weak';
      reasons.push('negative');
    } else if (tier === 'attention' || (m.views >= 100 && m.leads + m.paid === 0)) {
      reasons.push('attention');
    } else if (m.paid >= 1 || m.leads >= 1) {
      reasons.push('few');
    } else {
      reasons.push('small');
    }
    return { outcome: outcome, strength: strength, tier: tier, reasons: reasons, metrics: m };
  }

  function statusFor(outcome) {
    if (outcome === 'supported') return 'SUPPORTED';
    if (outcome === 'rejected') return 'REJECTED';
    return 'INCONCLUSIVE';
  }

  /*
    Reality Score, 0-100. Показывает, сколько настоящих свидетельств собрано, а не вероятность успеха.
    Предположения пользователя и выводы ИИ дают 0 баллов. Внешних источников сайт не подключал,
    поэтому ссылки на материалы, добавленные пользователем, дают немного баллов и помечены как непроверенные.
  */
  var WEIGHTS = { attention: 5, conversation: 20, intent: 25, payment: 40, links: 10 };

  function realityScore(project) {
    var done = ((project && project.experiments) || []).filter(function (e) { return e.status === 'done' && e.metrics; });
    var tot = { views: 0, conversations: 0, leads: 0, paid: 0, links: 0, positive: 0, negative: 0 };
    var supported = 0, rejected = 0, other = 0;
    done.forEach(function (e) {
      var m = cleanMetrics(e.metrics);
      tot.views += m.views; tot.conversations += m.conversations; tot.leads += m.leads; tot.paid += m.paid;
      tot.positive += m.positive; tot.negative += m.negative;
      tot.links += Math.min(((e.links || []).length), 5);
      var o = e.evaluation && e.evaluation.outcome;
      if (o === 'supported') supported++; else if (o === 'rejected') rejected++; else other++;
    });
    function part(value, cap, weight) { return Math.round(Math.min(value, cap) / cap * weight); }
    var parts = [
      { key: 'attention', points: part(tot.views, 200, WEIGHTS.attention), max: WEIGHTS.attention, value: tot.views },
      { key: 'conversation', points: part(tot.conversations, 15, WEIGHTS.conversation), max: WEIGHTS.conversation, value: tot.conversations },
      { key: 'intent', points: part(tot.leads, 10, WEIGHTS.intent), max: WEIGHTS.intent, value: tot.leads },
      { key: 'payment', points: part(tot.paid, 5, WEIGHTS.payment), max: WEIGHTS.payment, value: tot.paid },
      { key: 'links', points: Math.min(tot.links, 5) * 2, max: WEIGHTS.links, value: tot.links }
    ];
    var score = parts.reduce(function (a, p) { return a + p.points; }, 0);
    if (score > 100) score = 100;
    var label = score === 0 ? 'UNVALIDATED' : score < 25 ? 'EARLY' : score < 60 ? 'PARTIAL' : 'STRONGER';
    return { score: score, label: label, parts: parts, experiments: done.length, supported: supported, rejected: rejected, other: other };
  }

  /* Что может поднять оценку: самые дешёвые недостающие свидетельства. */
  function scoreHints(rs) {
    var by = {};
    rs.parts.forEach(function (p) { by[p.key] = p; });
    var hints = [];
    if (by.conversation.points < by.conversation.max) hints.push('conversation');
    if (by.intent.points < by.intent.max) hints.push('intent');
    if (by.payment.points < by.payment.max) hints.push('payment');
    return hints.slice(0, 3);
  }

  /* ---------- Следующий шаг ---------- */

  var MOVES = {
    ru: {
      more: { title: 'Провести ещё пять интервью', time: '1-2 дня', money: '0', useful: 'Ещё 5 разговоров с людьми из той же аудитории, из которых видно, повторяется ли ответ.', steps: ['Найди 5 новых людей из своей аудитории.', 'Задай те же вопросы про прошлый опыт, не про идею.', 'Запиши, кто готов получить решение или оплатить.'] },
      offer: { title: 'Изменить оффер и проверить заново', time: '2 дня', money: '0', useful: 'Новая формулировка даёт больше заявок на то же число показов или разговоров.', steps: ['Перепиши обещание: кому, какой результат, за какое время.', 'Покажи новую версию тем же людям или в том же месте.', 'Сравни число заявок с прошлым разом.'] },
      price: { title: 'Протестировать цену', time: '2 дня', money: '0', useful: 'Понятно, при какой цене люди переходят от интереса к оплате или предоплате.', steps: ['Назови реальную цену в конце разговора.', 'Запиши реакцию и спроси, готов ли человек оплатить сейчас.', 'Сравни с первой ценой.'] },
      audience: { title: 'Протестировать другую аудиторию', time: '2-3 дня', money: '0', useful: 'Есть группа, где заявок заметно больше, чем в прошлой.', steps: ['Выбери соседнюю аудиторию с похожей проблемой.', 'Проведи 5 коротких разговоров или покажи оффер в их сообществе.', 'Сравни результат с первой группой.'] },
      channel: { title: 'Проверить канал привлечения', time: '2-3 дня', money: '0', useful: 'Понятно, где можно бесплатно найти людей, которые оставляют заявки.', steps: ['Выбери одно место, где собирается аудитория (сообщество, чат, форум).', 'Опубликуй честное описание и ссылку на форму заявки.', 'Посчитай переходы и заявки.'] },
      mvp: { title: 'Сделать простой MVP на тех, кто готов платить', time: '1-2 недели', money: 'по оценке: минимальные', useful: 'Хотя бы один человек пользуется результатом и подтверждает, что он решает проблему.', steps: ['Выбери 1-3 человек, которые оставили заявку или оплатили.', 'Сделай вручную минимальную версию решения, без автоматизации.', 'Попроси обратную связь и повторную оплату.'] },
      stop: { title: 'Остановить эту гипотезу и исследовать альтернативу', time: '1 день', money: '0', useful: 'Выбрана другая гипотеза или другая идея, которую стоит проверить следующей.', steps: ['Запиши, что именно не подтвердилось.', 'Выбери другую проблему из разговоров, на которую люди реагировали сильнее.', 'Сформулируй для неё одну гипотезу.'] },
      segment: { title: 'Разделить ответы по группам людей', time: '1-2 дня', money: '0', useful: 'Видно, какая группа говорит «да», а какая «нет», и почему.', steps: ['Раздели собеседников по признаку: профессия, опыт, ситуация.', 'Посчитай «да» и «нет» отдельно по группам.', 'Выбери группу с самым сильным «да» и проверь её отдельно.'] }
    },
    en: {
      more: { title: 'Run five more interviews', time: '1-2 days', money: '0', useful: 'Five more conversations with the same audience show whether the answer repeats.', steps: ['Find 5 new people from your audience.', 'Ask the same questions about their past experience, not about your idea.', 'Note who wants the solution or would pay.'] },
      offer: { title: 'Change the offer and test again', time: '2 days', money: '0', useful: 'The new wording gets more sign-ups for the same number of views or conversations.', steps: ['Rewrite the promise: who, what result, how fast.', 'Show the new version to the same people or in the same place.', 'Compare sign-ups with last time.'] },
      price: { title: 'Test the price', time: '2 days', money: '0', useful: 'You see at what price people move from interest to payment or prepayment.', steps: ['State a real price at the end of the conversation.', 'Record the reaction and ask if the person would pay now.', 'Compare with the first price.'] },
      audience: { title: 'Test a different audience', time: '2-3 days', money: '0', useful: 'You find a group with clearly more sign-ups than the last one.', steps: ['Pick a neighbouring audience with a similar problem.', 'Hold 5 short conversations or show the offer in their community.', 'Compare the result with the first group.'] },
      channel: { title: 'Test an acquisition channel', time: '2-3 days', money: '0', useful: 'You learn where you can find people for free who leave sign-ups.', steps: ['Pick one place where the audience gathers (community, chat, forum).', 'Post an honest description with a link to a sign-up form.', 'Count clicks and sign-ups.'] },
      mvp: { title: 'Build a simple MVP for those willing to pay', time: '1-2 weeks', money: 'estimate: minimal', useful: 'At least one person uses the result and confirms it solves the problem.', steps: ['Pick 1-3 people who signed up or paid.', 'Build a minimal manual version of the solution, no automation.', 'Ask for feedback and a repeat payment.'] },
      stop: { title: 'Stop this hypothesis and explore an alternative', time: '1 day', money: '0', useful: 'You have picked another hypothesis or idea worth testing next.', steps: ['Write down exactly what was not confirmed.', 'Pick another problem from the conversations that people reacted to more strongly.', 'Formulate one hypothesis for it.'] },
      segment: { title: 'Split the answers by group of people', time: '1-2 days', money: '0', useful: 'You see which group says yes and which says no, and why.', steps: ['Split interviewees by a trait: job, experience, situation.', 'Count yes and no separately per group.', 'Pick the group with the strongest yes and test it on its own.'] }
    }
  };

  var WHY = {
    ru: {
      supported: 'Есть сигнал, но один эксперимент не доказывает успех. Нужно проверить, что он повторяется.',
      rejected: 'Гипотеза не получила поддержки на этих данных. Это не приговор всей идее, но продолжать вслепую не стоит.',
      inconclusive: 'Данных пока недостаточно для вывода.',
      contradictory: 'Ответы противоречат друг другу: возможно, у разных групп людей разная реакция.'
    },
    en: {
      supported: 'There is a signal, but one experiment does not prove success. You need to check that it repeats.',
      rejected: 'The hypothesis got no support from this data. It is not a verdict on the whole idea, but pushing on blindly is unwise.',
      inconclusive: 'There is not enough data for a conclusion yet.',
      contradictory: 'The answers contradict each other: different groups of people may react differently.'
    }
  };

  function basisText(ev, lang) {
    var m = ev.metrics;
    var ru = lang !== 'en';
    var parts = [];
    if (m.conversations) parts.push(ru ? 'разговоров: ' + m.conversations : 'conversations: ' + m.conversations);
    if (m.positive || m.negative) parts.push(ru ? '«да»: ' + m.positive + ', «нет»: ' + m.negative : 'yes: ' + m.positive + ', no: ' + m.negative);
    if (m.views) parts.push(ru ? 'просмотров: ' + m.views : 'views: ' + m.views);
    if (m.leads) parts.push(ru ? 'заявок: ' + m.leads : 'sign-ups: ' + m.leads);
    if (m.paid) parts.push(ru ? 'оплат: ' + m.paid : 'payments: ' + m.paid);
    if (!parts.length) parts.push(ru ? 'данных нет' : 'no data');
    return parts.join(', ');
  }

  /* Рекомендации после завершённого эксперимента. Возвращает до трёх вариантов. */
  function nextMoves(ev, lang) {
    lang = lang === 'en' ? 'en' : 'ru';
    var ids;
    var o = ev.outcome;
    if (o === 'supported') {
      ids = ev.strength === 'weak' ? ['more', 'price', 'channel'] : ['price', 'channel', 'mvp'];
    } else if (o === 'rejected') {
      ids = ['audience', 'offer', 'stop'];
    } else if (o === 'contradictory') {
      ids = ['segment', 'more', 'audience'];
    } else if (ev.tier === 'attention') {
      ids = ['offer', 'channel', 'more'];
    } else {
      ids = ['more', 'offer', 'channel'];
    }
    var basis = basisText(ev, lang);
    return ids.map(function (id) {
      var mv = MOVES[lang][id];
      return { id: id, title: mv.title, why: WHY[lang][o], basis: basis, time: mv.time, money: mv.money, useful: mv.useful, steps: mv.steps.slice() };
    });
  }

  /* ---------- Публичная карточка (без сервера, данные только в ссылке) ---------- */

  function clip(v, n) { return typeof v === 'string' ? v.replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, n) : ''; }

  function toB64(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function fromB64(b64) {
    var s = b64.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var bin = atob(s);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function cleanReport(r) {
    r = r || {};
    var label = ['UNVALIDATED', 'EARLY', 'PARTIAL', 'STRONGER'].indexOf(r.s) !== -1 ? r.s : 'UNVALIDATED';
    return {
      t: clip(r.t, 90),
      r: clip(r.r, 160),
      s: label,
      n: int(r.n, 999),
      k: clip(r.k, 200),
      l: r.l === 'en' ? 'en' : 'ru',
      v: int(r.v, 100)
    };
  }

  function encodeReport(r) { return toB64(JSON.stringify(cleanReport(r))); }
  function decodeReport(b64) {
    try {
      if (typeof b64 !== 'string' || b64.length > 2000) return null;
      var r = cleanReport(JSON.parse(fromB64(b64)));
      return r.t ? r : null;
    } catch (e) { return null; }
  }

  root.RZLogic = {
    STATUSES: STATUSES, cleanMetrics: cleanMetrics, evaluate: evaluate, statusFor: statusFor,
    realityScore: realityScore, scoreHints: scoreHints, nextMoves: nextMoves, MOVES: MOVES,
    encodeReport: encodeReport, decodeReport: decodeReport, cleanReport: cleanReport
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.RZLogic;
})(typeof window !== 'undefined' ? window : globalThis);
