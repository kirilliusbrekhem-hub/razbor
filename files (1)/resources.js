/*
  Библиотека материалов. Агент возвращает теги идеи, а сайт подбирает отсюда подходящие материалы.
  Ссылки здесь пишет человек, а не нейросеть, поэтому они не выдуманные.

  Поля:
    type  — "book" | "podcast" | "article" | "tool"
    tags  — теги из списка: ai, marketplaces, services, content, education, money,
            validation, ideas, marketing, product, startup
    url   — прямая ссылка. Если её нет, сайт строит ссылку-поиск по полю find
            (для книг ещё по findRu, чтобы найти русское издание)
    lang  — "ru" или "en"

  Перед публикацией открой каждую ссылку и убедись, что она работает.
*/
window.RESOURCES = [
  /* Книги */
  {
    type: "book", title: "The Mom Test", by: "Роб Фицпатрик", lang: "en",
    tags: ["validation", "startup", "services", "product"],
    note: "Как разговаривать с будущими клиентами, чтобы узнать правду об идее, а не получить вежливое «да».",
    url: "http://momtestbook.com", find: "The Mom Test Rob Fitzpatrick", findRu: "Спроси маму Роб Фицпатрик"
  },
  {
    type: "book", title: "The Lean Startup", by: "Эрик Рис", lang: "en",
    tags: ["validation", "product", "startup"],
    note: "Как проверять идею маленькими дешёвыми шагами, не строя сразу большой продукт.",
    find: "The Lean Startup Eric Ries", findRu: "Бизнес с нуля Эрик Рис"
  },
  {
    type: "book", title: "Traction", by: "Габриэль Вайнберг, Джастин Марес", lang: "en",
    tags: ["marketing", "marketplaces", "content", "startup"],
    note: "Каталог способов найти первых клиентов: от блога до партнёрств.",
    find: "Traction Gabriel Weinberg Justin Mares", findRu: "Traction Габриэль Вайнберг"
  },
  {
    type: "book", title: "The $100 Startup", by: "Крис Гилебо", lang: "en",
    tags: ["services", "startup", "money", "ideas"],
    note: "Истории людей, которые начали маленький бизнес почти без денег, и разбор того, что у них сработало.",
    find: "The $100 Startup Chris Guillebeau", findRu: "Крис Гилебо стартап"
  },
  {
    type: "book", title: "Rework", by: "Джейсон Фрайд, Дэвид Хайнемайер Хансон", lang: "en",
    tags: ["startup", "services", "product"],
    note: "Короткие практичные главы о небольшом бизнесе: что можно не делать и с чего начинать.",
    find: "Rework Jason Fried David Heinemeier Hansson", findRu: "Rework Джейсон Фрайд"
  },
  {
    type: "book", title: "Zero to One", by: "Питер Тиль", lang: "en",
    tags: ["ideas", "startup", "product"],
    note: "Как искать идеи, которые делают что-то по-настоящему новое, а не копируют готовое.",
    find: "Zero to One Peter Thiel", findRu: "От нуля к единице Питер Тиль"
  },
  {
    type: "book", title: "Show Your Work!", by: "Остин Клеон", lang: "en",
    tags: ["content", "marketing", "services"],
    note: "Почему стоит показывать процесс, а не только результат, и как так привлекать аудиторию.",
    find: "Show Your Work Austin Kleon"
  },
  {
    type: "book", title: "Building a StoryBrand", by: "Дональд Миллер", lang: "en",
    tags: ["marketing", "content", "services"],
    note: "Как объяснить, что делает твой продукт, так, чтобы поняли с первого раза.",
    find: "Building a StoryBrand Donald Miller"
  },
  {
    type: "book", title: "Hooked", by: "Нир Эяль", lang: "en",
    tags: ["product", "education", "content"],
    note: "Как устроены продукты, к которым возвращаются снова и снова, и как не превратить это в манипуляцию.",
    find: "Hooked Nir Eyal", findRu: "Hooked Нир Эяль"
  },
  {
    type: "book", title: "Make It Stick", by: "Питер Браун, Хенри Редигер, Марк Макдэниел", lang: "en",
    tags: ["education"],
    note: "Что наука говорит о том, как люди на самом деле учатся и запоминают.",
    find: "Make It Stick Peter Brown Henry Roediger"
  },
  {
    type: "book", title: "The Psychology of Money", by: "Морган Хаусел", lang: "en",
    tags: ["money"],
    note: "Почему поведение с деньгами важнее формул и как не ломать себе финансы привычками.",
    find: "The Psychology of Money Morgan Housel", findRu: "Психология денег Морган Хаусел"
  },
  {
    type: "book", title: "I Will Teach You to Be Rich", by: "Рамит Сети", lang: "en",
    tags: ["money"],
    note: "Базовая личная финансовая грамотность по шагам.",
    find: "I Will Teach You to Be Rich Ramit Sethi"
  },
  {
    type: "book", title: "Co-Intelligence", by: "Итан Моллик", lang: "en",
    tags: ["ai", "product"],
    note: "Практичный взгляд на то, как работать с ИИ как с напарником и где он ошибается.",
    find: "Co-Intelligence Ethan Mollick"
  },
  {
    type: "book", title: "Prediction Machines", by: "Аджей Агравал, Джошуа Ганс, Ави Голдфарб", lang: "en",
    tags: ["ai", "startup"],
    note: "Экономика ИИ: почему предсказания дешевеют и что это меняет для бизнеса.",
    find: "Prediction Machines Agrawal Gans Goldfarb"
  },

  /* Подкасты */
  {
    type: "podcast", title: "Startups for the Rest of Us", by: "Роб Уоллинг и соведущие", lang: "en",
    tags: ["startup", "product", "services", "marketing"],
    note: "Разговоры о запуске небольших софтовых продуктов без больших вложений.",
    url: "https://www.startupsfortherestofus.com"
  },
  {
    type: "podcast", title: "Indie Hackers Podcast", by: "Indie Hackers", lang: "en",
    tags: ["startup", "product", "ai", "ideas"],
    note: "Интервью с людьми, которые строят небольшие продукты в одиночку или маленькой командой.",
    find: "Indie Hackers Podcast"
  },
  {
    type: "podcast", title: "How I Built This", by: "NPR", lang: "en",
    tags: ["startup", "ideas", "marketing"],
    note: "Основатели известных компаний рассказывают, как всё начиналось, включая провалы.",
    find: "How I Built This NPR podcast"
  },
  {
    type: "podcast", title: "My First Million", by: "Сэм Парр и Шон Пури", lang: "en",
    tags: ["ideas", "services", "marketplaces", "startup"],
    note: "Ведущие обсуждают бизнес-идеи и тренды и разбирают, почему они могут сработать.",
    find: "My First Million podcast"
  },
  {
    type: "podcast", title: "Acquired", by: "Бен Гилберт и Дэвид Розенталь", lang: "en",
    tags: ["startup", "ai", "product"],
    note: "Длинные разборы историй известных технологических компаний.",
    find: "Acquired podcast Ben Gilbert David Rosenthal"
  },
  {
    type: "podcast", title: "Подкасты Кирилла Фомина", by: "Кирилл Фомин", lang: "ru",
    tags: ["startup", "ideas", "services", "marketplaces"],
    note: "Интервью с российскими предпринимателями о том, как они строили бизнес.",
    url: "https://www.youtube.com/@fomin.podcast"
  },
  {
    type: "podcast", title: "Рунетология", by: "Максим Спиридонов", lang: "ru",
    tags: ["marketing", "content", "marketplaces"],
    note: "Подкаст про российский интернет-бизнес и маркетинг.",
    find: "Рунетология подкаст Максим Спиридонов"
  },

  /* Статьи, подборки и инструменты */
  {
    type: "article", title: "How to Get Startup Ideas", by: "Пол Грэм", lang: "en",
    tags: ["ideas", "validation", "startup"],
    note: "Классическое эссе о том, что хорошие идеи не выдумывают, а замечают в собственной жизни.",
    url: "https://paulgraham.com/startupideas.html"
  },
  {
    type: "article", title: "Библиотека Y Combinator", by: "Y Combinator", lang: "en",
    tags: ["startup", "product", "ideas", "validation"],
    note: "Бесплатные статьи, лекции и советы одного из самых известных стартап-акселераторов.",
    url: "https://ycombinator.com/library"
  },
  {
    type: "article", title: "Учебник Т—Ж: нейросети для генерации идей", by: "Т—Ж", lang: "ru",
    tags: ["ai", "ideas", "content"],
    note: "Как использовать нейросеть, чтобы придумывать идеи и отсеивать слабые.",
    url: "https://t-j.ru/pro/ai-text/6-creative/"
  },
  {
    type: "article", title: "Как нейросеть превращает идею в чёткий план", by: "vc.ru", lang: "ru",
    tags: ["ai", "validation", "ideas"],
    note: "Готовый промпт, который помогает разобрать идею: аудитория, риски, каналы, пошаговый план.",
    url: "https://vc.ru/ai/2021601-neyroset-dlya-strukturirovaniya-idey"
  },
  {
    type: "article", title: "Подборка подкастов про стартапы и ИТ-проекты", by: "Хабр", lang: "ru",
    tags: ["startup", "ai", "product"],
    note: "Список русскоязычных подкастов о развитии ИТ-бизнеса и продуктов: можно выбрать свой.",
    url: "https://habr.com/ru/articles/868900"
  },
  {
    type: "tool", title: "Яндекс Вордстат", by: "Яндекс", lang: "ru",
    tags: ["validation", "marketing", "marketplaces", "content"],
    note: "Показывает, как часто люди ищут то, что ты хочешь предложить. Быстрая проверка спроса.",
    find: "Яндекс Вордстат подбор слов"
  },
  {
    type: "tool", title: "Google Trends", by: "Google", lang: "en",
    tags: ["validation", "marketing", "content"],
    note: "Динамика интереса к теме во времени: растёт он или падает.",
    find: "Google Trends"
  },
  {
    type: "tool", title: "Smart Reading", by: "Smart Reading", lang: "ru",
    tags: ["startup", "money", "marketing", "ideas"],
    note: "Краткие пересказы деловых книг на русском: можно быстро понять, какую стоит читать целиком.",
    url: "https://smartreading.ru"
  },
  {
    type: "tool", title: "Blinkist", by: "Blinkist", lang: "en",
    tags: ["startup", "money", "marketing", "ideas"],
    note: "Краткие пересказы нон-фикшн книг на английском в виде текста и аудио.",
    url: "https://www.blinkist.com"
  },
  {
    type: "tool", title: "Академия для продавцов Ozon", by: "Ozon", lang: "ru",
    tags: ["marketplaces"],
    note: "Обучающие материалы площадки для тех, кто начинает продавать.",
    find: "Академия Ozon для продавцов обучение"
  },
  {
    type: "tool", title: "Обучение для продавцов Wildberries", by: "Wildberries", lang: "ru",
    tags: ["marketplaces"],
    note: "Материалы площадки о правилах, карточках товаров и продажах.",
    find: "Wildberries обучение для продавцов школа"
  },
  {
    type: "tool", title: "Финансовая грамотность для подростков", by: "Банк России", lang: "ru",
    tags: ["money", "education"],
    note: "Просто о деньгах, вкладах, мошенничестве и первых шагах с финансами.",
    find: "Финкульт финансовая грамотность для подростков Банк России"
  }
];
