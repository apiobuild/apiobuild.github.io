<template>
  <PodcastHero :hero="content.hero" :links="content.links" :hosts="hosts" />
  <!-- Every other band is a lime field, so the theme carries down the page
    rather than stopping at the hero. Alternating on position keeps that
    rhythm right when sections are reordered in podcast.json, which a flag
    on each entry would not. -->
  <template v-for="(band, index) in content.bands" :key="band.id">
    <PodcastHosts v-if="band.type === 'hosts'" :band="band" :lime="index % 2 === 1" />
    <PodcastBand v-else :band="band" :links="content.links" :lime="index % 2 === 1" />
  </template>
  <PodcastFooter :links="content.footer" />
</template>

<script setup>
// Every word and link on this page lives in assets/podcast.json -- edit the
// copy, reorder the sections, or point the CTAs somewhere real there, without
// touching a component.
import content from "~/assets/podcast.json";

definePageMeta({ layout: "podcast" });

// The hero shows the same people the hosts band does, so it reads them off
// that band rather than a second copy in the JSON.
const hosts = content.bands.find((band) => band.type === "hosts")?.people ?? [];

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
