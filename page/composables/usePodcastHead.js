import content from "~/assets/podcast.json";
import { PODCAST_LANGS, podcastLangOf, podcastPath } from "./usePodcastLang";

const SITE = "https://apiobuild.com";

// The title and link-preview tags for a podcast page, with the show's card
// as the preview image. `path` is the page's own path: it sets the page's
// language, and the alternate links that tell search engines the English
// and Mandarin pages are the same page in two languages.
export function usePodcastHead({ title, description, path }) {
  const lang = podcastLangOf(path);
  // tagPriority beats app.vue's site-wide head, which registers the same tags
  // as "critical" -- without this a podcast page would share the consulting
  // site's title and description in every link preview.
  useHead(
    {
      title,
      htmlAttrs: { lang: PODCAST_LANGS[lang].htmlLang },
      link: [
        { rel: "canonical", href: SITE + path },
        ...Object.entries(PODCAST_LANGS).map(([code, { htmlLang }]) => ({
          rel: "alternate",
          hreflang: htmlLang,
          href: SITE + podcastPath(path, code)
        })),
        { rel: "alternate", hreflang: "x-default", href: SITE + podcastPath(path, "en") }
      ],
      meta: [
        { property: "og:title", content: title },
        { name: "description", property: "og:description", content: description },
        // Same shape as app.vue's site-wide tag, including the meaningless
        // name="image": differing shapes are separate keys to unhead, which
        // renders both instead of letting this one override.
        { name: "image", property: "og:image", content: content.meta.image },
        // Large: the podcast image is a 1200x630 card, not a square logo.
        { name: "twitter:card", content: "summary_large_image" }
      ]
    },
    { tagPriority: 1 }
  );
}
