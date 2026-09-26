import en from "~/assets/podcast.json";
import zh from "~/assets/podcast.zh.json";
import episodesEn from "~/assets/podcast-episodes.json";
import episodesZh from "~/assets/podcast-episodes.zh.json";
import { podcastPath } from "./usePodcastLang";

// Each language's copy is a file with the same shape as the English one,
// holding only what reads differently: text. Links, images, form field names
// and anything else left out fall through to the English file, so adding a
// section means adding it in English and then its translation.
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

// Links to the show's own pages stay in the language being read.
const localizeLinks = (links, lang) =>
  Object.fromEntries(
    Object.entries(links).map(([key, href]) => [key, href.startsWith("/podcast") ? podcastPath(href, lang) : href])
  );

export function podcastContent(lang) {
  const content = lang === "zh" ? overlay(en, zh) : en;
  return { ...content, links: localizeLinks(content.links, lang) };
}

// Episodes: the page's labels overlay the same way; stations are matched by
// id rather than position, since the line grows over time.
export function podcastEpisodes(lang) {
  if (lang !== "zh") return episodesEn;
  const { stations: stationsZh = {}, ...labels } = episodesZh;
  return {
    ...overlay(episodesEn, labels),
    stations: episodesEn.stations.map((station) => overlay(station, stationsZh[station.id]))
  };
}
