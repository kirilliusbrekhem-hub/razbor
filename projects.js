/*
  Проекты razbor: Reality Check, эксперименты, доска гипотез, следующий шаг, публичная карточка.
  Данные хранятся в браузере (localStorage), на сервер не отправляются, кроме описания идеи для ИИ.
  Опирается на window.RZApp (из index.html) и window.RZLogic (logic.js).
*/
(function () {
  "use strict";
  var A = window.RZApp, L = window.RZLogic;
  if (!A || !L) return;
  var el = A.el, $ = A.$;
  var KEY = "razbor.projects.v1";
  var MAX_PROJECTS = 20;

  var P = {
    ru: {
      wsTitle: "Мои проекты",
      wsSub: "Идея превращается в проект: риски, эксперименты и доказательства хранятся в этом браузере. Ничего не публикуется, пока ты сам не создашь карточку.",
      wsEmpty: "Пока нет проектов. Получи разбор идеи выше и нажми «Создать проект и запустить Reality Check».",
      storageNote: "Проекты хранятся только в этом браузере и пропадут, если очистить данные сайта. Сохрани копию кнопкой «Скачать данные».",
      open: "Открыть", del: "Удалить", delConfirm: "Удалить проект «{t}» вместе с экспериментами? Это нельзя отменить.",
      back: "← Все проекты", exportBtn: "Скачать данные", updated: "Обновлён: ", exps: "экспериментов: ",
      createProject: "Создать проект и запустить Reality Check",
      created: "Проект создан. Идёт Reality Check…",
      tabs: { overview: "Обзор", diagnosis: "Диагноз идеи", risks: "Критичные риски", experiments: "Эксперименты", evidence: "Доска гипотез", history: "История", move: "Следующий шаг" },
      tabsAria: "Разделы проекта",
      realityRun: "Запустить Reality Check", realityRetry: "Повторить Reality Check",
      realityWait: "Ищу самые опасные допущения и придумываю эксперимент. Обычно это до минуты.",
      realityNeeded: "Reality Check ещё не запущен. Он найдёт три самых опасных риска и составит эксперимент на 48 часов.",
      realityFailed: "Не получилось. Проект и твой ввод сохранены, можно повторить.",
      realityRefusal: "Агент не смог разобрать эту идею: ",
      scoreTitle: "Reality Score",
      scoreNote: "Это не вероятность успеха и не оценка стоимости бизнеса. Это только то, сколько реальных свидетельств ты собрал.",
      outOf100: "из 100",
      labels: { UNVALIDATED: "UNVALIDATED", EARLY: "EARLY SIGNALS", PARTIAL: "PARTIAL EVIDENCE", STRONGER: "STRONGER EVIDENCE" },
      labelText: {
        UNVALIDATED: "Идея не проверена: пока есть только предположения и анализ ИИ.",
        EARLY: "Есть первые сигналы, но их мало для выводов.",
        PARTIAL: "Есть заметные свидетельства, но их ещё нужно повторить и расширить.",
        STRONGER: "Собрано много реальных свидетельств. Это всё равно не гарантия успеха."
      },
      evSources: "Из чего складывается оценка",
      evUser: "Предположения пользователя", evAi: "Выводы ИИ", evExt: "Внешние источники", evExp: "Результаты экспериментов",
      evUserVal: "{n} допущений, 0 баллов", evAiVal: "0 баллов: ИИ не видит рынок, это гипотезы",
      evExtVal: "не подключены. Источники сайт не использует", evExpVal: "завершено: {n}",
      parts: { attention: "Внимание (просмотры)", conversation: "Разговоры и ответы", intent: "Заявки и намерение", payment: "Оплаты и предоплаты", links: "Ссылки на свидетельства (не проверяются сайтом)" },
      hintsTitle: "Что может изменить оценку",
      hints: { conversation: "Живые разговоры с людьми из аудитории (до 15).", intent: "Заявки: люди оставляют контакт или записываются (до 10).", payment: "Реальные оплаты или предоплаты (до 5)." },
      primaryTitle: "Главный риск и главная гипотеза", primaryBadge: "PRIMARY RISK",
      pitch: "Суть идеи", audience: "Для кого", pain: "Какую боль решает", money: "Как может зарабатывать",
      assumptionsT: "Ключевые допущения", unknownsT: "Главные неизвестные",
      diagNote: "Здесь нет подтверждённых фактов. Всё это предположения ИИ и твои, пока не проверено в реальном мире.",
      importance: { high: "важность: высокая", medium: "важность: средняя", low: "важность: низкая" },
      riskWhy: "Почему критичен", riskIfWrong: "Если допущение неверно", riskConf: "Уверенность в оценке", riskTest: "Самый дешёвый способ проверить",
      conf: { high: "высокая", medium: "средняя", low: "низкая" },
      expNone: "Экспериментов пока нет.", expCurrent: "Текущий эксперимент", expDone: "Завершённые эксперименты",
      expStart: "Начать эксперимент", expPlanned: "Запланирован", expActive: "Идёт", expFinished: "Завершён",
      expDisclaimer: "48 часов это целевой срок, а не обещание результата. Эксперимент не гарантирует ни продаж, ни надёжной статистики.",
      expHyp: "Проверяемая гипотеза", expWhy: "Почему проверять сейчас", expSteps: "Действия по порядку", expBudget: "Примерный бюджет",
      expTime: "Время", expTools: "Инструменты", expSuccess: "Метрика успеха", expFail: "Критерий неудачи",
      expAmb: "Неоднозначные результаты", expNext: "Что делать дальше", ifSuccess: "Если получилось: ", ifFail: "Если нет: ", ifAmb: "Если неясно: ",
      aiNote: "Бюджет и цифры от ИИ: ориентир, а не данные.",
      obsT: "Наблюдения", obsPh: "Что ты заметил? Например: «Двое спросили про цену»", obsAdd: "Добавить",
      linksT: "Ссылки на свидетельства", linkPh: "https://...", linkAdd: "Добавить ссылку", linkBad: "Нужна ссылка, которая начинается с http:// или https://",
      resultsT: "Результаты",
      resultsHint: "Просмотры и лайки это внимание, а не готовность платить. Заявки и оплаты весят больше всего.",
      m: { views: "Просмотры (внимание)", conversations: "Разговоры и ответы", positive: "Из них «да, это нужно»", negative: "Из них «нет»", leads: "Заявки (оставили контакт)", paid: "Реальные оплаты или предоплаты", spend: "Расходы (в твоей валюте)" },
      finish: "Завершить эксперимент", finishDone: "Эксперимент завершён и записан в историю.",
      resultTitle: "Итог эксперимента",
      outcomes: { supported: "Гипотеза получила поддержку", rejected: "Гипотеза не получила поддержки", inconclusive: "Данных недостаточно", contradictory: "Результат противоречивый" },
      strength: { none: "", weak: "слабая поддержка", moderate: "средняя сила", strong: "сильный сигнал" },
      reason: {
        nodata: "Данных не внесено, вывод сделать нельзя.",
        mixed: "Есть много «да» и много «нет». Возможно, разные группы людей реагируют по-разному.",
        paid: "Есть реальные оплаты при достаточном числе разговоров. Это самый сильный сигнал.",
        intent: "Заметная доля собеседников оставила заявку: есть намерение, но это ещё не оплата.",
        nobody: "Не меньше десяти разговоров и ни одной заявки или оплаты.",
        negative: "Собеседники отвечали «нет» и никто не оставил заявку.",
        attention: "Есть внимание (просмотры), но нет заявок. Просмотры не доказывают готовность купить.",
        few: "Есть отдельные заявки или оплаты, но разговоров мало. Это может быть случайность или знакомые.",
        small: "Слишком мало ответов, чтобы делать вывод."
      },
      supportedNote: "SUPPORTED не значит «доказано»: поддержка могла быть случайной или зависеть от аудитории. Её нужно повторить.",
      evTitle: "Доска гипотез",
      evNote: "SUPPORTED означает, что гипотеза получила некоторую поддержку, а не окончательную истину. Её стоит перепроверять.",
      hStatus: { UNTESTED: "Не проверена", TESTING: "Проверяется", SUPPORTED: "Поддержана", REJECTED: "Отвергнута", INCONCLUSIVE: "Неясно" },
      hImportance: "Важность", hUpdated: "Обновлено: ", hNext: "Следующее действие", hNextPh: "Что сделать дальше?",
      hEvidence: "Свидетельства", hNoEvidence: "Свидетельств пока нет.", hAddEv: "Добавить свидетельство", hAddPh: "Что показал тест или разговор?",
      hAdd: "Записать",
      hNew: "Добавить гипотезу", hNewPh: "Например: люди готовы платить за это больше 500 в месяц", hNewBtn: "Добавить",
      histTitle: "История прогресса", histNone: "История пока пуста.",
      h: { created: "Проект создан", reality: "Reality Check готов", expStart: "Эксперимент начат: ", expDone: "Эксперимент завершён: ", status: "Статус гипотезы изменён: ", move: "Решение по шагу: ", hyp: "Добавлена гипотеза: ", evidence: "Добавлено свидетельство" },
      moveNone: "Следующий шаг появится после первого завершённого эксперимента: рекомендация опирается на твои реальные результаты.",
      moveBasis: "На чём основано: ", moveTime: "Время: ", moveMoney: "Деньги: ", moveUseful: "Полезный результат: ",
      accept: "Принять", decline: "Отклонить", alt: "Выбрать другой", accepted: "Принято: создан эксперимент", declined: "Отклонено", altChosen: "Выбрано как альтернатива: создан эксперимент",
      moveNote: "Один эксперимент не решает судьбу бизнеса. Это рекомендация, а не приговор и не гарантия.",
      moveFor: "По итогам: ",
      shareTitle: "Публичная карточка",
      shareNote: "По умолчанию проект приватный. Карточка создаётся отдельно и содержит только то, что ты видишь ниже. Заметки, ссылки и расходы в неё не попадают.",
      shareTakeaway: "Ключевой вывод (можно изменить)",
      shareConsent: "Я согласен, что эти данные станут публичными в ссылке и картинке",
      shareMake: "Создать карточку", shareNeedConsent: "Отметь согласие, чтобы создать карточку.",
      shareCopy: "Копировать ссылку", shareCopied: "Ссылка скопирована.", shareDl: "Скачать картинку", shareX: "Поделиться в X", shareReddit: "Поделиться в Reddit",
      shareLinkNote: "Данные лежат прямо в ссылке, на сервере ничего не хранится. Кто получил ссылку, тот видит карточку.",
      shareCta: "Test your idea with razbor",
      shareExps: "экспериментов",
      cardRisk: "Главный риск", cardStatus: "Статус проверки",
      reportTitle: "Публичная карточка Reality Check",
      reportNoRisk: "Главный риск пока не определён",
      takeaways: {
        UNVALIDATED: "Пока это только гипотеза: реальных данных нет.",
        EARLY: "Есть первые сигналы, но выводы делать рано.",
        PARTIAL: "Есть частичные свидетельства, их нужно повторить.",
        STRONGER: "Собрано много свидетельств, но проверка продолжается."
      },
      newExp: "Свой эксперимент", newExpTitle: "Название", newExpHyp: "Гипотеза", newExpBtn: "Создать эксперимент", newExpStepsPh: "Шаги, по одному на строку",
      needTitle: "Укажи название и гипотезу.",
      saved: "Сохранено.", storageFail: "Не удалось сохранить в браузере (память заполнена или отключена).",
      loading: "Загружаю…"
    },
    en: {
      wsTitle: "My projects",
      wsSub: "An idea becomes a project: risks, experiments and evidence are stored in this browser. Nothing is published until you create a card yourself.",
      wsEmpty: "No projects yet. Get a review of an idea above and press \"Create a project and run Reality Check\".",
      storageNote: "Projects are stored only in this browser and are lost if you clear site data. Keep a copy with the \"Download data\" button.",
      open: "Open", del: "Delete", delConfirm: "Delete the project \"{t}\" with its experiments? This cannot be undone.",
      back: "← All projects", exportBtn: "Download data", updated: "Updated: ", exps: "experiments: ",
      createProject: "Create a project and run Reality Check",
      created: "Project created. Running Reality Check…",
      tabs: { overview: "Overview", diagnosis: "Idea diagnosis", risks: "Critical risks", experiments: "Experiments", evidence: "Evidence board", history: "Progress history", move: "Next move" },
      tabsAria: "Project sections",
      realityRun: "Run Reality Check", realityRetry: "Retry Reality Check",
      realityWait: "Finding the most dangerous assumptions and designing an experiment. This usually takes up to a minute.",
      realityNeeded: "Reality Check has not run yet. It finds the three most dangerous risks and builds a 48-hour experiment.",
      realityFailed: "That did not work. The project and your input are saved, you can retry.",
      realityRefusal: "The agent could not review this idea: ",
      scoreTitle: "Reality Score",
      scoreNote: "This is not the probability of success and not a valuation. It only shows how much real evidence you have gathered.",
      outOf100: "out of 100",
      labels: { UNVALIDATED: "UNVALIDATED", EARLY: "EARLY SIGNALS", PARTIAL: "PARTIAL EVIDENCE", STRONGER: "STRONGER EVIDENCE" },
      labelText: {
        UNVALIDATED: "The idea is not validated: there are only assumptions and AI analysis so far.",
        EARLY: "There are first signals, but too few to draw conclusions.",
        PARTIAL: "There is noticeable evidence, but it still needs to be repeated and extended.",
        STRONGER: "A lot of real evidence has been gathered. It is still not a guarantee of success."
      },
      evSources: "What the score is made of",
      evUser: "User assumptions", evAi: "AI conclusions", evExt: "External sources", evExp: "Experiment results",
      evUserVal: "{n} assumptions, 0 points", evAiVal: "0 points: the AI cannot see the market, these are hypotheses",
      evExtVal: "not connected. The site does not use sources", evExpVal: "completed: {n}",
      parts: { attention: "Attention (views)", conversation: "Conversations and replies", intent: "Sign-ups and intent", payment: "Payments and prepayments", links: "Links to evidence (not verified by the site)" },
      hintsTitle: "What could change the score",
      hints: { conversation: "Live conversations with people from the audience (up to 15).", intent: "Sign-ups: people leave a contact or join a waitlist (up to 10).", payment: "Real payments or prepayments (up to 5)." },
      primaryTitle: "Primary risk and main hypothesis", primaryBadge: "PRIMARY RISK",
      pitch: "The idea", audience: "Who it is for", pain: "The pain it solves", money: "How it could earn",
      assumptionsT: "Key assumptions", unknownsT: "Main unknowns",
      diagNote: "There are no confirmed facts here. All of this is AI and user assumptions until tested in the real world.",
      importance: { high: "importance: high", medium: "importance: medium", low: "importance: low" },
      riskWhy: "Why it is critical", riskIfWrong: "If the assumption is wrong", riskConf: "Confidence in the assessment", riskTest: "Cheapest way to test it",
      conf: { high: "high", medium: "medium", low: "low" },
      expNone: "No experiments yet.", expCurrent: "Current experiment", expDone: "Completed experiments",
      expStart: "Start the experiment", expPlanned: "Planned", expActive: "In progress", expFinished: "Completed",
      expDisclaimer: "48 hours is a target, not a promise of results. An experiment guarantees neither sales nor reliable statistics.",
      expHyp: "Hypothesis being tested", expWhy: "Why test it now", expSteps: "Steps in order", expBudget: "Approximate budget",
      expTime: "Time", expTools: "Tools", expSuccess: "Success metric", expFail: "Failure criterion",
      expAmb: "Ambiguous results", expNext: "What to do next", ifSuccess: "If it worked: ", ifFail: "If not: ", ifAmb: "If unclear: ",
      aiNote: "Budget and numbers from the AI are a guide, not data.",
      obsT: "Observations", obsPh: "What did you notice? For example: \"Two people asked about the price\"", obsAdd: "Add",
      linksT: "Links to evidence", linkPh: "https://...", linkAdd: "Add link", linkBad: "Enter a link that starts with http:// or https://",
      resultsT: "Results",
      resultsHint: "Views and likes are attention, not willingness to pay. Sign-ups and payments weigh the most.",
      m: { views: "Views (attention)", conversations: "Conversations and replies", positive: "Of them, \"yes, I need this\"", negative: "Of them, \"no\"", leads: "Sign-ups (left a contact)", paid: "Real payments or prepayments", spend: "Spent (in your currency)" },
      finish: "Complete the experiment", finishDone: "The experiment is complete and recorded in the history.",
      resultTitle: "Experiment outcome",
      outcomes: { supported: "The hypothesis got support", rejected: "The hypothesis got no support", inconclusive: "Not enough data", contradictory: "The result is contradictory" },
      strength: { none: "", weak: "weak support", moderate: "moderate strength", strong: "strong signal" },
      reason: {
        nodata: "No data entered, so no conclusion is possible.",
        mixed: "There are many \"yes\" and many \"no\" answers. Different groups of people may react differently.",
        paid: "There are real payments with enough conversations. This is the strongest signal.",
        intent: "A noticeable share of interviewees signed up: there is intent, but it is not payment yet.",
        nobody: "At least ten conversations and not a single sign-up or payment.",
        negative: "Interviewees answered \"no\" and nobody signed up.",
        attention: "There is attention (views) but no sign-ups. Views do not prove willingness to buy.",
        few: "There are a few sign-ups or payments but few conversations. It could be chance or friends.",
        small: "Too few answers to draw a conclusion."
      },
      supportedNote: "SUPPORTED does not mean \"proven\": the support could be chance or depend on the audience. It needs to be repeated.",
      evTitle: "Evidence board",
      evNote: "SUPPORTED means the hypothesis got some support, not final truth. It is worth re-checking.",
      hStatus: { UNTESTED: "Untested", TESTING: "Testing", SUPPORTED: "Supported", REJECTED: "Rejected", INCONCLUSIVE: "Inconclusive" },
      hImportance: "Importance", hUpdated: "Updated: ", hNext: "Next action", hNextPh: "What to do next?",
      hEvidence: "Evidence", hNoEvidence: "No evidence yet.", hAddEv: "Add evidence", hAddPh: "What did the test or conversation show?",
      hAdd: "Record",
      hNew: "Add a hypothesis", hNewPh: "For example: people would pay more than 10 a month for this", hNewBtn: "Add",
      histTitle: "Progress history", histNone: "The history is empty.",
      h: { created: "Project created", reality: "Reality Check ready", expStart: "Experiment started: ", expDone: "Experiment completed: ", status: "Hypothesis status changed: ", move: "Decision on a step: ", hyp: "Hypothesis added: ", evidence: "Evidence added" },
      moveNone: "The next move appears after the first completed experiment: the recommendation is based on your real results.",
      moveBasis: "Based on: ", moveTime: "Time: ", moveMoney: "Money: ", moveUseful: "Useful result: ",
      accept: "Accept", decline: "Decline", alt: "Choose another", accepted: "Accepted: an experiment was created", declined: "Declined", altChosen: "Chosen as an alternative: an experiment was created",
      moveNote: "One experiment does not decide the fate of a business. This is a recommendation, not a verdict or a guarantee.",
      moveFor: "After: ",
      shareTitle: "Public card",
      shareNote: "A project is private by default. The card is created separately and contains only what you see below. Notes, links and spending are not included.",
      shareTakeaway: "Key takeaway (you can edit it)",
      shareConsent: "I agree that this data becomes public in the link and the image",
      shareMake: "Create the card", shareNeedConsent: "Tick the consent box to create the card.",
      shareCopy: "Copy the link", shareCopied: "Link copied.", shareDl: "Download the image", shareX: "Share on X", shareReddit: "Share on Reddit",
      shareLinkNote: "The data lives right in the link, nothing is stored on a server. Anyone with the link sees the card.",
      shareCta: "Test your idea with razbor",
      shareExps: "experiments",
      cardRisk: "Primary risk", cardStatus: "Validation status",
      reportTitle: "Public Reality Check card",
      reportNoRisk: "The primary risk is not defined yet",
      takeaways: {
        UNVALIDATED: "So far this is only a hypothesis: no real data yet.",
        EARLY: "There are first signals, but it is too early to conclude.",
        PARTIAL: "There is partial evidence that needs to be repeated.",
        STRONGER: "A lot of evidence gathered, but validation continues."
      },
      newExp: "Custom experiment", newExpTitle: "Title", newExpHyp: "Hypothesis", newExpBtn: "Create experiment", newExpStepsPh: "Steps, one per line",
      needTitle: "Enter a title and a hypothesis.",
      saved: "Saved.", storageFail: "Could not save in the browser (storage is full or disabled).",
      loading: "Loading…"
    }
  };
  function p(k) { return P[A.lang()][k]; }
  function fmt(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k]; }); }

  /* ---------- Хранилище ---------- */

  var projects = [];
  var currentId = null;
  var tab = "overview";
  var notice = "";
  var busy = {};

  function uid() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) { /* ignore */ }
    return "id" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  function now() { return new Date().toISOString(); }
  function str(v, n) { return typeof v === "string" ? v.slice(0, n) : ""; }
  function arr(v) { return Array.isArray(v) ? v : []; }

  function sanitizeProject(x) {
    if (!x || typeof x !== "object" || typeof x.id !== "string") return null;
    x.title = str(x.title, 120) || "—";
    x.createdAt = str(x.createdAt, 40) || now();
    x.updatedAt = str(x.updatedAt, 40) || x.createdAt;
    x.lang = x.lang === "en" ? "en" : "ru";
    x.idea = x.idea && typeof x.idea === "object" ? x.idea : {};
    x.reality = x.reality && typeof x.reality === "object" ? x.reality : null;
    x.hypotheses = arr(x.hypotheses).filter(function (h) { return h && typeof h.id === "string"; });
    x.experiments = arr(x.experiments).filter(function (e) { return e && typeof e.id === "string"; });
    x.experiments.forEach(function (e) {
      e.steps = arr(e.steps).map(function (s) { return { text: str(s && s.text, 300), done: !!(s && s.done) }; });
      e.observations = arr(e.observations);
      e.links = arr(e.links).filter(function (l) { return typeof l === "string" && /^https?:\/\//i.test(l); });
      e.tools = arr(e.tools);
      e.metrics = L.cleanMetrics(e.metrics);
      if (["planned", "active", "done"].indexOf(e.status) === -1) e.status = "planned";
    });
    x.hypotheses.forEach(function (h) {
      if (L.STATUSES.indexOf(h.status) === -1) h.status = "UNTESTED";
      if (["high", "medium", "low"].indexOf(h.importance) === -1) h.importance = "medium";
      h.evidence = arr(h.evidence);
    });
    x.history = arr(x.history);
    x.decisions = arr(x.decisions);
    return x;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var data = raw ? JSON.parse(raw) : [];
      projects = arr(data).map(sanitizeProject).filter(Boolean).slice(0, MAX_PROJECTS);
    } catch (e) { projects = []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(projects)); return true; }
    catch (e) { notice = p("storageFail"); return false; }
  }
  function get(id) { for (var i = 0; i < projects.length; i++) if (projects[i].id === id) return projects[i]; return null; }
  function touch(pr) { pr.updatedAt = now(); save(); }
  function log(pr, type, text) { pr.history.unshift({ date: now(), type: type, text: text || "" }); }
  function dateStr(iso) {
    try { return new Date(iso).toLocaleString(A.lang() === "en" ? "en-GB" : "ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return ""; }
  }

  /* ---------- Создание проекта ---------- */

  function createFromReview(res) {
    if (!res || res.refusal) return null;
    if (projects.length >= MAX_PROJECTS) projects.pop();
    var pr = sanitizeProject({
      id: uid(), title: res.title, lang: A.lang(),
      idea: { title: res.title, pitch: res.pitch, audience: res.audience, pain: res.pain, money: res.money, verdict: res.verdict },
      reality: null, hypotheses: [], experiments: [], history: [], decisions: [], createdAt: now()
    });
    log(pr, "created", "");
    projects.unshift(pr);
    save();
    currentId = pr.id;
    tab = "overview";
    notice = "";
    render();
    var ws = $("workspace");
    if (ws) ws.scrollIntoView({ behavior: "smooth", block: "start" });
    runReality(pr);
    return pr;
  }

  function applyReality(pr, r) {
    pr.reality = r;
    pr.hypotheses = pr.hypotheses.filter(function (h) { return h.source === "user"; });
    var prim = r.risks[r.primary_index];
    r.assumptions.forEach(function (a) {
      pr.hypotheses.push({ id: uid(), text: a.text, importance: a.importance, status: "UNTESTED", evidence: [], updatedAt: now(), next: "", source: "ai" });
    });
    pr.hypotheses.unshift({ id: uid(), text: r.experiment.hypothesis, importance: "high", status: "UNTESTED", evidence: [], updatedAt: now(), next: r.experiment.title, source: "ai", primary: true, risk: prim ? prim.title : "" });
    var hid = pr.hypotheses[0].id;
    pr.experiments = pr.experiments.filter(function (e) { return e.kind !== "ai"; });
    var ex = r.experiment;
    pr.experiments.unshift({
      id: uid(), kind: "ai", title: ex.title, hypothesisId: hid, hypothesis: ex.hypothesis, why_now: ex.why_now,
      steps: ex.steps.map(function (s) { return { text: s, done: false }; }),
      budget: ex.budget, duration: ex.duration, tools: ex.tools, success_metric: ex.success_metric, fail_criterion: ex.fail_criterion,
      ambiguous: ex.ambiguous, next_if_success: ex.next_if_success, next_if_fail: ex.next_if_fail, next_if_ambiguous: ex.next_if_ambiguous,
      status: "planned", observations: [], links: [], metrics: L.cleanMetrics({}), createdAt: now()
    });
    log(pr, "reality", "");
    touch(pr);
  }

  async function runReality(pr) {
    if (busy[pr.id]) return;
    busy[pr.id] = true;
    pr.realityError = "";
    render();
    var out = await A.api({ mode: "reality", idea: pr.idea });
    busy[pr.id] = false;
    if (out.ok && out.result && out.result.refusal) {
      pr.realityError = p("realityRefusal") + out.result.refusal;
    } else if (out.ok && out.result) {
      pr.realityError = "";
      applyReality(pr, out.result);
    } else {
      pr.realityError = p("realityFailed") + (out.error ? " " + out.error : "");
    }
    render();
  }

  /* ---------- Мелкие компоненты ---------- */

  function chip(text, cls) { return el("span", { class: "pchip " + (cls || ""), text: text }); }
  function h3(text) { return el("h3", { class: "ph", text: text }); }
  function block(title, text) { return text ? el("div", { class: "pblock" }, [el("h4", { text: title }), el("p", { text: text })]) : document.createDocumentFragment(); }
  function btn(text, cls, fn) {
    var b = el("button", { class: "btn " + (cls || ""), type: "button", text: text });
    b.addEventListener("click", fn);
    return b;
  }
  function statusClass(s) { return "st-" + String(s).toLowerCase(); }
  function ul(items) { var u = el("ul"); items.forEach(function (x) { u.appendChild(el("li", { text: x })); }); return u; }

  function realityLoading() {
    return el("div", { class: "loading", role: "status", "aria-busy": "true" }, [
      el("p", { text: p("realityWait") }),
      el("div", { class: "skel" }), el("div", { class: "skel s2" }), el("div", { class: "skel s3" })
    ]);
  }

  function realityGate(pr) {
    if (busy[pr.id]) return realityLoading();
    var box = el("div", { class: "empty" });
    if (pr.realityError) box.appendChild(el("p", { class: "err", role: "alert", text: pr.realityError }));
    else box.appendChild(el("p", { text: p("realityNeeded") }));
    box.appendChild(btn(pr.realityError ? p("realityRetry") : p("realityRun"), "", function () { runReality(pr); }));
    return box;
  }

  /* ---------- Reality Score ---------- */

  function scoreBlock(pr) {
    var rs = L.realityScore(pr);
    var hints = L.scoreHints(rs);
    var box = el("div", { class: "scorebox" });
    box.appendChild(el("div", { class: "scorehead" }, [
      el("div", { class: "bignum", text: String(rs.score) }),
      el("div", null, [
        el("div", { class: "outof", text: p("outOf100") }),
        chip(p("labels")[rs.label], "lab-" + rs.label.toLowerCase())
      ])
    ]));
    box.appendChild(el("p", { class: "scoretext", text: p("labelText")[rs.label] }));
    box.appendChild(el("p", { class: "scorenote", text: p("scoreNote") }));
    var bars = el("div", { class: "bars" });
    rs.parts.forEach(function (pt) {
      var row = el("div", { class: "bar" }, [
        el("span", { class: "bar-l", text: p("parts")[pt.key] }),
        el("span", { class: "bar-t", "aria-hidden": "true" }, [el("span", { class: "bar-f", style: "width:" + Math.round(pt.points / pt.max * 100) + "%" })]),
        el("span", { class: "bar-v", text: pt.points + "/" + pt.max })
      ]);
      bars.appendChild(row);
    });
    box.appendChild(bars);
    box.appendChild(el("h4", { text: p("evSources") }));
    box.appendChild(ul([
      p("evUser") + ": " + fmt(p("evUserVal"), { n: pr.reality ? pr.reality.assumptions.length : 0 }),
      p("evAi") + ": " + p("evAiVal"),
      p("evExt") + ": " + p("evExtVal"),
      p("evExp") + ": " + fmt(p("evExpVal"), { n: rs.experiments })
    ]));
    if (hints.length) {
      box.appendChild(el("h4", { text: p("hintsTitle") }));
      box.appendChild(ul(hints.map(function (k) { return p("hints")[k]; })));
    }
    return box;
  }

  /* ---------- Вкладки ---------- */

  function tabOverview(pr) {
    var out = el("div");
    out.appendChild(scoreBlock(pr));
    if (pr.reality) {
      var prim = pr.reality.risks[pr.reality.primary_index];
      var ex = pr.experiments.filter(function (e) { return e.kind === "ai"; })[0];
      var card = el("div", { class: "pcard primary" }, [
        chip(p("primaryBadge"), "badge"),
        el("h3", { class: "ph", text: p("primaryTitle") }),
        prim ? el("p", { class: "pr-title", text: prim.title }) : null,
        ex ? el("p", { text: ex.hypothesis }) : null
      ]);
      out.appendChild(card);
    } else {
      out.appendChild(realityGate(pr));
    }
    out.appendChild(shareBlock(pr));
    return out;
  }

  function tabDiagnosis(pr) {
    var out = el("div");
    out.appendChild(el("p", { class: "notice", text: p("diagNote") }));
    out.appendChild(block(p("pitch"), pr.idea.pitch));
    out.appendChild(block(p("audience"), pr.idea.audience));
    out.appendChild(block(p("pain"), pr.idea.pain));
    out.appendChild(block(p("money"), pr.idea.money));
    if (!pr.reality) { out.appendChild(realityGate(pr)); return out; }
    out.appendChild(h3(p("assumptionsT")));
    var list = el("ul", { class: "plist" });
    pr.reality.assumptions.forEach(function (a) {
      list.appendChild(el("li", null, [el("span", { text: a.text }), chip(p("importance")[a.importance], "imp-" + a.importance)]));
    });
    out.appendChild(list);
    if (pr.reality.unknowns.length) { out.appendChild(h3(p("unknownsT"))); out.appendChild(ul(pr.reality.unknowns)); }
    return out;
  }

  function tabRisks(pr) {
    if (!pr.reality) return realityGate(pr);
    var out = el("div");
    pr.reality.risks.forEach(function (r, i) {
      var isP = i === pr.reality.primary_index;
      out.appendChild(el("div", { class: "pcard" + (isP ? " primary" : "") }, [
        isP ? chip(p("primaryBadge"), "badge") : null,
        el("h3", { class: "ph", text: r.title }),
        block(p("riskWhy"), r.why_critical),
        block(p("riskIfWrong"), r.if_wrong),
        block(p("riskConf"), p("conf")[r.confidence]),
        block(p("riskTest"), r.cheapest_test)
      ]));
    });
    return out;
  }

  /* Эксперименты */

  function inputRow(label, input) {
    return el("label", { class: "frow" }, [el("span", { text: label }), input]);
  }

  function renderOutcome(ev) {
    var box = el("div", { class: "pcard outcome oc-" + ev.outcome, role: "status" }, [
      el("h3", { class: "ph", text: p("resultTitle") + ": " + p("outcomes")[ev.outcome] }),
      ev.strength !== "none" ? el("p", { class: "muted", text: p("strength")[ev.strength] }) : null,
      ul(ev.reasons.map(function (r) { return p("reason")[r]; }))
    ]);
    if (ev.outcome === "supported") box.appendChild(el("p", { class: "notice", text: p("supportedNote") }));
    return box;
  }

  function addHistoryEvidence(pr, hid, text) {
    var h = pr.hypotheses.filter(function (x) { return x.id === hid; })[0];
    if (h) { h.evidence.unshift({ date: now(), text: text }); h.updatedAt = now(); }
  }

  function setHypStatus(pr, hid, status) {
    var h = pr.hypotheses.filter(function (x) { return x.id === hid; })[0];
    if (!h || h.status === status) return;
    h.status = status; h.updatedAt = now();
    log(pr, "status", p("hStatus")[status] + ": " + h.text.slice(0, 80));
  }

  function finishExperiment(pr, e) {
    var ev = L.evaluate(e.metrics);
    e.evaluation = ev;
    e.status = "done";
    e.finishedAt = now();
    if (e.hypothesisId) {
      setHypStatus(pr, e.hypothesisId, L.statusFor(ev.outcome));
      addHistoryEvidence(pr, e.hypothesisId, p("outcomes")[ev.outcome] + " (" + p("resultTitle").toLowerCase() + ": " + e.title + ")");
    }
    log(pr, "expDone", e.title + " — " + p("outcomes")[ev.outcome]);
    touch(pr);
    notice = p("finishDone");
    tab = "experiments";
    render();
  }

  function experimentCard(pr, e) {
    var done = e.status === "done";
    var card = el("div", { class: "pcard exp" });
    card.appendChild(el("div", { class: "exp-head" }, [
      el("h3", { class: "ph", text: e.title }),
      chip(e.status === "done" ? p("expFinished") : e.status === "active" ? p("expActive") : p("expPlanned"), "est-" + e.status)
    ]));
    card.appendChild(block(p("expHyp"), e.hypothesis));
    if (!done) card.appendChild(block(p("expWhy"), e.why_now));

    var stepsOl = el("ol", { class: "steps" });
    e.steps.forEach(function (s, i) {
      var cb = el("input", { type: "checkbox", id: "st-" + e.id + "-" + i });
      cb.checked = !!s.done;
      if (done) cb.disabled = true;
      cb.addEventListener("change", function () { s.done = cb.checked; touch(pr); });
      stepsOl.appendChild(el("li", null, [cb, el("label", { for: "st-" + e.id + "-" + i, text: " " + s.text })]));
    });
    if (e.steps.length) { card.appendChild(el("h4", { text: p("expSteps") })); card.appendChild(stepsOl); }

    var meta = el("dl", { class: "meta" });
    [[p("expBudget"), e.budget], [p("expTime"), e.duration], [p("expTools"), (e.tools || []).join(", ")],
      [p("expSuccess"), e.success_metric], [p("expFail"), e.fail_criterion], [p("expAmb"), e.ambiguous]].forEach(function (r) {
      if (r[1]) meta.appendChild(el("div", null, [el("dt", { text: r[0] }), el("dd", { text: r[1] })]));
    });
    card.appendChild(meta);
    if (e.kind === "ai") card.appendChild(el("p", { class: "muted", text: p("aiNote") }));
    if (e.next_if_success || e.next_if_fail || e.next_if_ambiguous) {
      card.appendChild(el("h4", { text: p("expNext") }));
      card.appendChild(ul([e.next_if_success && p("ifSuccess") + e.next_if_success, e.next_if_fail && p("ifFail") + e.next_if_fail,
        e.next_if_ambiguous && p("ifAmb") + e.next_if_ambiguous].filter(Boolean)));
    }
    if (e.kind === "ai") card.appendChild(el("p", { class: "notice", text: p("expDisclaimer") }));

    if (e.status === "planned") {
      card.appendChild(btn(p("expStart"), "", function () {
        e.status = "active"; e.startedAt = now();
        if (e.hypothesisId) setHypStatus(pr, e.hypothesisId, "TESTING");
        log(pr, "expStart", e.title);
        touch(pr); render();
      }));
      return card;
    }

    /* Наблюдения */
    card.appendChild(el("h4", { text: p("obsT") }));
    if (e.observations.length) {
      card.appendChild(ul(e.observations.map(function (o) { return dateStr(o.date) + ": " + o.text; })));
    }
    if (!done) {
      var ta = el("textarea", { rows: "2", maxlength: "500", placeholder: p("obsPh"), "aria-label": p("obsT") });
      card.appendChild(ta);
      card.appendChild(btn(p("obsAdd"), "ghost small", function () {
        var v = ta.value.trim();
        if (!v) return;
        e.observations.push({ date: now(), text: v.slice(0, 500) });
        touch(pr); render();
      }));
    }

    /* Ссылки */
    card.appendChild(el("h4", { text: p("linksT") }));
    if (e.links.length) {
      var lu = el("ul");
      e.links.forEach(function (l) { lu.appendChild(el("li", null, [el("a", { href: l, target: "_blank", rel: "noopener noreferrer nofollow", text: l.slice(0, 80) })])); });
      card.appendChild(lu);
    }
    if (!done) {
      var li = el("input", { type: "url", maxlength: "300", placeholder: p("linkPh"), "aria-label": p("linksT") });
      var lerr = el("span", { class: "err", role: "alert" });
      card.appendChild(li);
      card.appendChild(btn(p("linkAdd"), "ghost small", function () {
        var v = li.value.trim();
        if (!/^https?:\/\/[^\s]+$/i.test(v)) { lerr.textContent = p("linkBad"); return; }
        e.links.push(v); touch(pr); render();
      }));
      card.appendChild(lerr);
    }

    /* Результаты */
    card.appendChild(el("h4", { text: p("resultsT") }));
    card.appendChild(el("p", { class: "muted", text: p("resultsHint") }));
    var grid = el("div", { class: "mgrid" });
    ["views", "conversations", "positive", "negative", "leads", "paid", "spend"].forEach(function (k) {
      var inp = el("input", { type: "number", min: "0", step: "1", inputmode: "numeric" });
      inp.value = e.metrics[k] ? String(e.metrics[k]) : "";
      if (done) inp.disabled = true;
      inp.addEventListener("change", function () { e.metrics = L.cleanMetrics(Object.assign({}, e.metrics, (function () { var o = {}; o[k] = inp.value; return o; })())); inp.value = e.metrics[k] ? String(e.metrics[k]) : ""; touch(pr); });
      grid.appendChild(inputRow(p("m")[k], inp));
    });
    card.appendChild(grid);
    if (done && e.evaluation) card.appendChild(renderOutcome(e.evaluation));
    if (!done) card.appendChild(btn(p("finish"), "", function () { finishExperiment(pr, e); }));
    return card;
  }

  function manualExperimentForm(pr) {
    var det = el("details", { class: "pcard" });
    det.appendChild(el("summary", { text: p("newExp") }));
    var title = el("input", { type: "text", maxlength: "120" });
    var hyp = el("input", { type: "text", maxlength: "300" });
    var steps = el("textarea", { rows: "4", maxlength: "900", placeholder: p("newExpStepsPh") });
    var err = el("span", { class: "err", role: "alert" });
    det.appendChild(inputRow(p("newExpTitle"), title));
    det.appendChild(inputRow(p("newExpHyp"), hyp));
    det.appendChild(steps);
    det.appendChild(btn(p("newExpBtn"), "", function () {
      if (!title.value.trim() || !hyp.value.trim()) { err.textContent = p("needTitle"); return; }
      var hid = uid();
      pr.hypotheses.push({ id: hid, text: hyp.value.trim().slice(0, 300), importance: "medium", status: "UNTESTED", evidence: [], updatedAt: now(), next: "", source: "user" });
      pr.experiments.unshift({
        id: uid(), kind: "manual", title: title.value.trim().slice(0, 120), hypothesisId: hid, hypothesis: hyp.value.trim().slice(0, 300),
        steps: steps.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 10).map(function (s) { return { text: s.slice(0, 300), done: false }; }),
        status: "planned", observations: [], links: [], metrics: L.cleanMetrics({}), createdAt: now(), tools: []
      });
      touch(pr); render();
    }));
    det.appendChild(err);
    return det;
  }

  function tabExperiments(pr) {
    var out = el("div");
    if (!pr.reality && !pr.experiments.length) { out.appendChild(realityGate(pr)); out.appendChild(manualExperimentForm(pr)); return out; }
    var open = pr.experiments.filter(function (e) { return e.status !== "done"; });
    var done = pr.experiments.filter(function (e) { return e.status === "done"; });
    out.appendChild(h3(p("expCurrent")));
    if (!open.length) out.appendChild(el("p", { class: "muted", text: p("expNone") }));
    open.forEach(function (e) { out.appendChild(experimentCard(pr, e)); });
    out.appendChild(manualExperimentForm(pr));
    if (done.length) {
      out.appendChild(h3(p("expDone")));
      done.forEach(function (e) { out.appendChild(experimentCard(pr, e)); });
    }
    return out;
  }

  /* Доска гипотез */

  function tabEvidence(pr) {
    var out = el("div");
    out.appendChild(el("p", { class: "notice", text: p("evNote") }));
    if (!pr.hypotheses.length && !pr.reality) out.appendChild(realityGate(pr));
    pr.hypotheses.forEach(function (h) {
      var sel = el("select", { "aria-label": p("hStatus").UNTESTED });
      L.STATUSES.forEach(function (s) { sel.appendChild(el("option", { value: s, text: p("hStatus")[s] })); });
      sel.value = h.status;
      sel.addEventListener("change", function () { setHypStatus(pr, h.id, sel.value); touch(pr); render(); });
      var next = el("input", { type: "text", maxlength: "200", placeholder: p("hNextPh"), "aria-label": p("hNext") });
      next.value = h.next || "";
      next.addEventListener("change", function () { h.next = next.value.slice(0, 200); h.updatedAt = now(); touch(pr); });
      var card = el("div", { class: "pcard hyp " + statusClass(h.status) }, [
        el("div", { class: "exp-head" }, [
          h.primary ? chip(p("primaryBadge"), "badge") : null,
          chip(p("hStatus")[h.status], "hs " + statusClass(h.status)),
          chip(p("importance")[h.importance], "imp-" + h.importance)
        ]),
        el("p", { class: "pr-title", text: h.text }),
        el("p", { class: "muted", text: p("hUpdated") + dateStr(h.updatedAt) })
      ]);
      card.appendChild(inputRow(p("hStatus").UNTESTED + " / " + p("hStatus").SUPPORTED, sel));
      card.appendChild(inputRow(p("hNext"), next));
      card.appendChild(el("h4", { text: p("hEvidence") }));
      if (h.evidence.length) card.appendChild(ul(h.evidence.slice(0, 8).map(function (x) { return dateStr(x.date) + ": " + x.text; })));
      else card.appendChild(el("p", { class: "muted", text: p("hNoEvidence") }));
      var ev = el("input", { type: "text", maxlength: "300", placeholder: p("hAddPh"), "aria-label": p("hAddEv") });
      card.appendChild(ev);
      card.appendChild(btn(p("hAdd"), "ghost small", function () {
        var v = ev.value.trim();
        if (!v) return;
        h.evidence.unshift({ date: now(), text: v.slice(0, 300) }); h.updatedAt = now();
        log(pr, "evidence", v.slice(0, 80));
        touch(pr); render();
      }));
      out.appendChild(card);
    });
    var det = el("details", { class: "pcard" });
    det.appendChild(el("summary", { text: p("hNew") }));
    var ni = el("input", { type: "text", maxlength: "300", placeholder: p("hNewPh"), "aria-label": p("hNew") });
    det.appendChild(ni);
    det.appendChild(btn(p("hNewBtn"), "ghost small", function () {
      var v = ni.value.trim();
      if (!v) return;
      pr.hypotheses.push({ id: uid(), text: v.slice(0, 300), importance: "medium", status: "UNTESTED", evidence: [], updatedAt: now(), next: "", source: "user" });
      log(pr, "hyp", v.slice(0, 80)); touch(pr); render();
    }));
    out.appendChild(det);
    return out;
  }

  function tabHistory(pr) {
    var out = el("div");
    out.appendChild(h3(p("histTitle")));
    if (!pr.history.length) { out.appendChild(el("p", { class: "muted", text: p("histNone") })); return out; }
    var ol = el("ul", { class: "timeline" });
    pr.history.slice(0, 80).forEach(function (x) {
      ol.appendChild(el("li", null, [el("span", { class: "muted", text: dateStr(x.date) + " " }), el("span", { text: (p("h")[x.type] || "") + (x.text || "") })]));
    });
    out.appendChild(ol);
    return out;
  }

  /* Следующий шаг */

  function lastDone(pr) {
    var d = pr.experiments.filter(function (e) { return e.status === "done" && e.evaluation; });
    d.sort(function (a, b) { return String(b.finishedAt).localeCompare(String(a.finishedAt)); });
    return d[0] || null;
  }

  function startExperimentFromMove(pr, mv) {
    var hid = uid();
    pr.hypotheses.push({ id: hid, text: mv.title, importance: "medium", status: "UNTESTED", evidence: [], updatedAt: now(), next: "", source: "user" });
    pr.experiments.unshift({
      id: uid(), kind: "manual", title: mv.title, hypothesisId: hid, hypothesis: mv.useful,
      steps: mv.steps.map(function (s) { return { text: s, done: false }; }), duration: mv.time, budget: mv.money,
      status: "planned", observations: [], links: [], metrics: L.cleanMetrics({}), createdAt: now(), tools: []
    });
  }

  function tabMove(pr) {
    var e = lastDone(pr);
    var out = el("div");
    if (!e) { out.appendChild(el("div", { class: "empty" }, [el("p", { text: p("moveNone") })])); return out; }
    out.appendChild(el("p", { class: "notice", text: p("moveNote") }));
    out.appendChild(el("p", { class: "muted", text: p("moveFor") + e.title + " — " + p("outcomes")[e.evaluation.outcome] }));
    var moves = L.nextMoves(e.evaluation, A.lang());
    moves.forEach(function (mv, i) {
      var dec = pr.decisions.filter(function (d) { return d.expId === e.id && d.moveId === mv.id; })[0];
      var card = el("div", { class: "pcard" + (i === 0 ? " primary" : "") }, [
        el("h3", { class: "ph", text: mv.title }),
        el("p", { text: mv.why }),
        el("p", { class: "muted", text: p("moveBasis") + mv.basis }),
        el("p", { text: p("moveTime") + mv.time + ". " + p("moveMoney") + mv.money }),
        el("p", { text: p("moveUseful") + mv.useful })
      ]);
      if (dec) {
        card.appendChild(chip(dec.decision === "declined" ? p("declined") : dec.decision === "alt" ? p("altChosen") : p("accepted"), "hs"));
      } else {
        var row = el("div", { class: "result-actions" });
        function decide(kind) {
          pr.decisions.push({ date: now(), expId: e.id, moveId: mv.id, decision: kind });
          log(pr, "move", mv.title + " — " + (kind === "declined" ? p("declined") : kind === "alt" ? p("altChosen") : p("accepted")));
          if (kind !== "declined") startExperimentFromMove(pr, mv);
          touch(pr); if (kind !== "declined") tab = "experiments"; render();
        }
        row.appendChild(btn(i === 0 ? p("accept") : p("alt"), "", function () { decide(i === 0 ? "accepted" : "alt"); }));
        row.appendChild(btn(p("decline"), "ghost", function () { decide("declined"); }));
        card.appendChild(row);
      }
      out.appendChild(card);
    });
    return out;
  }

  /* ---------- Публичная карточка ---------- */

  function reportFor(pr, takeaway) {
    var rs = L.realityScore(pr);
    var prim = pr.reality && pr.reality.risks[pr.reality.primary_index];
    return L.cleanReport({
      t: pr.idea.title || pr.title, r: prim ? prim.title : "", s: rs.label, n: rs.experiments, k: takeaway, l: A.lang(), v: rs.score
    });
  }

  function reportUrl(rep) {
    var base = /^https?:$/.test(location.protocol) ? location.origin : "";
    return base + "/#report=" + L.encodeReport(rep);
  }

  function wrapText(ctx, text, x, y, maxW, lh, maxLines) {
    var words = String(text).split(/\s+/), line = "", lines = 0;
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        lines++;
        if (lines >= maxLines) { ctx.fillText(line.replace(/[ ,.;:]*$/, "") + "…", x, y); return y + lh; }
        ctx.fillText(line, x, y); y += lh; line = words[i];
      } else line = test;
    }
    if (line) { ctx.fillText(line, x, y); y += lh; }
    return y;
  }

  function drawCard(rep, lang, done) {
    var c = document.createElement("canvas");
    c.width = 1200; c.height = 630;
    var ctx = c.getContext && c.getContext("2d");
    if (!ctx) return null;
    var D = P[lang] || P.ru;
    var ink = "#16213E", yellow = "#FFE14D", paper = "#F6F8FC", pen = "#2B4BDB";
    ctx.fillStyle = paper; ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = "rgba(43,75,219,0.10)"; ctx.lineWidth = 1;
    for (var gx = 0; gx <= 1200; gx += 30) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, 630); ctx.stroke(); }
    for (var gy = 0; gy <= 630; gy += 30) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(1200, gy); ctx.stroke(); }
    ctx.lineWidth = 6; ctx.strokeStyle = ink; ctx.strokeRect(30, 30, 1140, 570);
    ctx.fillStyle = yellow; ctx.fillRect(30, 30, 1140, 14);
    var disp = '"Unbounded","Arial Black",Arial,sans-serif', body = '"Golos Text",Arial,sans-serif', hand = '"Caveat","Segoe Print",cursive';
    ctx.fillStyle = ink; ctx.textBaseline = "alphabetic";
    ctx.font = "700 44px " + disp;
    var y = wrapText(ctx, rep.t, 70, 130, 1060, 54, 2);
    ctx.font = "600 22px " + body; ctx.fillStyle = "#56617F";
    ctx.fillText(D.cardRisk.toUpperCase(), 70, y + 24);
    ctx.fillStyle = ink; ctx.font = "500 30px " + body;
    y = wrapText(ctx, rep.r || D.reportNoRisk, 70, y + 62, 1060, 38, 2);
    ctx.fillStyle = yellow; ctx.fillRect(70, y + 16, 420, 56);
    ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.strokeRect(70, y + 16, 420, 56);
    ctx.fillStyle = ink; ctx.font = "700 26px " + disp;
    ctx.fillText(D.labels[rep.s], 86, y + 53);
    ctx.font = "600 26px " + body;
    ctx.fillText(rep.v + "/100  ·  " + rep.n + " " + D.shareExps, 520, y + 53);
    ctx.fillStyle = pen; ctx.font = "600 38px " + hand;
    wrapText(ctx, rep.k, 70, y + 120, 1060, 44, 2);
    ctx.fillStyle = ink; ctx.font = "700 28px " + disp;
    ctx.fillText("razbor.", 70, 560);
    ctx.fillStyle = "#56617F"; ctx.font = "500 22px " + body;
    ctx.fillText(D.shareCta + "  ·  Idea starts here.", 200, 558);
    var img = new Image();
    img.onload = function () { try { ctx.drawImage(img, 1090, 500, 70, 70); } catch (e) { /* ignore */ } done(c); };
    img.onerror = function () { done(c); };
    img.src = "mark.png";
    return c;
  }

  function shareBlock(pr) {
    var rs = L.realityScore(pr);
    var box = el("div", { class: "pcard share" });
    box.appendChild(h3(p("shareTitle")));
    box.appendChild(el("p", { class: "notice", text: p("shareNote") }));
    var prim = pr.reality && pr.reality.risks[pr.reality.primary_index];
    var tk = el("input", { type: "text", maxlength: "200", "aria-label": p("shareTakeaway") });
    tk.value = p("takeaways")[rs.label];
    box.appendChild(inputRow(p("shareTakeaway"), tk));
    box.appendChild(el("ul", { class: "plain" }, [
      el("li", { text: (pr.idea.title || pr.title) }),
      el("li", { text: p("cardRisk") + ": " + (prim ? prim.title : p("reportNoRisk")) }),
      el("li", { text: p("cardStatus") + ": " + p("labels")[rs.label] + " (" + rs.score + "/100)" }),
      el("li", { text: rs.experiments + " " + p("shareExps") })
    ]));
    var cb = el("input", { type: "checkbox", id: "share-consent-" + pr.id });
    var lbl = el("label", { for: "share-consent-" + pr.id, class: "consent" }, [cb, document.createTextNode(" " + p("shareConsent"))]);
    box.appendChild(lbl);
    var msg = el("p", { class: "muted", role: "status" });
    var out = el("div", { class: "share-out" });
    box.appendChild(btn(p("shareMake"), "", function () {
      out.textContent = "";
      if (!cb.checked) { msg.textContent = p("shareNeedConsent"); return; }
      msg.textContent = "";
      var rep = reportFor(pr, tk.value || p("takeaways")[rs.label]);
      var url = reportUrl(rep);
      var preview = el("div", { class: "preview" });
      out.appendChild(preview);
      drawCard(rep, A.lang(), function (canvas) {
        canvas.setAttribute("role", "img");
        canvas.setAttribute("aria-label", rep.t);
        preview.appendChild(canvas);
        out.insertBefore(btn(p("shareDl"), "ghost", function () {
          try {
            var a = document.createElement("a");
            a.download = "razbor-reality-check.png"; a.href = canvas.toDataURL("image/png");
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
          } catch (e) { msg.textContent = p("storageFail"); }
        }), preview.nextSibling);
      });
      var text = rep.t + " — " + p("labels")[rep.s] + ". " + p("shareCta");
      var row = el("div", { class: "result-actions" }, [
        btn(p("shareCopy"), "ghost", function () {
          A.copy(url, function (ok) { msg.textContent = ok ? p("shareCopied") : url; });
        }),
        el("a", { class: "btn ghost", href: "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url), target: "_blank", rel: "noopener noreferrer", text: p("shareX") }),
        el("a", { class: "btn ghost", href: "https://www.reddit.com/submit?url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(text), target: "_blank", rel: "noopener noreferrer", text: p("shareReddit") })
      ]);
      out.appendChild(row);
      out.appendChild(el("p", { class: "muted", text: p("shareLinkNote") }));
    }));
    box.appendChild(msg);
    box.appendChild(out);
    return box;
  }

  /* Публичный отчёт по ссылке */
  function renderPublicReport() {
    var holder = $("public-report");
    if (!holder) return;
    holder.textContent = "";
    var m = /^#report=([A-Za-z0-9_-]+)$/.exec(location.hash || "");
    var rep = m ? L.decodeReport(m[1]) : null;
    if (!rep) { holder.hidden = true; return; }
    holder.hidden = false;
    var D = P[rep.l] || P.ru;
    var card = el("div", { class: "pcard primary" }, [
      chip(D.reportTitle, "badge"),
      el("h2", { class: "ph big", text: rep.t }),
      el("p", { class: "muted", text: D.cardRisk }),
      el("p", { class: "pr-title", text: rep.r || D.reportNoRisk }),
      el("p", null, [chip(D.labels[rep.s], "lab-" + rep.s.toLowerCase()), document.createTextNode(" " + rep.v + "/100 · " + rep.n + " " + D.shareExps)]),
      el("p", { class: "verdict", text: rep.k }),
      el("p", { class: "muted", text: D.scoreNote }),
      el("a", { class: "btn", href: "#agent", text: D.shareCta })
    ]);
    holder.appendChild(card);
  }

  /* ---------- Рабочая область ---------- */

  function exportData() {
    try {
      var blob = new Blob([JSON.stringify({ app: "razbor", version: 1, exportedAt: now(), projects: projects }, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "razbor-projects.json";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    } catch (e) { notice = p("storageFail"); render(); }
  }

  function renderList(body) {
    if (!projects.length) {
      body.appendChild(el("div", { class: "empty" }, [el("p", { text: p("wsEmpty") })]));
      return;
    }
    projects.forEach(function (pr) {
      var rs = L.realityScore(pr);
      var row = el("div", { class: "pcard row" }, [
        el("div", null, [
          el("h3", { class: "ph", text: pr.title }),
          el("p", { class: "muted", text: p("updated") + dateStr(pr.updatedAt) + " · " + p("exps") + rs.experiments })
        ]),
        chip(p("labels")[rs.label], "lab-" + rs.label.toLowerCase()),
        el("div", { class: "result-actions" }, [
          btn(p("open"), "", function () { currentId = pr.id; tab = "overview"; render(); }),
          btn(p("del"), "ghost", function () {
            if (!window.confirm(fmt(p("delConfirm"), { t: pr.title }))) return;
            projects = projects.filter(function (x) { return x.id !== pr.id; });
            save(); render();
          })
        ])
      ]);
      body.appendChild(row);
    });
    body.appendChild(el("div", { class: "result-actions" }, [btn(p("exportBtn"), "ghost", exportData)]));
  }

  var TAB_KEYS = ["overview", "diagnosis", "risks", "experiments", "evidence", "history", "move"];
  var TABS = { overview: tabOverview, diagnosis: tabDiagnosis, risks: tabRisks, experiments: tabExperiments, evidence: tabEvidence, history: tabHistory, move: tabMove };

  function render() {
    var body = $("workspace-body");
    if (!body) return;
    var keepFocus = document.activeElement && document.activeElement.id;
    body.textContent = "";
    $("ws-title").textContent = p("wsTitle");
    $("ws-sub").textContent = p("wsSub");
    if (notice) {
      body.appendChild(el("p", { class: "notice", role: "status", text: notice }));
      notice = "";
    }
    var pr = currentId ? get(currentId) : null;
    if (!pr) {
      currentId = null;
      renderList(body);
      body.appendChild(el("p", { class: "muted", text: p("storageNote") }));
      return;
    }
    body.appendChild(el("div", { class: "result-actions" }, [btn(p("back"), "ghost small", function () { currentId = null; render(); })]));
    body.appendChild(el("h2", { class: "ph big", text: pr.title }));
    var tabs = el("div", { class: "ptabs", role: "group", "aria-label": p("tabsAria") });
    TAB_KEYS.forEach(function (k) {
      var b = el("button", { type: "button", class: "ptab", "aria-pressed": k === tab ? "true" : "false", text: p("tabs")[k] });
      b.addEventListener("click", function () { tab = k; render(); });
      tabs.appendChild(b);
    });
    body.appendChild(tabs);
    body.appendChild(TABS[tab](pr));
    if (keepFocus && $(keepFocus)) $(keepFocus).focus();
  }

  A.rerender = function () { renderPublicReport(); render(); };
  A.createProject = createFromReview;
  A.projectLabel = function () { return p("createProject"); };
  A.hasStorage = function () { return true; };

  window.addEventListener("hashchange", renderPublicReport);
  load();
  renderPublicReport();
  render();
  if (A.onProjectsReady) A.onProjectsReady();
})();
