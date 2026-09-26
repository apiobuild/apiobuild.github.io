<template>
  <!-- No Appbar and no site Footer on purpose: the show reads as its own
    thing rather than a page of the consulting site. The page supplies its own
    footer (PodcastFooter), carrying the legal links the site footer would have. -->
  <div class="podcast-page">
    <slot />
    <!-- The language switch, on the pages that have a Mandarin version. Here
      in the layout, not the pages, so it stays on screen while the page
      swipes to the other language underneath it. -->
    <PodcastLangCat v-if="podcastHasZh(route.path)" />
  </div>
</template>

<script setup>
const route = useRoute();
</script>

<script>
export default {
  name: "PodcastLayout"
};
</script>

<style>
@import "~/assets/css/podcast.css";
</style>
