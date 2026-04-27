"use strict";

const LANGS = ["ru", "en", "ua", "kz", "zh", "ko", "ro", "de", "cz", "bg"];
const FALLBACK_LANG = "ru";
const HISTORY_KEY = "multilingual_catalog_history_v1";
const MAX_HISTORY_ITEMS = 10;
const SEARCH_INPUT_DEBOUNCE_MS = 90;
const RESULTS_SWIPE_PANEL_GAP_PX = 12;
const SWIPE_EDGE_GUARD_PX = 18;
const CATEGORY_PRIORITY = [
  "ReelShort",
  "DramaWave",
  "ShortMax",
  "StardustTV",
  "Полнометражный фильм",
  "My Drama",
  "Платные",
  "Аниме"
];
const HIDDEN_CATEGORY_TAGS = ["бесплатно", "платно", "русские субтитры"];
const SORT_OPTION_KEYS = ["relevance", "title_asc", "title_desc", "year_desc", "year_asc"];
const SEARCH_STOP_WORDS = new Set([
  "а",
  "и",
  "в",
  "во",
  "на",
  "по",
  "за",
  "до",
  "от",
  "из",
  "к",
  "ко",
  "у",
  "о",
  "об",
  "про",
  "для",
  "с",
  "со",
  "что",
  "это",
  "the",
  "a",
  "an",
  "of",
  "to",
  "for",
  "in",
  "on",
  "my"
]);
const CATEGORY_TRANSLATIONS = {
  "полнометражныи фильм": {
    ru: "Полнометражный фильм",
    en: "Feature Film",
    ua: "Повнометражний фільм",
    kz: "Толықметражды фильм",
    zh: "长篇电影",
    ko: "장편 영화",
    ro: "Film de lungmetraj",
    de: "Spielfilm",
    cz: "Celovečerní film",
    bg: "Пълнометражен филм"
  },
  аниме: {
    ru: "Аниме",
    en: "Anime",
    ua: "Аніме",
    kz: "Аниме",
    zh: "动漫",
    ko: "애니메",
    ro: "Anime",
    de: "Anime",
    cz: "Anime",
    bg: "Аниме"
  },
  платные: {
    ru: "Платные",
    en: "Paid",
    ua: "Платні",
    kz: "Ақылы",
    zh: "付费",
    ko: "유료",
    ro: "Cu plată",
    de: "Kostenpflichtig",
    cz: "Placené",
    bg: "Платени"
  },
  платно: {
    ru: "Платно",
    en: "Paid",
    ua: "Платно",
    kz: "Ақылы",
    zh: "付费",
    ko: "유료",
    ro: "Cu plată",
    de: "Kostenpflichtig",
    cz: "Placené",
    bg: "Платено"
  }
};
const HTML_LANG_MAP = {
  ru: "ru",
  en: "en",
  ua: "uk",
  kz: "kk",
  zh: "zh-CN",
  ko: "ko",
  ro: "ro",
  de: "de",
  cz: "cs",
  bg: "bg"
};

const I18N = {
  ru: {
    documentTitle: "Мини-Сериалы",
    brandTitle: "МИНИ-СЕРИАЛЫ",
    headerShellAria: "Шапка сайта",
    homeAria: "Главная",
    searchLabel: "Поиск",
    searchPlaceholder: "Введите название",
    suggestionsAria: "Поисковые подсказки",
    joinAria: "Вступить в Telegram",
    joinLabel: "Вступить",
    desktopLangAria: "Выбор языка",
    languageTriggerAria: "Язык интерфейса",
    languageMenuAria: "Список языков",
    mobileNavAria: "Мобильная навигация",
    mobileHomeTab: "Главная",
    mobileCategoriesTab: "Категории",
    mobileLangAria: "Выбор языка на мобильном",
    mobileLanguageTriggerAria: "Язык интерфейса (мобильный)",
    mobileLanguageMenuAria: "Список языков (мобильный)",
    sidebarAria: "Категории и сортировка",
    tagsSectionAria: "Фильтр тегов",
    categoriesTitle: "Категории",
    clearTags: "Сбросить",
    bsTitle: "Категория",
    bsReset: "Сбросить",
    bsConfirm: "Подтвердить",
    controlsAria: "Элементы поиска",
    sortLabel: "Сортировка",
    sortShellAria: "Выбор сортировки",
    sortTriggerAria: "Сортировка результатов",
    sortMenuAria: "Список сортировки",
    historyAria: "История поиска",
    historyTitle: "История",
    clearHistory: "Очистить",
    resultsTitle: "Результаты",
    noResults: "Ничего не найдено. Попробуйте изменить запрос или снять часть фильтров.",
    historyEmpty: "История пока пуста.",
    showMore: "Показать еще {count}",
    metaNoQuery: "Показано {visible} из {found} • Всего в каталоге {total}",
    metaWithQuery: "Найдено {found} • Показано {visible} • После фильтров {source}",
    catalogFallback: "Каталог",
    freeBadge: "Бесплатно",
    ruSubtitles: "RU субтитры",
    watch: "Смотреть",
    original: "Оригинал",
    errorPrefix: "Ошибка загрузки каталога",
    sort_relevance: "По релевантности",
    sort_title_asc: "По названию (A-Z)",
    sort_title_desc: "По названию (Z-A)",
    sort_year_desc: "Сначала новые",
    sort_year_asc: "Сначала старые"
  },
  en: {
    documentTitle: "Mini Series",
    brandTitle: "MINI SERIES",
    headerShellAria: "Site header",
    homeAria: "Home",
    searchLabel: "Search",
    searchPlaceholder: "Enter title",
    suggestionsAria: "Search suggestions",
    joinAria: "Join Telegram",
    joinLabel: "Join",
    desktopLangAria: "Language selection",
    languageTriggerAria: "Interface language",
    languageMenuAria: "Language list",
    mobileNavAria: "Mobile navigation",
    mobileHomeTab: "Home",
    mobileCategoriesTab: "Categories",
    mobileLangAria: "Mobile language selection",
    mobileLanguageTriggerAria: "Interface language (mobile)",
    mobileLanguageMenuAria: "Language list (mobile)",
    sidebarAria: "Categories and sorting",
    tagsSectionAria: "Tag filters",
    categoriesTitle: "Categories",
    clearTags: "Reset",
    bsTitle: "Category",
    bsReset: "Reset",
    bsConfirm: "Confirm",
    controlsAria: "Search controls",
    sortLabel: "Sort",
    sortShellAria: "Sort selection",
    sortTriggerAria: "Sort results",
    sortMenuAria: "Sort list",
    historyAria: "Search history",
    historyTitle: "History",
    clearHistory: "Clear",
    resultsTitle: "Results",
    noResults: "Nothing found. Try changing your query or removing some filters.",
    historyEmpty: "History is empty.",
    showMore: "Show more {count}",
    metaNoQuery: "Showing {visible} of {found} • Total in catalog {total}",
    metaWithQuery: "Found {found} • Showing {visible} • After filters {source}",
    catalogFallback: "Catalog",
    freeBadge: "Free",
    ruSubtitles: "RU subtitles",
    watch: "Watch",
    original: "Original",
    errorPrefix: "Catalog load error",
    sort_relevance: "By relevance",
    sort_title_asc: "By title (A-Z)",
    sort_title_desc: "By title (Z-A)",
    sort_year_desc: "Newest first",
    sort_year_asc: "Oldest first"
  },
  ua: {
    documentTitle: "Міні-Серіали",
    brandTitle: "МІНІ-СЕРІАЛИ",
    headerShellAria: "Шапка сайту",
    homeAria: "Головна",
    searchLabel: "Пошук",
    searchPlaceholder: "Введіть назву",
    suggestionsAria: "Підказки пошуку",
    joinAria: "Приєднатися до Telegram",
    joinLabel: "Приєднатися",
    desktopLangAria: "Вибір мови",
    languageTriggerAria: "Мова інтерфейсу",
    languageMenuAria: "Список мов",
    mobileNavAria: "Мобільна навігація",
    mobileHomeTab: "Головна",
    mobileCategoriesTab: "Категорії",
    mobileLangAria: "Вибір мови на мобільному",
    mobileLanguageTriggerAria: "Мова інтерфейсу (мобільний)",
    mobileLanguageMenuAria: "Список мов (мобільний)",
    sidebarAria: "Категорії та сортування",
    tagsSectionAria: "Фільтри тегів",
    categoriesTitle: "Категорії",
    clearTags: "Скинути",
    bsTitle: "Категорія",
    bsReset: "Скинути",
    bsConfirm: "Підтвердити",
    controlsAria: "Елементи пошуку",
    sortLabel: "Сортування",
    sortShellAria: "Вибір сортування",
    sortTriggerAria: "Сортування результатів",
    sortMenuAria: "Список сортування",
    historyAria: "Історія пошуку",
    historyTitle: "Історія",
    clearHistory: "Очистити",
    resultsTitle: "Результати",
    noResults: "Нічого не знайдено. Спробуйте змінити запит або зняти частину фільтрів.",
    historyEmpty: "Історія поки порожня.",
    showMore: "Показати ще {count}",
    metaNoQuery: "Показано {visible} з {found} • Усього в каталозі {total}",
    metaWithQuery: "Знайдено {found} • Показано {visible} • Після фільтрів {source}",
    catalogFallback: "Каталог",
    freeBadge: "Безкоштовно",
    ruSubtitles: "RU субтитри",
    watch: "Дивитися",
    original: "Оригінал",
    errorPrefix: "Помилка завантаження каталогу",
    sort_relevance: "За релевантністю",
    sort_title_asc: "За назвою (A-Z)",
    sort_title_desc: "За назвою (Z-A)",
    sort_year_desc: "Спочатку нові",
    sort_year_asc: "Спочатку старі"
  },
  kz: {
    documentTitle: "Мини-Сериалдар",
    brandTitle: "МИНИ-СЕРИАЛДАР",
    headerShellAria: "Сайт тақырыбы",
    homeAria: "Басты бет",
    searchLabel: "Іздеу",
    searchPlaceholder: "Атауын енгізіңіз",
    suggestionsAria: "Іздеу ұсыныстары",
    joinAria: "Telegram-ға қосылу",
    joinLabel: "Қосылу",
    desktopLangAria: "Тілді таңдау",
    languageTriggerAria: "Интерфейс тілі",
    languageMenuAria: "Тілдер тізімі",
    mobileNavAria: "Мобильді навигация",
    mobileHomeTab: "Басты бет",
    mobileCategoriesTab: "Санаттар",
    mobileLangAria: "Мобильді тіл таңдау",
    mobileLanguageTriggerAria: "Интерфейс тілі (мобильді)",
    mobileLanguageMenuAria: "Тілдер тізімі (мобильді)",
    sidebarAria: "Санаттар және сұрыптау",
    tagsSectionAria: "Тег сүзгілері",
    categoriesTitle: "Санаттар",
    clearTags: "Тазарту",
    bsTitle: "Санат",
    bsReset: "Тазарту",
    bsConfirm: "Растау",
    controlsAria: "Іздеу басқаруы",
    sortLabel: "Сұрыптау",
    sortShellAria: "Сұрыптауды таңдау",
    sortTriggerAria: "Нәтижелерді сұрыптау",
    sortMenuAria: "Сұрыптау тізімі",
    historyAria: "Іздеу тарихы",
    historyTitle: "Тарих",
    clearHistory: "Тазалау",
    resultsTitle: "Нәтижелер",
    noResults: "Ештеңе табылмады. Сұранысты өзгертіп көріңіз немесе сүзгілерді азайтыңыз.",
    historyEmpty: "Тарих әзірге бос.",
    showMore: "Тағы көрсету {count}",
    metaNoQuery: "{visible}/{found} көрсетілді • Каталогта барлығы {total}",
    metaWithQuery: "{found} табылды • {visible} көрсетілді • Сүзгіден кейін {source}",
    catalogFallback: "Каталог",
    freeBadge: "Тегін",
    ruSubtitles: "RU субтитрлері",
    watch: "Көру",
    original: "Түпнұсқа",
    errorPrefix: "Каталогты жүктеу қатесі",
    sort_relevance: "Релеванттық бойынша",
    sort_title_asc: "Атауы бойынша (A-Z)",
    sort_title_desc: "Атауы бойынша (Z-A)",
    sort_year_desc: "Алдымен жаңалары",
    sort_year_asc: "Алдымен ескілері"
  },
  zh: {
    documentTitle: "迷你剧集",
    brandTitle: "迷你剧集",
    headerShellAria: "网站页眉",
    homeAria: "首页",
    searchLabel: "搜索",
    searchPlaceholder: "输入片名",
    suggestionsAria: "搜索建议",
    joinAria: "加入 Telegram",
    joinLabel: "加入",
    desktopLangAria: "语言选择",
    languageTriggerAria: "界面语言",
    languageMenuAria: "语言列表",
    mobileNavAria: "移动端导航",
    mobileHomeTab: "首页",
    mobileCategoriesTab: "分类",
    mobileLangAria: "移动端语言选择",
    mobileLanguageTriggerAria: "界面语言（移动端）",
    mobileLanguageMenuAria: "语言列表（移动端）",
    sidebarAria: "分类与排序",
    tagsSectionAria: "标签筛选",
    categoriesTitle: "分类",
    clearTags: "重置",
    bsTitle: "分类",
    bsReset: "重置",
    bsConfirm: "确认",
    controlsAria: "搜索控制",
    sortLabel: "排序",
    sortShellAria: "选择排序",
    sortTriggerAria: "结果排序",
    sortMenuAria: "排序列表",
    historyAria: "搜索历史",
    historyTitle: "历史记录",
    clearHistory: "清除",
    resultsTitle: "结果",
    noResults: "未找到结果。请尝试修改搜索词或减少筛选条件。",
    historyEmpty: "历史记录为空。",
    showMore: "再显示 {count}",
    metaNoQuery: "已显示 {visible}/{found} • 目录共 {total}",
    metaWithQuery: "找到 {found} • 已显示 {visible} • 筛选后 {source}",
    catalogFallback: "目录",
    freeBadge: "免费",
    ruSubtitles: "RU 字幕",
    watch: "观看",
    original: "原始",
    errorPrefix: "目录加载错误",
    sort_relevance: "按相关度",
    sort_title_asc: "按标题 (A-Z)",
    sort_title_desc: "按标题 (Z-A)",
    sort_year_desc: "最新优先",
    sort_year_asc: "最早优先"
  },
  ko: {
    documentTitle: "미니 시리즈",
    brandTitle: "미니 시리즈",
    headerShellAria: "사이트 헤더",
    homeAria: "홈",
    searchLabel: "검색",
    searchPlaceholder: "제목 입력",
    suggestionsAria: "검색 제안",
    joinAria: "텔레그램 참여",
    joinLabel: "참여",
    desktopLangAria: "언어 선택",
    languageTriggerAria: "인터페이스 언어",
    languageMenuAria: "언어 목록",
    mobileNavAria: "모바일 내비게이션",
    mobileHomeTab: "홈",
    mobileCategoriesTab: "카테고리",
    mobileLangAria: "모바일 언어 선택",
    mobileLanguageTriggerAria: "인터페이스 언어(모바일)",
    mobileLanguageMenuAria: "언어 목록(모바일)",
    sidebarAria: "카테고리 및 정렬",
    tagsSectionAria: "태그 필터",
    categoriesTitle: "카테고리",
    clearTags: "초기화",
    bsTitle: "카테고리",
    bsReset: "초기화",
    bsConfirm: "확인",
    controlsAria: "검색 제어",
    sortLabel: "정렬",
    sortShellAria: "정렬 선택",
    sortTriggerAria: "결과 정렬",
    sortMenuAria: "정렬 목록",
    historyAria: "검색 기록",
    historyTitle: "기록",
    clearHistory: "지우기",
    resultsTitle: "결과",
    noResults: "검색 결과가 없습니다. 검색어를 바꾸거나 필터를 줄여보세요.",
    historyEmpty: "기록이 비어 있습니다.",
    showMore: "더 보기 {count}",
    metaNoQuery: "{found}개 중 {visible}개 표시 • 전체 {total}",
    metaWithQuery: "찾음 {found} • 표시 {visible} • 필터 후 {source}",
    catalogFallback: "카탈로그",
    freeBadge: "무료",
    ruSubtitles: "RU 자막",
    watch: "보기",
    original: "원본",
    errorPrefix: "카탈로그 로드 오류",
    sort_relevance: "관련도순",
    sort_title_asc: "제목순 (A-Z)",
    sort_title_desc: "제목순 (Z-A)",
    sort_year_desc: "최신순",
    sort_year_asc: "오래된순"
  },
  ro: {
    documentTitle: "Mini-Seriale",
    brandTitle: "MINI-SERIALE",
    headerShellAria: "Antet site",
    homeAria: "Acasă",
    searchLabel: "Căutare",
    searchPlaceholder: "Introdu titlul",
    suggestionsAria: "Sugestii de căutare",
    joinAria: "Intră pe Telegram",
    joinLabel: "Intră",
    desktopLangAria: "Selectare limbă",
    languageTriggerAria: "Limba interfeței",
    languageMenuAria: "Listă limbi",
    mobileNavAria: "Navigare mobilă",
    mobileHomeTab: "Acasă",
    mobileCategoriesTab: "Categorii",
    mobileLangAria: "Selectare limbă pe mobil",
    mobileLanguageTriggerAria: "Limba interfeței (mobil)",
    mobileLanguageMenuAria: "Listă limbi (mobil)",
    sidebarAria: "Categorii și sortare",
    tagsSectionAria: "Filtre de etichete",
    categoriesTitle: "Categorii",
    clearTags: "Resetează",
    bsTitle: "Categorie",
    bsReset: "Resetează",
    bsConfirm: "Confirmă",
    controlsAria: "Controale căutare",
    sortLabel: "Sortare",
    sortShellAria: "Selectare sortare",
    sortTriggerAria: "Sortare rezultate",
    sortMenuAria: "Listă sortare",
    historyAria: "Istoric căutări",
    historyTitle: "Istoric",
    clearHistory: "Șterge",
    resultsTitle: "Rezultate",
    noResults: "Nu s-a găsit nimic. Încearcă să schimbi căutarea sau să elimini filtre.",
    historyEmpty: "Istoricul este gol.",
    showMore: "Arată mai mult {count}",
    metaNoQuery: "Afișate {visible} din {found} • Total în catalog {total}",
    metaWithQuery: "Găsite {found} • Afișate {visible} • După filtre {source}",
    catalogFallback: "Catalog",
    freeBadge: "Gratuit",
    ruSubtitles: "Subtitrări RU",
    watch: "Vezi",
    original: "Original",
    errorPrefix: "Eroare la încărcarea catalogului",
    sort_relevance: "După relevanță",
    sort_title_asc: "După titlu (A-Z)",
    sort_title_desc: "După titlu (Z-A)",
    sort_year_desc: "Cele noi întâi",
    sort_year_asc: "Cele vechi întâi"
  },
  de: {
    documentTitle: "Mini-Serien",
    brandTitle: "MINI-SERIEN",
    headerShellAria: "Seitenkopf",
    homeAria: "Startseite",
    searchLabel: "Suche",
    searchPlaceholder: "Titel eingeben",
    suggestionsAria: "Suchvorschläge",
    joinAria: "Telegram beitreten",
    joinLabel: "Beitreten",
    desktopLangAria: "Sprachauswahl",
    languageTriggerAria: "Sprache der Oberfläche",
    languageMenuAria: "Sprachliste",
    mobileNavAria: "Mobile Navigation",
    mobileHomeTab: "Startseite",
    mobileCategoriesTab: "Kategorien",
    mobileLangAria: "Sprachauswahl mobil",
    mobileLanguageTriggerAria: "Sprache der Oberfläche (mobil)",
    mobileLanguageMenuAria: "Sprachliste (mobil)",
    sidebarAria: "Kategorien und Sortierung",
    tagsSectionAria: "Tag-Filter",
    categoriesTitle: "Kategorien",
    clearTags: "Zurücksetzen",
    bsTitle: "Kategorie",
    bsReset: "Zurücksetzen",
    bsConfirm: "Bestätigen",
    controlsAria: "Suchsteuerung",
    sortLabel: "Sortierung",
    sortShellAria: "Sortierung auswählen",
    sortTriggerAria: "Ergebnisse sortieren",
    sortMenuAria: "Sortierliste",
    historyAria: "Suchverlauf",
    historyTitle: "Verlauf",
    clearHistory: "Löschen",
    resultsTitle: "Ergebnisse",
    noResults: "Nichts gefunden. Ändere die Suche oder entferne einige Filter.",
    historyEmpty: "Der Verlauf ist leer.",
    showMore: "Mehr anzeigen {count}",
    metaNoQuery: "{visible} von {found} angezeigt • Insgesamt {total} im Katalog",
    metaWithQuery: "{found} gefunden • {visible} angezeigt • Nach Filtern {source}",
    catalogFallback: "Katalog",
    freeBadge: "Kostenlos",
    ruSubtitles: "RU-Untertitel",
    watch: "Ansehen",
    original: "Original",
    errorPrefix: "Fehler beim Laden des Katalogs",
    sort_relevance: "Nach Relevanz",
    sort_title_asc: "Nach Titel (A-Z)",
    sort_title_desc: "Nach Titel (Z-A)",
    sort_year_desc: "Neueste zuerst",
    sort_year_asc: "Älteste zuerst"
  },
  cz: {
    documentTitle: "Mini-Seriály",
    brandTitle: "MINI-SERIÁLY",
    headerShellAria: "Záhlaví webu",
    homeAria: "Domů",
    searchLabel: "Hledat",
    searchPlaceholder: "Zadejte název",
    suggestionsAria: "Návrhy hledání",
    joinAria: "Připojit se na Telegram",
    joinLabel: "Připojit se",
    desktopLangAria: "Výběr jazyka",
    languageTriggerAria: "Jazyk rozhraní",
    languageMenuAria: "Seznam jazyků",
    mobileNavAria: "Mobilní navigace",
    mobileHomeTab: "Domů",
    mobileCategoriesTab: "Kategorie",
    mobileLangAria: "Výběr jazyka na mobilu",
    mobileLanguageTriggerAria: "Jazyk rozhraní (mobil)",
    mobileLanguageMenuAria: "Seznam jazyků (mobil)",
    sidebarAria: "Kategorie a řazení",
    tagsSectionAria: "Filtry tagů",
    categoriesTitle: "Kategorie",
    clearTags: "Reset",
    bsTitle: "Kategorie",
    bsReset: "Reset",
    bsConfirm: "Potvrdit",
    controlsAria: "Ovládání vyhledávání",
    sortLabel: "Řazení",
    sortShellAria: "Výběr řazení",
    sortTriggerAria: "Řazení výsledků",
    sortMenuAria: "Seznam řazení",
    historyAria: "Historie hledání",
    historyTitle: "Historie",
    clearHistory: "Vymazat",
    resultsTitle: "Výsledky",
    noResults: "Nic nenalezeno. Zkuste změnit dotaz nebo odebrat část filtrů.",
    historyEmpty: "Historie je zatím prázdná.",
    showMore: "Zobrazit více {count}",
    metaNoQuery: "Zobrazeno {visible} z {found} • Celkem v katalogu {total}",
    metaWithQuery: "Nalezeno {found} • Zobrazeno {visible} • Po filtrech {source}",
    catalogFallback: "Katalog",
    freeBadge: "Zdarma",
    ruSubtitles: "RU titulky",
    watch: "Sledovat",
    original: "Originál",
    errorPrefix: "Chyba načtení katalogu",
    sort_relevance: "Podle relevance",
    sort_title_asc: "Podle názvu (A-Z)",
    sort_title_desc: "Podle názvu (Z-A)",
    sort_year_desc: "Nejnovější první",
    sort_year_asc: "Nejstarší první"
  },
  bg: {
    documentTitle: "Мини-Сериали",
    brandTitle: "МИНИ-СЕРИАЛИ",
    headerShellAria: "Горна част на сайта",
    homeAria: "Начало",
    searchLabel: "Търсене",
    searchPlaceholder: "Въведете заглавие",
    suggestionsAria: "Предложения за търсене",
    joinAria: "Присъедини се в Telegram",
    joinLabel: "Присъедини се",
    desktopLangAria: "Избор на език",
    languageTriggerAria: "Език на интерфейса",
    languageMenuAria: "Списък с езици",
    mobileNavAria: "Мобилна навигация",
    mobileHomeTab: "Начало",
    mobileCategoriesTab: "Категории",
    mobileLangAria: "Избор на език на мобилен",
    mobileLanguageTriggerAria: "Език на интерфейса (мобилен)",
    mobileLanguageMenuAria: "Списък с езици (мобилен)",
    sidebarAria: "Категории и сортиране",
    tagsSectionAria: "Филтри по тагове",
    categoriesTitle: "Категории",
    clearTags: "Нулирай",
    bsTitle: "Категория",
    bsReset: "Нулирай",
    bsConfirm: "Потвърди",
    controlsAria: "Контроли за търсене",
    sortLabel: "Сортиране",
    sortShellAria: "Избор на сортиране",
    sortTriggerAria: "Сортиране на резултатите",
    sortMenuAria: "Списък за сортиране",
    historyAria: "История на търсенията",
    historyTitle: "История",
    clearHistory: "Изчисти",
    resultsTitle: "Резултати",
    noResults: "Няма намерени резултати. Опитайте да промените заявката или да махнете част от филтрите.",
    historyEmpty: "Историята е празна.",
    showMore: "Покажи още {count}",
    metaNoQuery: "Показани {visible} от {found} • Общо в каталога {total}",
    metaWithQuery: "Намерени {found} • Показани {visible} • След филтри {source}",
    catalogFallback: "Каталог",
    freeBadge: "Безплатно",
    ruSubtitles: "RU субтитри",
    watch: "Гледай",
    original: "Оригинал",
    errorPrefix: "Грешка при зареждане на каталога",
    sort_relevance: "По релевантност",
    sort_title_asc: "По заглавие (A-Z)",
    sort_title_desc: "По заглавие (Z-A)",
    sort_year_desc: "Първо новите",
    sort_year_asc: "Първо старите"
  }
};

const ui = {
  catalogApp: document.querySelector(".catalog-app"),
  topbar: document.querySelector(".topbar"),
  brandLogo: document.getElementById("brandLogo"),
  brandTitle: document.querySelector(".brand-title"),
  headerShell: document.querySelector(".header-shell"),
  brandLink: document.querySelector(".brand-inline"),
  searchInput: document.getElementById("searchInput"),
  searchLabel: document.querySelector(".search-label"),
  suggestions: document.getElementById("suggestions"),
  joinBtn: document.querySelector(".join-btn"),
  joinLabel: document.querySelector(".join-label"),
  mobileSearchSubmitBtn: document.getElementById("mobileSearchSubmitBtn"),
  languageSelectButton: document.getElementById("languageSelectButton"),
  languageMenuDesktop: document.getElementById("languageMenuDesktop"),
  languageSelect: document.getElementById("languageSelect"),
  desktopLangShell: document.querySelector(".desktop-lang"),
  mobileSubnav: document.querySelector(".mobile-subnav"),
  languageSelectMobileButton: document.getElementById("languageSelectMobileButton"),
  languageMenuMobile: document.getElementById("languageMenuMobile"),
  languageSelectMobile: document.getElementById("languageSelectMobile"),
  mobileLangShell: document.querySelector(".mobile-lang"),
  catScrollContainer: document.getElementById("catScrollContainer"),
  openCategoryMenuBtn: document.getElementById("openCategoryMenuBtn"),
  categoryBottomSheet: document.getElementById("categoryBottomSheet"),
  bottomSheetTags: document.getElementById("bottomSheetTags"),
  bsResetBtn: document.getElementById("bsResetBtn"),
  bsConfirmBtn: document.getElementById("bsConfirmBtn"),
  bsTitle: document.getElementById("bsTitle"),
  sortSelectButton: document.getElementById("sortSelectButton"),
  sortMenu: document.getElementById("sortMenu"),
  sortSelect: document.getElementById("sortSelect"),
  sortLabel: document.getElementById("sortLabelEl"),
  sortShell: document.querySelector(".sort-shell"),
  sidebarColumn: document.querySelector(".sidebar-column"),
  categoriesTitle: document.querySelector("#genresSection .section-head h2"),
  tagsContainer: document.getElementById("tagsContainer"),
  clearTagsBtn: document.getElementById("clearTagsBtn"),
  controls: document.querySelector(".controls"),
  historyBlock: document.querySelector(".history-block"),
  historyTitle: document.querySelector(".history-block .section-head h2"),
  resultsBlock: document.querySelector(".results-block"),
  historyContainer: document.getElementById("historyContainer"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  resultsTitle: document.getElementById("resultsTitle"),
  resultsGrid: document.getElementById("resultsGrid"),
  resultsMeta: document.getElementById("resultsMeta"),
  loadMoreBtn: document.getElementById("loadMoreBtn"),
  resultsSentinel: document.getElementById("resultsSentinel"),
  resultsSwipeCurrent: null,
  resultsSwipePreview: null
};

const state = {
  items: [],
  fuse: null,
  tags: [],
  query: "",
  selectedTags: new Set(),
  language: FALLBACK_LANG,
  sort: "relevance",
  history: [],
  suggestionItems: [],
  activeSuggestionIndex: -1,
  baseSuggestionPool: [],
  historyTimer: null,
  searchTimer: null,
  resizeTimer: null,
  resultRows: [],
  visibleResultCount: 0,
  sourceResultCount: 0,
  pageSize: 0,
  observer: null,
  dataReady: false,
  mobileSearchFocused: false,
  suppressSuggestionsUntilInput: false
};

let tempSelectedTags = new Set();

document.addEventListener("DOMContentLoaded", () => {
  init().catch((error) => {
    renderError(error);
    console.error(error);
  });
});

async function init() {
  setupBrandLogo();
  state.history = loadHistory();
  state.pageSize = getResultsPageSize();
  bindEvents();
  applyInterfaceTranslations();
  updateMobileDropdownSizing();
  applyMobileLayoutState();
  ensureResultsSwipeLayers();
  setupDynamicLoading();
  renderHistory();
  await loadData();
  ensureDefaultCategorySelection();
  renderTags();
  runSearch();
}

function getDictionary(language = state.language) {
  return I18N[language] || I18N[FALLBACK_LANG];
}

function tr(key, vars = {}) {
  const dict = getDictionary();
  const fallback = I18N[FALLBACK_LANG] || {};
  const template = dict[key] ?? fallback[key] ?? key;
  return String(template).replace(/\{(\w+)\}/g, (_, token) => String(vars[token] ?? ""));
}

function setTextContent(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function setAttr(node, name, value) {
  if (node) {
    node.setAttribute(name, value);
  }
}

function applySortOptionTranslations() {
  if (!ui.sortSelect) {
    return;
  }
  for (const key of SORT_OPTION_KEYS) {
    const option = ui.sortSelect.querySelector(`option[value="${key}"]`);
    if (option) {
      option.textContent = tr(`sort_${key}`);
    }
  }
}

function longestOptionLength(select) {
  if (!select) {
    return 0;
  }
  return Array.from(select.options).reduce((max, option) => {
    const len = String(option.textContent || option.value || "").trim().length;
    return Math.max(max, len);
  }, 0);
}

function selectedOptionLength(select, value) {
  if (!select) {
    return 0;
  }
  const options = Array.from(select.options);
  const preferred = options.find((option) => option.value === value);
  const active = preferred || select.selectedOptions?.[0] || options[0];
  if (!active) {
    return 0;
  }
  return String(active.textContent || active.value || "").trim().length;
}

function updateMobileDropdownSizing() {
  const langSelect = ui.languageSelectMobile || ui.languageSelect;
  const langLen = longestOptionLength(langSelect);
  const langSelectedLen = selectedOptionLength(langSelect, state.language);
  const sortLen = longestOptionLength(ui.sortSelect);
  const sortSelectedLen = selectedOptionLength(ui.sortSelect, state.sort);

  const langTriggerCh = clamp(langSelectedLen, 4, 9);
  const langMenuCh = clamp(langLen + 1, 8, 13);
  const sortTriggerCh = clamp(sortSelectedLen, 8, 19);
  const sortMenuCh = clamp(sortLen + 1, 10, 21);

  document.documentElement.style.setProperty("--mobile-lang-trigger-ch", String(langTriggerCh));
  document.documentElement.style.setProperty("--mobile-lang-menu-ch", String(langMenuCh));
  document.documentElement.style.setProperty("--mobile-sort-trigger-ch", String(sortTriggerCh));
  document.documentElement.style.setProperty("--mobile-sort-menu-ch", String(sortMenuCh));
}

function applyInterfaceTranslations() {
  document.documentElement.lang = HTML_LANG_MAP[state.language] || state.language || FALLBACK_LANG;
  document.title = tr("documentTitle");
  setTextContent(ui.brandTitle, tr("brandTitle"));
  setAttr(ui.headerShell, "aria-label", tr("headerShellAria"));
  setAttr(ui.brandLink, "aria-label", tr("homeAria"));
  setTextContent(ui.searchLabel, tr("searchLabel"));
  setAttr(ui.searchInput, "placeholder", tr("searchPlaceholder"));
  setAttr(ui.suggestions, "aria-label", tr("suggestionsAria"));
  setAttr(ui.joinBtn, "aria-label", tr("joinAria"));
  setTextContent(ui.joinLabel, tr("joinLabel"));
  setTextContent(ui.mobileSearchSubmitBtn, tr("searchLabel"));
  setAttr(ui.mobileSearchSubmitBtn, "aria-label", tr("searchLabel"));

  setAttr(ui.desktopLangShell, "aria-label", tr("desktopLangAria"));
  setAttr(ui.languageSelectButton, "aria-label", tr("languageTriggerAria"));
  setAttr(ui.languageMenuDesktop, "aria-label", tr("languageMenuAria"));

  setAttr(ui.mobileSubnav, "aria-label", tr("mobileNavAria"));
  setAttr(ui.mobileLangShell, "aria-label", tr("mobileLangAria"));
  setAttr(ui.languageSelectMobileButton, "aria-label", tr("mobileLanguageTriggerAria"));
  setAttr(ui.languageMenuMobile, "aria-label", tr("mobileLanguageMenuAria"));

  setAttr(ui.sidebarColumn, "aria-label", tr("sidebarAria"));
  setAttr(document.getElementById("genresSection"), "aria-label", tr("tagsSectionAria"));
  setTextContent(ui.categoriesTitle, tr("categoriesTitle"));
  setTextContent(ui.clearTagsBtn, tr("clearTags"));
  setTextContent(ui.bsTitle, tr("bsTitle"));
  setTextContent(ui.bsResetBtn, tr("bsReset"));
  setTextContent(ui.bsConfirmBtn, tr("bsConfirm"));
  setAttr(ui.controls, "aria-label", tr("controlsAria"));
  setTextContent(ui.sortLabel, tr("sortLabel"));
  setAttr(ui.sortShell, "aria-label", tr("sortShellAria"));
  setAttr(ui.sortSelectButton, "aria-label", tr("sortTriggerAria"));
  setAttr(ui.sortMenu, "aria-label", tr("sortMenuAria"));

  setAttr(ui.historyBlock, "aria-label", tr("historyAria"));
  setTextContent(ui.historyTitle, tr("historyAria"));
  setAttr(ui.clearHistoryBtn, "aria-label", tr("clearHistory"));
  setTextContent(ui.resultsTitle, tr("resultsTitle"));

  applySortOptionTranslations();
  updateMobileDropdownSizing();
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 979.98px)").matches;
}

function applyMobileLayoutState() {
  const root = ui.catalogApp;
  if (!root) {
    return;
  }

  const mobile = isMobileViewport();
  root.classList.toggle("is-mobile-home", mobile);
  root.classList.remove("is-mobile-categories");
  root.classList.toggle("is-mobile-searching", mobile && state.mobileSearchFocused);
  updateMobileTopbarOffset();
}

function updateMobileTopbarOffset() {
  if (!ui.catalogApp) {
    return;
  }
  if (!isMobileViewport() || !ui.topbar) {
    ui.catalogApp.style.removeProperty("--mobile-topbar-offset");
    return;
  }
  const topbarHeight = Math.max(Math.ceil(ui.topbar.getBoundingClientRect().height), 96);
  ui.catalogApp.style.setProperty("--mobile-topbar-offset", `${topbarHeight}px`);
}

function setMobileSearchFocused(isFocused) {
  state.mobileSearchFocused = Boolean(isFocused);
  applyMobileLayoutState();
  renderHistory();
}

function ensureResultsSwipeLayers() {
  if (!ui.resultsBlock || ui.resultsSwipeCurrent || ui.resultsSwipePreview) {
    return;
  }
  const current = document.createElement("div");
  current.className = "results-swipe-current";
  while (ui.resultsBlock.firstChild) {
    current.appendChild(ui.resultsBlock.firstChild);
  }
  const preview = document.createElement("div");
  preview.className = "results-swipe-preview";
  ui.resultsBlock.append(current, preview);
  ui.resultsSwipeCurrent = current;
  ui.resultsSwipePreview = preview;
}

function getResultsSwipeWidth() {
  if (!ui.resultsBlock) {
    return Math.max(window.innerWidth || 0, 320);
  }
  const width = Math.round(ui.resultsBlock.getBoundingClientRect().width);
  return Math.max(width || 0, 280);
}

function getResultsSwipeTravel() {
  return getResultsSwipeWidth() + RESULTS_SWIPE_PANEL_GAP_PX;
}

function setResultsSwipeOffset(offsetX, { immediate = false } = {}) {
  const target = ui.resultsSwipeCurrent || ui.resultsBlock;
  if (!target) {
    return;
  }
  const swipeTravel = getResultsSwipeTravel();
  const clamped = clamp(offsetX, -swipeTravel * 0.98, swipeTravel * 0.98);
  if (immediate) {
    target.style.transition = "none";
  } else {
    target.style.transition = "transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1)";
  }
  target.style.transform = `translate3d(${clamped}px, 0, 0)`;
  target.style.opacity = "1";
}

function setResultsSwipePreviewOffset(offsetX, direction, { immediate = false } = {}) {
  const preview = ui.resultsSwipePreview;
  if (!preview || !ui.resultsBlock || (direction !== 1 && direction !== -1)) {
    return;
  }
  const swipeTravel = getResultsSwipeTravel();
  const baseX = direction > 0 ? swipeTravel : -swipeTravel;
  const x = clamp(baseX + offsetX, -swipeTravel * 1.15, swipeTravel * 1.15);
  if (immediate) {
    preview.style.transition = "none";
  } else {
    preview.style.transition = "transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1)";
  }
  preview.style.transform = `translate3d(${x}px, 0, 0)`;
  preview.style.opacity = "1";
}

function getActiveCategoryTag() {
  if (!Array.isArray(state.tags) || state.tags.length === 0) {
    return "";
  }
  const selected = [...state.selectedTags].find((tag) => state.tags.includes(tag));
  return selected || getDefaultCategoryTag() || state.tags[0] || "";
}

function getAdjacentCategoryTag(direction) {
  if (!Array.isArray(state.tags) || state.tags.length === 0) {
    return "";
  }
  const step = direction > 0 ? 1 : -1;
  const total = state.tags.length;
  if (total < 2) {
    return "";
  }
  const currentTag = getActiveCategoryTag();
  let currentIndex = currentTag ? state.tags.indexOf(currentTag) : -1;
  if (currentIndex < 0) {
    currentIndex = 0;
  }
  const targetIndex = currentIndex + step;
  if (targetIndex < 0 || targetIndex >= total) {
    return "";
  }
  return state.tags[targetIndex] || "";
}

function buildRowsForSwipeCategory(tag) {
  const query = (state.query || "").trim();
  if (query) {
    const rows = state.resultRows.slice();
    const visibleCount = Math.min(rows.length, state.pageSize);
    return {
      query,
      rows,
      visibleCount,
      foundCount: rows.length,
      sourceCount: state.sourceResultCount
    };
  }

  const filteredByTag = state.items.filter((item) => {
    const itemTags = item._tagsSet instanceof Set ? item._tagsSet : new Set(item.tags || []);
    return itemTags.has(tag);
  });
  const rows = sortRows(filteredByTag.map((item) => ({ item, score: 0.45, coverage: 0 })));
  const visibleCount = Math.min(rows.length, state.pageSize);
  return {
    query,
    rows,
    visibleCount,
    foundCount: rows.length,
    sourceCount: filteredByTag.length
  };
}

function buildSwipePreviewContent(direction) {
  const targetTag = getAdjacentCategoryTag(direction);
  if (!targetTag) {
    return "";
  }
  const previewData = buildRowsForSwipeCategory(targetTag);
  const visibleRows = previewData.rows.slice(0, previewData.visibleCount);
  const resultsTitle = ui.resultsTitle ? ui.resultsTitle.textContent || tr("resultsTitle") : tr("resultsTitle");
  const metaText = !previewData.query
    ? tr("metaNoQuery", { visible: previewData.visibleCount, found: previewData.foundCount, total: state.items.length })
    : tr("metaWithQuery", {
        found: previewData.foundCount,
        visible: previewData.visibleCount,
        source: previewData.sourceCount
      });
  const cardsHtml = buildResultsGridHtml(visibleRows, previewData.query);
  const remaining = previewData.foundCount - previewData.visibleCount;
  const nextPortion = Math.min(Math.max(remaining, 0), state.pageSize);
  const loadMoreHtml =
    remaining > 0
      ? `<div class="results-actions"><button class="load-more-btn" type="button" disabled aria-hidden="true">${escapeHtml(
          tr("showMore", { count: nextPortion })
        )}</button></div>`
      : '<div class="results-actions"></div>';

  return `
    <div class="section-head">
      <h2>${escapeHtml(resultsTitle)}</h2>
      <p class="meta">${escapeHtml(metaText)}</p>
    </div>
    <div class="results-grid">${cardsHtml}</div>
    ${loadMoreHtml}
    <div class="results-sentinel" aria-hidden="true"></div>
  `;
}

function prepareResultsSwipePreview(direction, { offsetX = 0 } = {}) {
  ensureResultsSwipeLayers();
  const preview = ui.resultsSwipePreview;
  if (!ui.resultsBlock || !preview || (direction !== 1 && direction !== -1)) {
    return false;
  }
  if (!getAdjacentCategoryTag(direction)) {
    return false;
  }

  const previousDirection = Number(preview.dataset.direction || "0");
  const shouldRebuild = previousDirection !== direction || preview.innerHTML.trim().length === 0;
  if (shouldRebuild) {
    preview.innerHTML = buildSwipePreviewContent(direction);
    const previewGrid = preview.querySelector(".results-grid");
    if (previewGrid) {
      wirePosterFallbacks(previewGrid);
    }
  }
  preview.dataset.direction = String(direction);
  ui.resultsBlock.classList.add("is-swipe-active");
  setResultsSwipePreviewOffset(offsetX, direction, { immediate: true });
  return true;
}

function resetResultsSwipeOffset({ immediate = false } = {}) {
  const target = ui.resultsSwipeCurrent || ui.resultsBlock;
  if (!target) {
    return;
  }
  if (immediate) {
    target.style.transition = "none";
  } else {
    target.style.transition = "transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1)";
  }
  target.style.transform = "translate3d(0, 0, 0)";
  target.style.opacity = "1";

  const preview = ui.resultsSwipePreview;
  if (preview) {
    const direction = Number(preview.dataset.direction || "0");
    if (direction === 1 || direction === -1) {
      setResultsSwipePreviewOffset(0, direction, { immediate });
    }
  }
}

function clearResultsSwipeInlineStyles() {
  const target = ui.resultsSwipeCurrent || ui.resultsBlock;
  if (target) {
    target.style.transition = "";
    target.style.transform = "";
    target.style.opacity = "";
  }
  const preview = ui.resultsSwipePreview;
  if (preview) {
    preview.style.transition = "";
    preview.style.transform = "";
    preview.style.opacity = "";
    preview.dataset.direction = "";
    preview.innerHTML = "";
  }
  if (!ui.resultsBlock) {
    return;
  }
  ui.resultsBlock.classList.remove("is-swipe-active");
}

function isCategoryBottomSheetVisible() {
  return Boolean(ui.categoryBottomSheet && !ui.categoryBottomSheet.hidden && ui.categoryBottomSheet.classList.contains("is-visible"));
}

function shouldIgnoreCategorySwipeStart(target) {
  if (!(target instanceof Element)) {
    return true;
  }
  const inResultsCards = Boolean(target.closest("#resultsGrid, .results-grid, .card, .compact-card, .poster, .card-body"));
  if (!inResultsCards) {
    return true;
  }
  return Boolean(
    target.closest(
      "input, textarea, select, a, .search-wrap, .suggestions, .lang-shell, .lang-menu, .cat-scroll-container, .bottom-sheet, .bottom-sheet-overlay"
    )
  );
}

function switchCategoryBySwipe(direction) {
  const targetTag = getAdjacentCategoryTag(direction);
  if (!targetTag) {
    return;
  }
  const currentSelected = [...state.selectedTags].find((tag) => state.tags.includes(tag)) || "";
  if (currentSelected === targetTag && state.selectedTags.size === 1) {
    return;
  }
  state.selectedTags.clear();
  state.selectedTags.add(targetTag);
  renderTags();
  cancelScheduledSearch();
  runSearch();
}

function toggleSingleTagSelection(targetSet, tag) {
  const value = String(tag || "").trim();
  if (!value || !(targetSet instanceof Set)) {
    return;
  }
  if (targetSet.size === 1 && targetSet.has(value)) {
    targetSet.clear();
    return;
  }
  targetSet.clear();
  targetSet.add(value);
}

function cancelScheduledSearch() {
  if (state.searchTimer) {
    clearTimeout(state.searchTimer);
    state.searchTimer = null;
  }
}

function scheduleSearch() {
  cancelScheduledSearch();
  state.searchTimer = setTimeout(() => {
    state.searchTimer = null;
    runSearch();
  }, SEARCH_INPUT_DEBOUNCE_MS);
}

function setupBrandLogo() {
  const logo = ui.brandLogo;
  if (!logo) {
    return;
  }

  const hide = () => {
    logo.classList.add("is-hidden");
  };

  logo.addEventListener("error", hide, { once: true });
  if (logo.complete && logo.naturalWidth === 0) {
    hide();
  }
}

function createCustomDropdown({ select, button, menu, onSelect, closeOthers }) {
  if (!select || !button || !menu) {
    return null;
  }

  const shell = button.closest(".lang-shell");
  if (!shell) {
    return null;
  }

  let options = [];

  const readOptions = () => {
    options = Array.from(select.options).map((option) => ({
      value: option.value,
      label: String(option.textContent || option.value || "").trim()
    }));
  };

  const renderMenuOptions = () => {
    menu.innerHTML = "";
    options.forEach((option) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lang-menu-item";
      btn.dataset.value = option.value;
      btn.setAttribute("role", "option");
      btn.textContent = option.label;
      li.appendChild(btn);
      menu.appendChild(li);
    });
  };

  readOptions();
  renderMenuOptions();

  const setOpen = (isOpen) => {
    shell.classList.toggle("is-open", isOpen);
    menu.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
  };

  const close = () => {
    setOpen(false);
  };

  const open = () => {
    closeOthers();
    setOpen(true);
  };

  const sync = (value) => {
    const selected = String(value || "").trim();
    readOptions();
    renderMenuOptions();
    if (select.value !== selected) {
      select.value = selected;
    }

    const active = options.find((option) => option.value === selected) || options[0];
    if (!active) {
      return;
    }

    if (select.value !== active.value) {
      select.value = active.value;
    }
    button.textContent = active.label;

    menu.querySelectorAll(".lang-menu-item").forEach((item) => {
      const isActive = item.dataset.value === active.value;
      item.classList.toggle("is-selected", isActive);
      item.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  };

  button.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) {
      close();
    } else {
      open();
    }
  });

  button.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  });

  menu.addEventListener("click", (event) => {
    const target = event.target.closest(".lang-menu-item[data-value]");
    if (!target) {
      return;
    }
    const value = target.dataset.value || "";
    onSelect(value);
    close();
  });

  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      button.focus();
    }
  });

  return {
    close,
    sync,
    refresh() {
      sync(select.value);
    }
  };
}

function bindEvents() {
  const dropdowns = [];
  const languageDropdowns = [];
  let sortDropdown = null;
  const swipeState = {
    tracking: false,
    startX: 0,
    startY: 0,
    startAt: 0,
    deltaX: 0,
    axis: "",
    direction: 0,
    animating: false,
    cleanupTimer: 0
  };

  const closeDropdowns = () => {
    dropdowns.forEach((dropdown) => dropdown.close());
  };

  const registerDropdown = ({ select, button, menu, onSelect }) => {
    const dropdown = createCustomDropdown({
      select,
      button,
      menu,
      onSelect,
      closeOthers: closeDropdowns
    });
    if (dropdown) {
      dropdowns.push(dropdown);
    }
    return dropdown;
  };

  const setLanguage = (rawValue) => {
    const selected = String(rawValue || "").trim();
    state.language = LANGS.includes(selected) ? selected : FALLBACK_LANG;
    applyInterfaceTranslations();
    rebuildSuggestionPool();
    if (ui.languageSelect && ui.languageSelect.value !== state.language) {
      ui.languageSelect.value = state.language;
    }
    if (ui.languageSelectMobile && ui.languageSelectMobile.value !== state.language) {
      ui.languageSelectMobile.value = state.language;
    }
    languageDropdowns.forEach((dropdown) => dropdown.sync(state.language));
    if (sortDropdown) {
      sortDropdown.refresh();
    }
    renderTags();
    renderHistory();
    cancelScheduledSearch();
    runSearch();
  };

  const setSort = (rawValue) => {
    const selected = String(rawValue || "").trim();
    const allowed = ui.sortSelect ? Array.from(ui.sortSelect.options).map((option) => option.value) : [];
    state.sort = allowed.includes(selected) ? selected : "relevance";
    if (ui.sortSelect && ui.sortSelect.value !== state.sort) {
      ui.sortSelect.value = state.sort;
    }
    if (sortDropdown) {
      sortDropdown.sync(state.sort);
    }
    updateMobileDropdownSizing();
    cancelScheduledSearch();
    runSearch();
  };

  const registerLanguageDropdown = (select, button, menu) => {
    const dropdown = registerDropdown({ select, button, menu, onSelect: setLanguage });
    if (dropdown) {
      languageDropdowns.push(dropdown);
    }
  };

  const guardNativeSelectFocus = (select, button) => {
    if (!select) {
      return;
    }
    select.addEventListener("focus", () => {
      select.blur();
      if (button && document.activeElement !== button) {
        button.focus();
      }
    });
  };

  registerLanguageDropdown(ui.languageSelect, ui.languageSelectButton, ui.languageMenuDesktop);
  registerLanguageDropdown(ui.languageSelectMobile, ui.languageSelectMobileButton, ui.languageMenuMobile);
  sortDropdown = registerDropdown({
    select: ui.sortSelect,
    button: ui.sortSelectButton,
    menu: ui.sortMenu,
    onSelect: setSort
  });

  if (ui.languageSelect) {
    ui.languageSelect.value = state.language;
  }
  if (ui.languageSelectMobile) {
    ui.languageSelectMobile.value = state.language;
  }
  if (ui.sortSelect) {
    ui.sortSelect.value = state.sort;
  }
  languageDropdowns.forEach((dropdown) => dropdown.sync(state.language));
  if (sortDropdown) {
    sortDropdown.sync(state.sort);
  }

  guardNativeSelectFocus(ui.languageSelect, ui.languageSelectButton);
  guardNativeSelectFocus(ui.languageSelectMobile, ui.languageSelectMobileButton);
  guardNativeSelectFocus(ui.sortSelect, ui.sortSelectButton);

  const submitSearchFromInput = () => {
    cancelQueuedHistorySave();
    state.suppressSuggestionsUntilInput = true;
    persistHistory(state.query);
    cancelScheduledSearch();
    runSearch();
    hideSuggestions();
    if (isMobileViewport()) {
      ui.searchInput.blur();
      setMobileSearchFocused(false);
    }
  };

  ui.searchInput.addEventListener("input", () => {
    state.query = ui.searchInput.value;
    state.suppressSuggestionsUntilInput = false;
    scheduleSearch();
    updateSuggestions();
    queueHistorySave();
  });

  ui.searchInput.addEventListener("focus", () => {
    updateSuggestions();
    setMobileSearchFocused(true);
  });

  ui.searchInput.addEventListener("blur", () => {
    window.setTimeout(() => {
      if (document.activeElement !== ui.searchInput) {
        setMobileSearchFocused(false);
      }
    }, 0);
  });

  ui.searchInput.addEventListener("keydown", (event) => {
    const hasSuggestions = state.suggestionItems.length > 0 && ui.suggestions.classList.contains("visible");
    if (event.key === "ArrowDown" && hasSuggestions) {
      event.preventDefault();
      moveActiveSuggestion(1);
      return;
    }
    if (event.key === "ArrowUp" && hasSuggestions) {
      event.preventDefault();
      moveActiveSuggestion(-1);
      return;
    }
    if (event.key === "Enter") {
      if (hasSuggestions && state.activeSuggestionIndex >= 0) {
        event.preventDefault();
        applySuggestion(state.suggestionItems[state.activeSuggestionIndex]);
        return;
      }
      submitSearchFromInput();
      return;
    }
    if (event.key === "Escape") {
      hideSuggestions();
    }
  });

  ui.suggestions.addEventListener("pointerdown", (event) => {
    const target = event.target.closest("li[data-value]");
    if (!target) {
      return;
    }
    event.preventDefault();
    applySuggestion(target.dataset.value || "");
  });

  if (ui.mobileSearchSubmitBtn) {
    ui.mobileSearchSubmitBtn.addEventListener("click", () => {
      submitSearchFromInput();
    });
  }

  if (ui.languageSelect) {
    ui.languageSelect.addEventListener("change", () => {
      setLanguage(ui.languageSelect.value);
    });
  }

  if (ui.languageSelectMobile) {
    ui.languageSelectMobile.addEventListener("change", () => {
      setLanguage(ui.languageSelectMobile.value);
    });
  }

  if (ui.sortSelect) {
    ui.sortSelect.addEventListener("change", () => {
      setSort(ui.sortSelect.value);
    });
  }

  ui.clearTagsBtn.addEventListener("click", () => {
    state.selectedTags.clear();
    renderTags();
    cancelScheduledSearch();
    runSearch();
  });

  ui.tagsContainer.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-tag]");
    if (!target) {
      return;
    }
    const tag = target.dataset.tag;
    if (!tag) {
      return;
    }
    toggleSingleTagSelection(state.selectedTags, tag);
    renderTags();
    cancelScheduledSearch();
    runSearch();
  });

  if (ui.catScrollContainer) {
    ui.catScrollContainer.addEventListener("click", (event) => {
      const target = event.target.closest(".cat-tab[data-tag]");
      if (!target) {
        return;
      }
      const tag = target.dataset.tag;
      if (!tag) {
        return;
      }
      if (state.selectedTags.size === 1 && state.selectedTags.has(tag)) {
        return;
      }
      toggleSingleTagSelection(state.selectedTags, tag);
      renderTags();
      cancelScheduledSearch();
      runSearch();
    });
  }

  if (ui.openCategoryMenuBtn) {
    ui.openCategoryMenuBtn.addEventListener("click", () => {
      closeDropdowns();
      tempSelectedTags = new Set([...state.selectedTags].slice(0, 1));
      renderBottomSheetCategories();
      openCategoryBottomSheet();
    });
  }

  if (ui.categoryBottomSheet) {
    ui.categoryBottomSheet.addEventListener("click", (event) => {
      if (event.target === ui.categoryBottomSheet) {
        closeCategoryBottomSheet();
      }
    });
  }

  if (ui.bottomSheetTags) {
    ui.bottomSheetTags.addEventListener("click", (event) => {
      const target = event.target.closest(".bs-chip[data-tag]");
      if (!target) {
        return;
      }
      const tag = target.dataset.tag;
      if (!tag) {
        return;
      }
      if (tempSelectedTags.size === 1 && tempSelectedTags.has(tag)) {
        return;
      }
      toggleSingleTagSelection(tempSelectedTags, tag);
      renderBottomSheetCategories();
    });
  }

  if (ui.bsResetBtn) {
    ui.bsResetBtn.addEventListener("click", () => {
      const activeTag = [...state.selectedTags].find((tag) => state.tags.includes(tag)) || getDefaultCategoryTag();
      tempSelectedTags.clear();
      if (activeTag) {
        tempSelectedTags.add(activeTag);
      }
      renderBottomSheetCategories();
    });
  }

  if (ui.bsConfirmBtn) {
    ui.bsConfirmBtn.addEventListener("click", () => {
      state.selectedTags = new Set([...tempSelectedTags].slice(0, 1));
      closeCategoryBottomSheet();
      renderTags();
      cancelScheduledSearch();
      runSearch();
    });
  }

  ui.historyContainer.addEventListener("click", (event) => {
    const target = event.target.closest("button[data-history]");
    if (!target) {
      return;
    }
    const value = target.dataset.history || "";
    ui.searchInput.value = value;
    state.query = value;
    cancelScheduledSearch();
    runSearch();
    if (isMobileViewport()) {
      hideSuggestions();
      setMobileSearchFocused(false);
      ui.searchInput.blur();
      return;
    }
    ui.searchInput.focus();
  });

  ui.clearHistoryBtn.addEventListener("click", () => {
    state.history = [];
    saveHistory();
    renderHistory();
    updateSuggestions();
  });

  if (ui.loadMoreBtn) {
    ui.loadMoreBtn.addEventListener("click", () => {
      loadMoreResults();
    });
  }

  if (ui.catalogApp) {
    ui.catalogApp.addEventListener(
      "touchstart",
      (event) => {
        if (!isMobileViewport() || isCategoryBottomSheetVisible() || swipeState.animating || event.touches.length !== 1) {
          swipeState.tracking = false;
          return;
        }
        const target = event.target instanceof Element ? event.target : null;
        if (!target || shouldIgnoreCategorySwipeStart(target)) {
          swipeState.tracking = false;
          return;
        }
        const touch = event.touches[0];
        const viewportWidth = Math.max(window.innerWidth || 0, 0);
        if (viewportWidth > 0) {
          const fromLeftEdge = touch.clientX <= SWIPE_EDGE_GUARD_PX;
          const fromRightEdge = touch.clientX >= viewportWidth - SWIPE_EDGE_GUARD_PX;
          if (fromLeftEdge || fromRightEdge) {
            swipeState.tracking = false;
            return;
          }
        }
        clearResultsSwipeInlineStyles();
        swipeState.tracking = true;
        swipeState.startX = touch.clientX;
        swipeState.startY = touch.clientY;
        swipeState.startAt = Date.now();
        swipeState.deltaX = 0;
        swipeState.axis = "";
        swipeState.direction = 0;
      },
      { passive: true }
    );

    ui.catalogApp.addEventListener(
      "touchmove",
      (event) => {
        if (!swipeState.tracking || swipeState.animating || !isMobileViewport() || isCategoryBottomSheetVisible() || event.touches.length !== 1) {
          return;
        }
        const touch = event.touches[0];
        const deltaX = touch.clientX - swipeState.startX;
        const deltaY = touch.clientY - swipeState.startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (!swipeState.axis) {
          if (absX < 8 && absY < 8) {
            return;
          }
          swipeState.axis = absX >= absY * 1.05 ? "x" : "y";
        }
        if (swipeState.axis !== "x") {
          return;
        }

        if (event.cancelable) {
          event.preventDefault();
        }
        const direction = deltaX < 0 ? 1 : -1;
        if (!prepareResultsSwipePreview(direction, { offsetX: deltaX })) {
          return;
        }
        swipeState.deltaX = deltaX;
        swipeState.direction = direction;
        setResultsSwipeOffset(deltaX, { immediate: true });
        setResultsSwipePreviewOffset(deltaX, direction, { immediate: true });
      },
      { passive: false }
    );

    ui.catalogApp.addEventListener(
      "touchend",
      (event) => {
        if (!swipeState.tracking || event.changedTouches.length !== 1) {
          swipeState.tracking = false;
          return;
        }
        swipeState.tracking = false;
        if (!isMobileViewport() || isCategoryBottomSheetVisible()) {
          return;
        }
        const elapsed = Date.now() - swipeState.startAt;
        const touch = event.changedTouches[0];
        const deltaX = swipeState.axis === "x" ? swipeState.deltaX : touch.clientX - swipeState.startX;
        const deltaY = touch.clientY - swipeState.startY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const passedThreshold = absX >= 56 && absX >= absY * 1.1 && elapsed <= 900;

        if (!passedThreshold) {
          resetResultsSwipeOffset({ immediate: false });
          window.clearTimeout(swipeState.cleanupTimer);
          swipeState.cleanupTimer = window.setTimeout(() => {
            clearResultsSwipeInlineStyles();
          }, 240);
          return;
        }

        const direction = deltaX < 0 ? 1 : -1;
        if (!prepareResultsSwipePreview(direction, { offsetX: deltaX })) {
          resetResultsSwipeOffset({ immediate: false });
          window.clearTimeout(swipeState.cleanupTimer);
          swipeState.cleanupTimer = window.setTimeout(() => {
            clearResultsSwipeInlineStyles();
          }, 240);
          return;
        }
        swipeState.animating = true;
        swipeState.direction = direction;
        const swipeTravel = getResultsSwipeTravel();
        const currentOutOffset = direction > 0 ? -swipeTravel : swipeTravel;
        const previewCenterOffset = direction > 0 ? -swipeTravel : swipeTravel;
        setResultsSwipeOffset(currentOutOffset, { immediate: false });
        setResultsSwipePreviewOffset(previewCenterOffset, direction, { immediate: false });

        window.clearTimeout(swipeState.cleanupTimer);
        swipeState.cleanupTimer = window.setTimeout(() => {
          switchCategoryBySwipe(direction);
          clearResultsSwipeInlineStyles();
          swipeState.animating = false;
          swipeState.direction = 0;
        }, 240);
      },
      { passive: true }
    );

    ui.catalogApp.addEventListener(
      "touchcancel",
      () => {
        swipeState.tracking = false;
        if (!swipeState.animating) {
          resetResultsSwipeOffset({ immediate: false });
          window.clearTimeout(swipeState.cleanupTimer);
          swipeState.cleanupTimer = window.setTimeout(() => {
            clearResultsSwipeInlineStyles();
            swipeState.direction = 0;
          }, 220);
        }
      },
      { passive: true }
    );
  }

  window.addEventListener(
    "resize",
    () => {
      clearTimeout(state.resizeTimer);
      state.resizeTimer = setTimeout(() => {
        const next = getResultsPageSize();
        if (next !== state.pageSize) {
          state.pageSize = next;
          state.visibleResultCount = Math.min(state.resultRows.length, Math.max(state.visibleResultCount, state.pageSize));
          refreshResultsView();
        }
        updateMobileDropdownSizing();
        applyMobileLayoutState();
        closeDropdowns();
      }, 140);
    },
    { passive: true }
  );

  document.addEventListener("click", (event) => {
    const insideSearch = event.target instanceof Element && event.target.closest(".search-wrap");
    const insideDropdown = event.target instanceof Element && event.target.closest(".lang-shell");
    if (!insideSearch) {
      hideSuggestions();
      setMobileSearchFocused(false);
    }
    if (!insideDropdown) {
      closeDropdowns();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDropdowns();
      closeCategoryBottomSheet();
    }
  });
}

function setupDynamicLoading() {
  if (!ui.resultsSentinel || typeof IntersectionObserver !== "function") {
    return;
  }
  state.observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadMoreResults();
      }
    },
    {
      root: null,
      rootMargin: "280px 0px 280px 0px",
      threshold: 0
    }
  );
  state.observer.observe(ui.resultsSentinel);
}

function getResultsPageSize() {
  if (window.matchMedia("(max-width: 859px)").matches) {
    return 12;
  }
  return 24;
}

async function loadData() {
  const response = await fetch("data.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load data.json: ${response.status}`);
  }

  const rawItems = await response.json();
  if (!Array.isArray(rawItems)) {
    throw new Error("Invalid data.json format: expected an array");
  }
  state.items = rawItems.map(buildSearchItem);
  const allTags = [...new Set(state.items.flatMap((item) => item.tags || []))];
  state.tags = buildVisibleCategoryTags(allTags);
  rebuildSuggestionPool();

  state.fuse = new Fuse(state.items, {
    keys: [
      { name: "_searchBlob", weight: 0.8 },
      { name: "tags", weight: 0.2 }
    ],
    threshold: 0.5,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2
  });
  state.dataReady = true;
}

function buildSearchItem(item) {
  const rawTags = Array.isArray(item.tags) ? item.tags.filter(Boolean) : [];
  const titles = Object.values(item.title || {}).join(" ");
  const links = normalizeLinks(item.links);
  const service = String(item.service || "").trim();
  const access = item.access === "paid" ? "paid" : "free";
  const starsRaw = Number(item.stars);
  const stars = Number.isFinite(starsRaw) && starsRaw > 0 ? Math.round(starsRaw) : access === "paid" ? 10 : 0;
  const accessSearchTokens = access === "paid" ? "paid premium" : "free бесплатно";
  const languages = [...new Set(links.map((link) => link.lang).filter(Boolean))];
  const url = String(item.url || choosePrimaryUrl(links)).trim();
  const poster = normalizePosterValue(item.poster);
  const posterI18n = normalizePosterI18n(item.poster_i18n, poster);
  const base = `${titles} ${item.search || ""} ${rawTags.join(" ")} ${service} ${accessSearchTokens} ${languages.join(" ")} ${url}`.trim();
  const normalized = normalize(base);
  const ruLat = normalize(ruToLat(base));
  const latRu = normalize(latToRu(base));
  return {
    ...item,
    tags: rawTags,
    links,
    service,
    access,
    stars,
    languages,
    url,
    poster,
    poster_i18n: posterI18n,
    _tagsSet: new Set(rawTags),
    _titlesBlob: normalize(titles),
    _searchBlob: `${normalized} ${ruLat} ${latRu}`.trim()
  };
}

function runSearch() {
  if (!state.dataReady || !state.fuse) {
    updateSuggestions();
    return;
  }

  const query = (state.query || "").trim();
  const normalizedQuery = normalize(query);
  const shouldApplyCategoryFilter = query.length === 0;
  const filteredByTags = shouldApplyCategoryFilter ? state.items.filter((item) => tagsMatch(item)) : state.items.slice();
  let rows = [];

  if (!query) {
    rows = filteredByTags.map((item) => ({ item, score: 0.45, coverage: 0 }));
  } else if (normalizedQuery.length < 2) {
    rows = filteredByTags
      .filter((item) => item._searchBlob.includes(normalizedQuery))
      .map((item) => ({ item, score: 0.62, coverage: 0 }));
  } else {
    const variants = getQueryVariants(query);
    const tokens = buildQueryTokens(query);
    const baseTokens = tokenize(normalize(query)).filter(isMeaningfulSearchToken);
    const scoringTokens = baseTokens.length > 0 ? baseTokens : tokens;
    const bestScores = new Map();
    const filteredIds = new Set(filteredByTags.map((item) => item.id));

    for (const variant of variants) {
      const list = state.fuse.search(variant, { limit: 400 });
      for (const hit of list) {
        if (!filteredIds.has(hit.item.id)) {
          continue;
        }
        const previous = bestScores.get(hit.item.id);
        const currentScore = typeof hit.score === "number" ? hit.score : 0.7;
        if (!previous || currentScore < previous.score) {
          bestScores.set(hit.item.id, { score: currentScore });
        }
      }
    }

    for (const item of filteredByTags) {
      const maybeScore = bestScores.get(item.id);
      const tokenHits = countTokenHits(item._searchBlob, scoringTokens);
      const coverage = scoringTokens.length > 0 ? tokenHits / scoringTokens.length : 0;
      const containsVariant = variants.some((variant) => item._searchBlob.includes(variant));
      const exactPhraseMatch = normalizedQuery.length >= 2 && item._searchBlob.includes(normalizedQuery);
      const fullTokenMatch = scoringTokens.length > 0 && tokenHits === scoringTokens.length;
      const minTokenHits = scoringTokens.length >= 4 ? 2 : scoringTokens.length >= 1 ? 1 : 0;
      const hasEnoughTokenHits = minTokenHits > 0 && tokenHits >= minTokenHits;

      if (!maybeScore && !containsVariant && !exactPhraseMatch && !hasEnoughTokenHits) {
        continue;
      }

      if (maybeScore && !containsVariant && !exactPhraseMatch && !hasEnoughTokenHits && maybeScore.score > 0.2) {
        continue;
      }

      const baseScore = maybeScore ? maybeScore.score : 0.68;
      const finalScore = clamp(
        baseScore -
          coverage * 0.24 -
          (containsVariant ? 0.08 : 0) -
          (exactPhraseMatch ? 0.14 : 0) -
          (fullTokenMatch ? 0.12 : 0),
        0,
        1
      );
      rows.push({ item, score: finalScore, coverage });
    }
  }

  rows = sortRows(rows);
  state.resultRows = rows;
  state.sourceResultCount = filteredByTags.length;
  state.visibleResultCount = Math.min(rows.length, state.pageSize);
  refreshResultsView();
}

function sortRows(rows) {
  const language = state.language;
  const titleByLang = (item) => getLocalizedTitle(item, language);
  const copy = [...rows];

  switch (state.sort) {
    case "title_asc":
      copy.sort((a, b) => titleByLang(a.item).localeCompare(titleByLang(b.item), language));
      return copy;
    case "title_desc":
      copy.sort((a, b) => titleByLang(b.item).localeCompare(titleByLang(a.item), language));
      return copy;
    case "year_asc":
      copy.sort((a, b) => (a.item.year || 0) - (b.item.year || 0));
      return copy;
    case "year_desc":
      copy.sort((a, b) => (b.item.year || 0) - (a.item.year || 0));
      return copy;
    case "relevance":
    default:
      copy.sort((a, b) => a.score - b.score || titleByLang(a.item).localeCompare(titleByLang(b.item), language));
      return copy;
  }
}

function refreshResultsView() {
  const query = (state.query || "").trim();
  const visibleRows = state.resultRows.slice(0, state.visibleResultCount);
  renderResults(visibleRows, query);
  renderMeta(state.visibleResultCount, state.resultRows.length, state.sourceResultCount);
  updateLoadMoreButton();
}

function loadMoreResults() {
  if (state.visibleResultCount >= state.resultRows.length) {
    return;
  }
  state.visibleResultCount = Math.min(state.resultRows.length, state.visibleResultCount + state.pageSize);
  refreshResultsView();
}

function updateLoadMoreButton() {
  if (!ui.loadMoreBtn) {
    return;
  }
  const remaining = state.resultRows.length - state.visibleResultCount;
  if (remaining <= 0) {
    ui.loadMoreBtn.hidden = true;
    return;
  }
  const nextPortion = Math.min(remaining, state.pageSize);
  ui.loadMoreBtn.hidden = false;
  ui.loadMoreBtn.textContent = tr("showMore", { count: nextPortion });
}

function buildResultsGridHtml(rows, query) {
  if (rows.length === 0) {
    return `<article class="empty">${escapeHtml(tr("noResults"))}</article>`;
  }

  const highlightTerms = buildHighlightTokens(query);
  const language = state.language;

  return rows
    .map((row) => {
      const item = row.item;
      const title = getLocalizedTitle(item, language);
      const titleHtml = highlightText(title, highlightTerms);
      const serviceRaw = item.service || tr("catalogFallback");
      const serviceLabel = getCategoryLabel(serviceRaw);
      const accessBadge = item.access === "paid" ? `⭐ ${item.stars || 10}` : tr("freeBadge");
      const accessClass = item.access === "paid" ? "paid" : "free";
      const posterPath = resolvePosterForLanguage(item, language);
      const hasPoster = Boolean(posterPath);
      const posterStyle = hasPoster ? "" : `style="background:${posterPalette(item.id)}"`;
      const posterImage = hasPoster
        ? `<img class="poster-image" loading="lazy" draggable="false" src="${escapeHtml(posterPath)}" alt="${escapeHtml(title)}">`
        : "";
      const watchHtml = buildWatchLinks(item);
      const watchRow = watchHtml ? `<div class="watch-row single">${watchHtml}</div>` : "";

      return `
        <article class="card compact-card">
          <div class="poster ${hasPoster ? "has-image" : ""}" ${posterStyle} data-fallback="${escapeHtml(posterPalette(item.id))}">
            ${posterImage}
            <div class="poster-overlay">
              <div class="tag-row">
                <span class="poster-tag service">${escapeHtml(serviceLabel)}</span>
                <span class="poster-tag access ${accessClass}">${escapeHtml(accessBadge)}</span>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h3>${titleHtml}</h3>
            ${watchRow}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderResults(rows, query) {
  if (!ui.resultsGrid) {
    return;
  }
  ui.resultsGrid.innerHTML = buildResultsGridHtml(rows, query);
  wirePosterFallbacks(ui.resultsGrid);
}

function renderMeta(visibleCount, foundCount, sourceCount) {
  const total = state.items.length;
  const query = (state.query || "").trim();
  if (!query) {
    ui.resultsMeta.textContent = tr("metaNoQuery", { visible: visibleCount, found: foundCount, total });
    return;
  }
  ui.resultsMeta.textContent = tr("metaWithQuery", { found: foundCount, visible: visibleCount, source: sourceCount });
}

function isHiddenCategoryTag(tag) {
  const value = normalize(tag);
  if (!value) {
    return true;
  }
  return HIDDEN_CATEGORY_TAGS.some((hidden) => normalize(hidden) === value);
}

function buildVisibleCategoryTags(allTags) {
  const normalizedToLabel = new Map();
  for (const rawTag of allTags || []) {
    const label = String(rawTag || "").trim();
    if (!label) {
      continue;
    }
    const key = normalize(label);
    if (!key || normalizedToLabel.has(key)) {
      continue;
    }
    normalizedToLabel.set(key, label);
  }

  const visible = [];
  for (const preferred of CATEGORY_PRIORITY) {
    const key = normalize(preferred);
    const actual = normalizedToLabel.get(key);
    if (!actual || isHiddenCategoryTag(actual)) {
      continue;
    }
    visible.push(actual);
  }
  return visible;
}

function getDefaultCategoryTag() {
  if (!Array.isArray(state.tags) || state.tags.length === 0) {
    return "";
  }
  const reelShortTag = state.tags.find((tag) => normalize(tag) === normalize("ReelShort"));
  return reelShortTag || state.tags[0] || "";
}

function ensureDefaultCategorySelection() {
  if (state.selectedTags.size > 0) {
    return;
  }
  const defaultTag = getDefaultCategoryTag();
  if (!defaultTag) {
    return;
  }
  state.selectedTags.add(defaultTag);
}

function renderTags() {
  for (const selected of [...state.selectedTags]) {
    if (!state.tags.includes(selected)) {
      state.selectedTags.delete(selected);
    }
  }
  if (state.selectedTags.size > 1) {
    const [firstSelected] = state.selectedTags;
    state.selectedTags.clear();
    if (firstSelected) {
      state.selectedTags.add(firstSelected);
    }
  }

  if (ui.tagsContainer) {
    ui.tagsContainer.innerHTML = state.tags
      .map((tag) => {
        const active = state.selectedTags.has(tag) ? "active" : "";
        return `<button class="chip ${active}" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(
          getCategoryLabel(tag)
        )}</button>`;
      })
      .join("");
  }

  renderHorizontalCategories();
}

function renderHorizontalCategories() {
  if (!ui.catScrollContainer) {
    return;
  }
  ui.catScrollContainer.innerHTML = state.tags
    .map((tag) => {
      const active = state.selectedTags.has(tag) ? "active" : "";
      return `<button class="cat-tab ${active}" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(
        getCategoryLabel(tag)
      )}</button>`;
    })
    .join("");
  window.requestAnimationFrame(() => {
    if (!ui.catScrollContainer) {
      return;
    }
    const activeCategory = ui.catScrollContainer.querySelector(".cat-tab.active");
    if (!activeCategory) {
      updateMobileTopbarOffset();
      return;
    }
    activeCategory.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    updateMobileTopbarOffset();
  });
}

function renderBottomSheetCategories() {
  if (!ui.bottomSheetTags) {
    return;
  }
  ui.bottomSheetTags.innerHTML = state.tags
    .map((tag) => {
      const active = tempSelectedTags.has(tag) ? "active" : "";
      return `<button class="bs-chip ${active}" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(
        getCategoryLabel(tag)
      )}</button>`;
    })
    .join("");
}

function openCategoryBottomSheet() {
  if (!ui.categoryBottomSheet) {
    return;
  }
  ui.categoryBottomSheet.hidden = false;
  void ui.categoryBottomSheet.offsetWidth;
  ui.categoryBottomSheet.classList.add("is-visible");
}

function closeCategoryBottomSheet() {
  if (!ui.categoryBottomSheet || ui.categoryBottomSheet.hidden) {
    return;
  }
  ui.categoryBottomSheet.classList.remove("is-visible");
  window.setTimeout(() => {
    if (ui.categoryBottomSheet && !ui.categoryBottomSheet.classList.contains("is-visible")) {
      ui.categoryBottomSheet.hidden = true;
    }
  }, 280);
}

function renderHistory() {
  if (state.history.length === 0) {
    if (isMobileViewport() && state.mobileSearchFocused) {
      ui.historyContainer.innerHTML = "";
      return;
    }
    ui.historyContainer.innerHTML = `<span class="meta">${escapeHtml(tr("historyEmpty"))}</span>`;
    return;
  }
  ui.historyContainer.innerHTML = state.history
    .map((entry) => `<button class="chip history" type="button" data-history="${escapeHtml(entry)}">${escapeHtml(entry)}</button>`)
    .join("");
}

function rebuildSuggestionPool() {
  const seen = new Set();
  const pool = [];
  const push = (rawValue) => {
    const value = String(rawValue || "").trim();
    if (!value) {
      return;
    }
    const normalized = normalize(value);
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    pool.push({ value, normalized });
  };

  for (const item of state.items) {
    push(getLocalizedTitle(item, state.language));
    push(getLocalizedTitle(item, "en"));
    push(getLocalizedTitle(item, "ru"));
  }

  for (const tag of state.tags) {
    push(tag);
    push(getCategoryLabel(tag));
  }

  state.baseSuggestionPool = pool;
}

function updateSuggestions() {
  if (document.activeElement !== ui.searchInput) {
    hideSuggestions();
    return;
  }

  if (state.suppressSuggestionsUntilInput) {
    hideSuggestions();
    return;
  }

  const query = (state.query || "").trim();
  if (!query) {
    hideSuggestions();
    return;
  }

  const q = normalize(query);
  const historySet = new Set(state.history.map((entry) => normalize(entry)).filter(Boolean));
  const pool = [];
  const poolSeen = new Set();
  const pushCandidate = (rawValue) => {
    const value = String(rawValue || "").trim();
    if (!value) {
      return;
    }
    const normalized = normalize(value);
    if (!normalized || poolSeen.has(normalized)) {
      return;
    }
    poolSeen.add(normalized);
    pool.push({
      value,
      normalized,
      isHistory: historySet.has(normalized)
    });
  };

  for (const entry of state.history) {
    pushCandidate(entry);
  }
  for (const entry of state.baseSuggestionPool) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const value = String(entry.value || "").trim();
    const normalized = String(entry.normalized || "").trim();
    if (!value || !normalized || poolSeen.has(normalized)) {
      continue;
    }
    poolSeen.add(normalized);
    pool.push({
      value,
      normalized,
      isHistory: historySet.has(normalized)
    });
  }

  const ranked = [];
  for (const entry of pool) {
    const index = entry.normalized.indexOf(q);
    if (index < 0) {
      continue;
    }
    const historyBoost = entry.isHistory ? -3 : 0;
    const startsWithBoost = entry.normalized.startsWith(q) ? -2 : 0;
    const score = index + historyBoost + startsWithBoost;
    ranked.push({ value: entry.value, normalized: entry.normalized, score });
  }

  ranked.sort((a, b) => a.score - b.score || a.value.length - b.value.length);
  const deduped = [];
  const seen = new Set();
  for (const row of ranked) {
    const key = row.normalized;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(row.value);
    if (deduped.length >= 8) {
      break;
    }
  }

  state.suggestionItems = deduped;
  state.activeSuggestionIndex = -1;

  if (deduped.length === 0) {
    hideSuggestions();
    return;
  }

  ui.suggestions.innerHTML = deduped
    .map((entry, index) => `<li role="option" data-index="${index}" data-value="${escapeHtml(entry)}">${highlightText(entry, [query])}</li>`)
    .join("");
  ui.suggestions.classList.add("visible");
}

function hideSuggestions() {
  state.activeSuggestionIndex = -1;
  state.suggestionItems = [];
  ui.suggestions.innerHTML = "";
  ui.suggestions.classList.remove("visible");
}

function moveActiveSuggestion(direction) {
  if (state.suggestionItems.length === 0) {
    return;
  }
  state.activeSuggestionIndex += direction;
  if (state.activeSuggestionIndex < 0) {
    state.activeSuggestionIndex = state.suggestionItems.length - 1;
  }
  if (state.activeSuggestionIndex >= state.suggestionItems.length) {
    state.activeSuggestionIndex = 0;
  }

  const nodes = ui.suggestions.querySelectorAll("li");
  nodes.forEach((node, index) => {
    node.classList.toggle("active", index === state.activeSuggestionIndex);
  });
}

function applySuggestion(value) {
  ui.searchInput.value = value;
  state.query = value;
  state.suppressSuggestionsUntilInput = true;
  cancelQueuedHistorySave();
  persistHistory(value);
  cancelScheduledSearch();
  runSearch();
  hideSuggestions();
  if (isMobileViewport()) {
    ui.searchInput.blur();
    setMobileSearchFocused(false);
    return;
  }
  ui.searchInput.focus();
}

function queueHistorySave() {
  cancelQueuedHistorySave();
  state.historyTimer = setTimeout(() => {
    state.historyTimer = null;
    persistHistory(state.query);
  }, 900);
}

function cancelQueuedHistorySave() {
  clearTimeout(state.historyTimer);
  state.historyTimer = null;
}

function persistHistory(rawValue) {
  const value = (rawValue || "").trim();
  if (value.length < 2) {
    return;
  }
  const normalizedValue = normalize(value);
  state.history = [value, ...state.history.filter((entry) => normalize(entry) !== normalizedValue)].slice(0, MAX_HISTORY_ITEMS);
  saveHistory();
  renderHistory();
  updateSuggestions();
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry) => typeof entry === "string" && entry.trim().length > 0).slice(0, MAX_HISTORY_ITEMS);
  } catch (_) {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
}

function tagsMatch(item) {
  if (state.selectedTags.size === 0) {
    return true;
  }
  const itemTags = item._tagsSet instanceof Set ? item._tagsSet : new Set(item.tags || []);
  for (const tag of state.selectedTags) {
    if (!itemTags.has(tag)) {
      return false;
    }
  }
  return true;
}

function getLocalizedTitle(item, language) {
  if (!item.title || typeof item.title !== "object") {
    return `#${item.id}`;
  }
  return item.title[language] || item.title[FALLBACK_LANG] || item.title.en || Object.values(item.title)[0] || `#${item.id}`;
}

function buildHighlightTokens(query) {
  if (!query) {
    return [];
  }
  const terms = new Set();
  const variants = getQueryVariants(query);
  for (const variant of variants) {
    for (const part of variant.split(/\s+/)) {
      if (isHighlightToken(part)) {
        terms.add(part);
      }
    }
  }
  return [...terms].sort((a, b) => b.length - a.length);
}

function isHighlightToken(value) {
  return value.length > 1 || /[^\x00-\x7f]/.test(value);
}

function highlightText(text, terms) {
  const value = text || "";
  const cleanTerms = (terms || []).filter((term) => term && term.trim().length > 0);
  if (cleanTerms.length === 0) {
    return escapeHtml(value);
  }

  const pattern = cleanTerms.map((term) => escapeRegExp(term)).join("|");
  if (!pattern) {
    return escapeHtml(value);
  }

  const regex = new RegExp(`(${pattern})`, "giu");
  const parts = value.split(regex);
  return parts
    .map((part, index) => {
      if (index % 2 === 1) {
        return `<mark>${escapeHtml(part)}</mark>`;
      }
      return escapeHtml(part);
    })
    .join("");
}

function buildQueryTokens(query) {
  const base = tokenize(normalize(query));
  const convertedToLat = tokenize(normalize(ruToLat(query)));
  const convertedToRu = tokenize(normalize(latToRu(query)));
  return [...new Set([...base, ...convertedToLat, ...convertedToRu])].filter(isMeaningfulSearchToken);
}

function tokenize(value) {
  return (value || "")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function isMeaningfulSearchToken(token) {
  const value = String(token || "").trim();
  if (!value) {
    return false;
  }
  if (value.length <= 1) {
    return false;
  }
  return !SEARCH_STOP_WORDS.has(value);
}

function countTokenHits(blob, tokens) {
  if (!tokens.length) {
    return 0;
  }
  let matched = 0;
  for (const token of tokens) {
    if (blob.includes(token)) {
      matched += 1;
    }
  }
  return matched;
}

function tokenCoverage(blob, tokens) {
  if (!tokens.length) {
    return 0;
  }
  return countTokenHits(blob, tokens) / tokens.length;
}

function getQueryVariants(query) {
  const q = normalize(query);
  if (!q) {
    return [];
  }
  const set = new Set([q, normalize(ruToLat(q)), normalize(latToRu(q))]);
  const words = tokenize(q);
  if (words.length > 1) {
    set.add(words.slice().sort().join(" "));
  }
  return [...set].filter(Boolean);
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function posterPalette(id) {
  const palettes = [
    "linear-gradient(140deg, #0f8a6f 0%, #1d5568 55%, #16303f 100%)",
    "linear-gradient(140deg, #f08c42 0%, #bc5f1f 55%, #6f3417 100%)",
    "linear-gradient(140deg, #21608c 0%, #153f5f 60%, #0e2537 100%)",
    "linear-gradient(140deg, #699b2f 0%, #3e6920 55%, #283f1a 100%)",
    "linear-gradient(140deg, #ad4f72 0%, #7d3552 55%, #4d2133 100%)"
  ];
  return palettes[id % palettes.length];
}

function wirePosterFallbacks(container = ui.resultsGrid) {
  if (!container) {
    return;
  }
  const images = container.querySelectorAll(".poster.has-image .poster-image");
  images.forEach((image) => {
    image.setAttribute("draggable", "false");
    image.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
    image.addEventListener(
      "error",
      () => {
        const poster = image.closest(".poster");
        if (!poster) {
          return;
        }
        poster.classList.remove("has-image");
        const fallback = poster.dataset.fallback;
        if (fallback) {
          poster.style.background = fallback;
        }
        image.remove();
      },
      { once: true }
    );
  });
}

function resolvePosterForLanguage(item, language) {
  const lang = String(language || "")
    .trim()
    .toUpperCase();
  const map = normalizePosterI18n(item.poster_i18n, item.poster);
  if (lang && map[lang]) {
    return map[lang];
  }
  const fallback = normalizePosterValue(item.poster);
  if (fallback) {
    return fallback;
  }
  if (map.RU) {
    return map.RU;
  }
  const first = Object.values(map)[0];
  return first || "";
}

function normalizePosterPath(value) {
  const raw = String(value || "").trim().replace(/\\/g, "/");
  if (!raw) {
    return "";
  }
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  if (!raw.includes("/")) {
    return `img/posters/${raw}`;
  }
  let path = raw.replace(/^\.\/+/, "");
  path = path.replace(/^\/+/, "");
  path = path.replace(/^(\.\.\/)+/, "");
  return path;
}

function normalizePosterValue(value) {
  return normalizePosterPath(value);
}

function normalizePosterI18n(value, basePoster) {
  const input = value && typeof value === "object" ? value : {};
  const out = {};
  const base = normalizePosterValue(basePoster);
  for (const [rawLang, rawPath] of Object.entries(input)) {
    const lang = String(rawLang || "")
      .trim()
      .toUpperCase();
    const path = normalizePosterValue(rawPath);
    if (!lang || !path) {
      continue;
    }
    if (base && path === base) {
      continue;
    }
    out[lang] = path;
  }
  return out;
}

function normalizeLinks(rawLinks) {
  if (!Array.isArray(rawLinks)) {
    return [];
  }
  const out = [];
  const seen = new Set();
  for (const link of rawLinks) {
    if (!link || typeof link !== "object") {
      continue;
    }
    const url = String(link.url || "").trim();
    if (!/^https?:\/\//i.test(url)) {
      continue;
    }
    if (seen.has(url)) {
      continue;
    }
    seen.add(url);
    out.push({
      lang: sanitizeLinkLang(link.lang),
      url
    });
  }
  return out;
}

function sanitizeLinkLang(value) {
  const lang = String(value || "")
    .trim()
    .toUpperCase();
  if (!lang) {
    return "ORIG";
  }
  return lang;
}

function choosePrimaryUrl(links) {
  if (!Array.isArray(links) || links.length === 0) {
    return "";
  }
  const ru = links.find((link) => link.lang === "RU");
  if (ru) {
    return ru.url;
  }
  return links[0].url;
}

function buildWatchLinks(item) {
  const links = Array.isArray(item.links) && item.links.length ? item.links : [];
  const url = String(item.url || choosePrimaryUrl(links)).trim();
  if (!url) {
    return "";
  }
  return `<a class="watch-btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(tr("watch"))}</a>`;
}

function getCategoryLabel(tag) {
  const key = normalize(tag);
  const map = CATEGORY_TRANSLATIONS[key];
  if (!map) {
    return tag;
  }
  return map[state.language] || map[FALLBACK_LANG] || tag;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function ruToLat(text) {
  const map = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya"
  };
  return String(text || "")
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("");
}

function latToRu(text) {
  let result = String(text || "").toLowerCase();

  const combos = [
    ["shch", "щ"],
    ["yo", "ё"],
    ["yu", "ю"],
    ["ya", "я"],
    ["zh", "ж"],
    ["kh", "х"],
    ["ts", "ц"],
    ["ch", "ч"],
    ["sh", "ш"]
  ];
  for (const [latin, cyr] of combos) {
    result = result.replaceAll(latin, cyr);
  }

  const map = {
    a: "а",
    b: "б",
    c: "к",
    d: "д",
    e: "е",
    f: "ф",
    g: "г",
    h: "х",
    i: "и",
    j: "й",
    k: "к",
    l: "л",
    m: "м",
    n: "н",
    o: "о",
    p: "п",
    q: "к",
    r: "р",
    s: "с",
    t: "т",
    u: "у",
    v: "в",
    w: "в",
    x: "кс",
    y: "й",
    z: "з"
  };

  return result
    .split("")
    .map((char) => map[char] ?? char)
    .join("");
}

function renderError(error) {
  const message = error instanceof Error ? error.message : String(error);
  ui.resultsGrid.innerHTML = `<article class="empty">${escapeHtml(tr("errorPrefix"))}: ${escapeHtml(message)}</article>`;
}
