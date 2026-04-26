"use strict";

const LANGS = ["ru", "en", "ua", "kz", "zh", "ko", "ro", "de", "cz", "bg"];
const FALLBACK_LANG = "ru";
const HISTORY_KEY = "multilingual_catalog_history_v1";
const MAX_HISTORY_ITEMS = 10;
const SEARCH_INPUT_DEBOUNCE_MS = 90;
const CATEGORY_PRIORITY = [
  "ReelShort",
  "DramaWave",
  "ShortMax",
  "StardustTV",
  "Полнометражный фильм",
  "DramaPops",
  "My Drama",
  "Платные",
  "Аниме"
];
const HIDDEN_CATEGORY_TAGS = ["бесплатно", "платно", "русские субтитры"];
const SORT_OPTION_KEYS = ["relevance", "title_asc", "title_desc", "year_desc", "year_asc"];
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
  brandLogo: document.getElementById("brandLogo"),
  brandTitle: document.querySelector(".brand-title"),
  headerShell: document.querySelector(".header-shell"),
  brandLink: document.querySelector(".brand-inline"),
  searchInput: document.getElementById("searchInput"),
  searchLabel: document.querySelector(".search-label"),
  suggestions: document.getElementById("suggestions"),
  joinBtn: document.querySelector(".join-btn"),
  joinLabel: document.querySelector(".join-label"),
  languageSelectButton: document.getElementById("languageSelectButton"),
  languageMenuDesktop: document.getElementById("languageMenuDesktop"),
  languageSelect: document.getElementById("languageSelect"),
  desktopLangShell: document.querySelector(".desktop-lang"),
  mobileSubnav: document.querySelector(".mobile-subnav"),
  mobileHomeTab: document.querySelector(".mobile-subnav .mobile-tab:nth-child(1)"),
  mobileCategoriesTab: document.querySelector(".mobile-subnav .mobile-tab:nth-child(2)"),
  languageSelectMobileButton: document.getElementById("languageSelectMobileButton"),
  languageMenuMobile: document.getElementById("languageMenuMobile"),
  languageSelectMobile: document.getElementById("languageSelectMobile"),
  mobileLangShell: document.querySelector(".mobile-lang"),
  sortSelectButton: document.getElementById("sortSelectButton"),
  sortMenu: document.getElementById("sortMenu"),
  sortSelect: document.getElementById("sortSelect"),
  sortLabel: document.querySelector('label[for="sortSelect"]'),
  sortShell: document.querySelector(".sort-shell"),
  sidebarColumn: document.querySelector(".sidebar-column"),
  categoriesTitle: document.querySelector("#genresSection .section-head h2"),
  tagsContainer: document.getElementById("tagsContainer"),
  clearTagsBtn: document.getElementById("clearTagsBtn"),
  controls: document.querySelector(".controls"),
  historyBlock: document.querySelector(".history-block"),
  historyTitle: document.querySelector(".history-block .section-head h2"),
  historyContainer: document.getElementById("historyContainer"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  resultsTitle: document.getElementById("resultsTitle"),
  resultsGrid: document.getElementById("resultsGrid"),
  resultsMeta: document.getElementById("resultsMeta"),
  loadMoreBtn: document.getElementById("loadMoreBtn"),
  resultsSentinel: document.getElementById("resultsSentinel")
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
  mobileView: "home",
  mobileSearchFocused: false
};

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
  setupDynamicLoading();
  renderHistory();
  await loadData();
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

  setAttr(ui.desktopLangShell, "aria-label", tr("desktopLangAria"));
  setAttr(ui.languageSelectButton, "aria-label", tr("languageTriggerAria"));
  setAttr(ui.languageMenuDesktop, "aria-label", tr("languageMenuAria"));

  setAttr(ui.mobileSubnav, "aria-label", tr("mobileNavAria"));
  setTextContent(ui.mobileHomeTab, tr("mobileHomeTab"));
  setTextContent(ui.mobileCategoriesTab, tr("mobileCategoriesTab"));
  setAttr(ui.mobileLangShell, "aria-label", tr("mobileLangAria"));
  setAttr(ui.languageSelectMobileButton, "aria-label", tr("mobileLanguageTriggerAria"));
  setAttr(ui.languageMenuMobile, "aria-label", tr("mobileLanguageMenuAria"));

  setAttr(ui.sidebarColumn, "aria-label", tr("sidebarAria"));
  setAttr(document.getElementById("genresSection"), "aria-label", tr("tagsSectionAria"));
  setTextContent(ui.categoriesTitle, tr("categoriesTitle"));
  setTextContent(ui.clearTagsBtn, tr("clearTags"));
  setAttr(ui.controls, "aria-label", tr("controlsAria"));
  setTextContent(ui.sortLabel, tr("sortLabel"));
  setAttr(ui.sortShell, "aria-label", tr("sortShellAria"));
  setAttr(ui.sortSelectButton, "aria-label", tr("sortTriggerAria"));
  setAttr(ui.sortMenu, "aria-label", tr("sortMenuAria"));

  setAttr(ui.historyBlock, "aria-label", tr("historyAria"));
  setTextContent(ui.historyTitle, tr("historyTitle"));
  setTextContent(ui.clearHistoryBtn, tr("clearHistory"));
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
  const view = state.mobileView === "categories" ? "categories" : "home";

  root.classList.toggle("is-mobile-home", mobile && view === "home");
  root.classList.toggle("is-mobile-categories", mobile && view === "categories");
  root.classList.toggle("is-mobile-searching", mobile && state.mobileSearchFocused);

  if (ui.mobileHomeTab) {
    ui.mobileHomeTab.classList.toggle("is-active", view === "home");
    ui.mobileHomeTab.setAttribute("aria-current", view === "home" ? "page" : "false");
  }
  if (ui.mobileCategoriesTab) {
    ui.mobileCategoriesTab.classList.toggle("is-active", view === "categories");
    ui.mobileCategoriesTab.setAttribute("aria-current", view === "categories" ? "page" : "false");
  }
}

function setMobileView(nextView) {
  state.mobileView = nextView === "categories" ? "categories" : "home";
  applyMobileLayoutState();
}

function setMobileSearchFocused(isFocused) {
  state.mobileSearchFocused = Boolean(isFocused);
  applyMobileLayoutState();
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

  ui.searchInput.addEventListener("input", () => {
    state.query = ui.searchInput.value;
    scheduleSearch();
    updateSuggestions();
    queueHistorySave();
  });

  ui.searchInput.addEventListener("focus", () => {
    updateSuggestions();
    setMobileSearchFocused(true);
    if (isMobileViewport() && state.mobileView !== "home") {
      setMobileView("home");
    }
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
      persistHistory(state.query);
      cancelScheduledSearch();
      runSearch();
      hideSuggestions();
      return;
    }
    if (event.key === "Escape") {
      hideSuggestions();
    }
  });

  ui.suggestions.addEventListener("mousedown", (event) => {
    const target = event.target.closest("li[data-value]");
    if (!target) {
      return;
    }
    event.preventDefault();
    applySuggestion(target.dataset.value || "");
  });

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

  if (ui.mobileHomeTab) {
    ui.mobileHomeTab.addEventListener("click", (event) => {
      event.preventDefault();
      setMobileView("home");
    });
  }

  if (ui.mobileCategoriesTab) {
    ui.mobileCategoriesTab.addEventListener("click", (event) => {
      event.preventDefault();
      setMobileView("categories");
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
    if (state.selectedTags.has(tag)) {
      state.selectedTags.delete(tag);
    } else {
      state.selectedTags.add(tag);
    }
    renderTags();
    cancelScheduledSearch();
    runSearch();
  });

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
  const filteredByTags = state.items.filter((item) => tagsMatch(item));
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
      const coverage = tokenCoverage(item._searchBlob, tokens);
      const containsVariant = variants.some((variant) => item._searchBlob.includes(variant));

      if (!maybeScore && !containsVariant && coverage === 0) {
        continue;
      }

      const baseScore = maybeScore ? maybeScore.score : 0.68;
      const finalScore = clamp(baseScore - coverage * 0.22 - (containsVariant ? 0.08 : 0), 0, 1);
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

function renderResults(rows, query) {
  if (rows.length === 0) {
    ui.resultsGrid.innerHTML = `<article class="empty">${escapeHtml(tr("noResults"))}</article>`;
    return;
  }

  const highlightTerms = buildHighlightTokens(query);
  const language = state.language;

  ui.resultsGrid.innerHTML = rows
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
        ? `<img class="poster-image" loading="lazy" src="${escapeHtml(posterPath)}" alt="${escapeHtml(title)}">`
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

  wirePosterFallbacks();
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
  const used = new Set();

  for (const preferred of CATEGORY_PRIORITY) {
    const key = normalize(preferred);
    const actual = normalizedToLabel.get(key);
    if (!actual || isHiddenCategoryTag(actual)) {
      continue;
    }
    visible.push(actual);
    used.add(key);
  }

  const rest = [...normalizedToLabel.entries()]
    .filter(([key, label]) => !used.has(key) && !isHiddenCategoryTag(label))
    .map(([, label]) => label)
    .sort((a, b) => a.localeCompare(b, "ru"));

  return [...visible, ...rest];
}

function renderTags() {
  for (const selected of [...state.selectedTags]) {
    if (!state.tags.includes(selected)) {
      state.selectedTags.delete(selected);
    }
  }

  ui.tagsContainer.innerHTML = state.tags
    .map((tag) => {
      const active = state.selectedTags.has(tag) ? "active" : "";
      return `<button class="chip ${active}" type="button" data-tag="${escapeHtml(tag)}">${escapeHtml(
        getCategoryLabel(tag)
      )}</button>`;
    })
    .join("");
}

function renderHistory() {
  if (state.history.length === 0) {
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
  persistHistory(value);
  cancelScheduledSearch();
  runSearch();
  hideSuggestions();
  ui.searchInput.focus();
}

function queueHistorySave() {
  clearTimeout(state.historyTimer);
  state.historyTimer = setTimeout(() => {
    persistHistory(state.query);
  }, 900);
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
  return [...new Set([...base, ...convertedToLat, ...convertedToRu])];
}

function tokenize(value) {
  return (value || "")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function tokenCoverage(blob, tokens) {
  if (!tokens.length) {
    return 0;
  }
  let matched = 0;
  for (const token of tokens) {
    if (token.length <= 1 && !/[^\x00-\x7f]/.test(token)) {
      continue;
    }
    if (blob.includes(token)) {
      matched += 1;
    }
  }
  return matched / tokens.length;
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

function wirePosterFallbacks() {
  const images = ui.resultsGrid.querySelectorAll(".poster.has-image .poster-image");
  images.forEach((image) => {
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
