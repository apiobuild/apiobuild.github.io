import en from "~/assets/podcast.json";
import zh from "~/assets/podcast.zh.json";
import episodesEn from "~/assets/podcast-episodes.json";
import episodesZh from "~/assets/podcast-episodes.zh.json";
import { podcastHasZh, podcastPath } from "./usePodcastLang";

// Each language's copy is a file with the same shape as the English one,
// holding only what reads differently: text. Links, images, form field names
// and anything else left out fall through to the English file, so adding a
// section means adding it in English and then its translation -- or leaving
// it out, and it stays in English (marked copyLang "en" for screen readers).
function overlay(base, over) {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) return base.map((item, i) => overlay(item, over[i]));
  if (base && typeof base === "object") {
    const out = { ...base };
    for (const key of Object.keys(over)) out[key] = overlay(base[key], over[key]);
    return out;
  }
  return over;
}

// Links to the show's own pages stay in the language being read, where the
// page has one.
const localizeLinks = (links, lang) =>
  Object.fromEntries(
    Object.entries(links).map(([key, href]) => [key, podcastHasZh(href) ? podcastPath(href, lang) : href])
  );

export function podcastContent(lang) {
  if (lang !== "zh") return en;
  const content = overlay(en, zh);
  return {
    ...content,
    links: localizeLinks(content.links, lang),
    bands: content.bands.map((band, i) => (zh.bands?.[i] ? band : { ...band, copyLang: "en" })),
    footerLang: zh.footer ? undefined : "en"
  };
}

// Episodes: the page's labels overlay the same way; stations are matched by
// id rather than position, since the line grows over time.
export function podcastEpisodes(lang) {
  if (lang !== "zh") return episodesEn;
  const { stations: stationsZh = {}, ...labels } = episodesZh;
  return {
    ...overlay(episodesEn, labels),
    stations: episodesEn.stations.map((station) =>
      stationsZh[station.id] ? overlay(station, stationsZh[station.id]) : { ...station, copyLang: "en" }
    )
  };
}
