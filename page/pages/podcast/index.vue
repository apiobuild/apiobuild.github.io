<template>
  <PodcastHero :hero="content.hero" :links="content.links" :hosts="hosts" />
  <!-- Alternating bands take the lime, starting with the first one under
    the white hero. Keyed on position so reordering podcast.json keeps the
    rhythm, which a per-entry flag would not. -->
  <template v-for="(band, index) in bands" :key="band.id">
    <PodcastHosts v-if="band.type === 'hosts'" :band="band" :lime="index % 2 === 0" />
    <PodcastBand v-else :band="band" :links="content.links" :lime="index % 2 === 0" />
  </template>
  <PodcastFooter :links="content.footer" />
</template>

<script setup>
// Every word and link on this page lives in assets/podcast.json -- edit the
// copy, reorder the sections, or point the CTAs somewhere real there, without
// touching a component. The Mandarin page (/podcast/zh) is this same page with
// assets/podcast.zh.json laid over it (see usePodcastContent).
definePageMeta({
  layout: "podcast",
  alias: ["/podcast/zh"],
  // A fresh page per language, so switching reads the other copy.
  key: (route) => route.path
});

const route = useRoute();
const lang = podcastLangOf(route.path);
const content = podcastContent(lang);

// Vite rewrites asset URLs at build time, so a path arriving as a string from
// JSON is never seen by the bundler and would ship as a dead link. Globbing
// gives every image its built URL, keyed by filename, which is what
// podcast.json stores. team/ is shared with the company page, so the hosts
// reuse its photos rather than keeping a second copy; brand/ holds the marks
// that stand in for a link's icon.
const images = Object.fromEntries(
  Object.entries({
    ...import.meta.glob("../../assets/team/*", { eager: true, import: "default" }),
    ...import.meta.glob("../../assets/brand/*", { eager: true, import: "default" })
  }).map(([path, url]) => [path.split("/").pop(), url])
);

const bands = content.bands.map((band) =>
  band.type === "hosts"
    ? {
        ...band,
        people: band.people.map((person) => ({
          ...person,
          photo: images[person.photo] ?? null,
          links: person.links.map((link) => ({ ...link, image: images[link.image] ?? null }))
        }))
      }
    : band
);

// The hero shows the same people the hosts band does, so it reads them off
// that band rather than a second copy in the JSON.
const hosts = bands.find((band) => band.type === "hosts")?.people ?? [];

usePodcastHead({ title: content.meta.title, description: content.meta.description, path: route.path });
</script>

<script>
export default {
  name: "Podcast"
};
</script>
