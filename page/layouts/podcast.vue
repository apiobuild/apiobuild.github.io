<template>
  <!-- No Appbar and no site Footer on purpose: the show reads as its own
    thing rather than a page of the consulting site. The page supplies its own
    footer (PodcastFooter), carrying the legal links the site footer would have. -->
  <div class="podcast-page">
    <slot />
  </div>
</template>

<script>
export default {
  name: "PodcastLayout"
};
</script>

<style>
@import "~/assets/css/podcast.css";
</style>
