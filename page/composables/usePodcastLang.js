// The podcast pages come in two languages at two sets of addresses: English
// at /podcast/..., Mandarin at /podcast/zh/.... They are the same pages and
// components; the language is read off the path, so every language has its
// own link to share and for search engines to find.
export const PODCAST_LANGS = {
  en: { prefix: "/podcast", htmlLang: "en", dateLocale: "en-US" },
  // Traditional characters, matching the "zh-Hant" that
  // podcast-episodes.json already gives Mandarin episodes.
  zh: { prefix: "/podcast/zh", htmlLang: "zh-Hant", dateLocale: "zh-TW" }
};

export const podcastLangOf = (path) =>
  path === "/podcast/zh" || path.startsWith("/podcast/zh/") ? "zh" : "en";

// The same page in `lang`: "/podcast/episodes" <-> "/podcast/zh/episodes".
export const podcastPath = (path, lang) =>
  PODCAST_LANGS[lang].prefix + path.replace(/^\/podcast(\/zh)?(?=\/|$)/, "");

export function usePodcastLang() {
  const route = useRoute();
  return computed(() => podcastLangOf(route.path));
}

// ---- The reader's language -------------------------------------------------

// A reader's own choice, remembered so the next visit opens in it.
const STORAGE_KEY = "podcast-lang";

export function readPodcastLangChoice() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function savePodcastLangChoice(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Private mode or blocked storage: switching still works, it just isn't remembered.
  }
}

// Whichever of English or Chinese the browser ranks higher, so a mostly
// English browser that also lists Chinese stays in English.
export function browserPrefersChinese() {
  const ranked = (navigator.languages ?? [navigator.language]).find((l) => /^(en|zh)\b/i.test(l));
  return /^zh\b/i.test(ranked ?? "");
}

// Where a reader landing on an English podcast page should be instead, and
// why: their own earlier choice ("remembered"), or on a first visit a
// browser set to Chinese ("browser"). Null when English is right. Only the
// English pages redirect -- they're the show's default addresses, and a link
// straight to a Mandarin page is taken at its word.
export function podcastDefaultRedirect(path) {
  if (!path.startsWith("/podcast") || podcastLangOf(path) !== "en") return null;
  const saved = readPodcastLangChoice();
  if (saved === "zh") return { path: podcastPath(path, "zh"), method: "remembered" };
  if (saved || !browserPrefersChinese()) return null;
  savePodcastLangChoice("zh");
  return { path: podcastPath(path, "zh"), method: "browser" };
}

// A redirect that happens before the page (and analytics) loads leaves a
// note, so the page it lands on can report it (see LangCat.vue).
const AUTO_KEY = "podcast-lang-auto";
export function notePodcastAutoSwitch(method) {
  try {
    sessionStorage.setItem(AUTO_KEY, method);
  } catch {
    // Without storage the switch still happens, it just isn't reported.
  }
}
export function takePodcastAutoSwitch() {
  try {
    const method = sessionStorage.getItem(AUTO_KEY);
    sessionStorage.removeItem(AUTO_KEY);
    return method;
  } catch {
    return null;
  }
}
