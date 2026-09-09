<template>
  <PodcastHero :hero="content.hero" :links="content.links" />
  <PodcastBand v-for="band in content.bands" :key="band.id" :band="band" :links="content.links" />
  <PodcastFooter :links="content.footer" />
</template>

<script setup>
// Every word and link on this page lives in assets/podcast.json -- edit the
// copy, reorder the sections, or point the CTAs somewhere real there, without
// touching a component.
import content from "~/assets/podcast.json";

definePageMeta({ layout: "podcast" });

// tagPriority beats app.vue's site-wide head, which registers the same tags
// as "critical" -- without this the podcast page would share the consulting
// site's title and description in every link preview.
useHead(
  {
    title: content.meta.title,
    meta: [
      { property: "og:title", content: content.meta.title },
      { name: "description", property: "og:description", content: content.meta.description },
      { name: "image", property: "og:image", content: content.meta.image },
      { name: "twitter:card", content: "summary" }
    ]
  },
  { tagPriority: 1 }
);
</script>

<script>
export default {
  name: "Podcast"
};
</script>
