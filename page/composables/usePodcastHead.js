import content from "~/assets/podcast.json";

// The title and link-preview tags for a podcast page, with the show's card
// as the preview image.
export function usePodcastHead({ title, description }) {
  // tagPriority beats app.vue's site-wide head, which registers the same tags
  // as "critical" -- without this a podcast page would share the consulting
  // site's title and description in every link preview.
  useHead(
    {
      title,
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
