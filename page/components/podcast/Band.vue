<template>
  <!-- A prose section: copy and an optional CTA. Sections are added and
    reordered in assets/podcast.json, not here. -->
  <PodcastSection :id="band.id" :eyebrow="band.eyebrow" :title="band.title" :lime="lime">
    <p class="pod-lede">{{ band.body }}</p>
    <a
      v-if="band.cta"
      class="pod-btn pod-btn-solid pod-band-cta"
      :href="links[band.cta.link]"
      v-bind="podcastLinkAttrs(links[band.cta.link])"
    >
      {{ band.cta.label }}
    </a>
  </PodcastSection>
</template>

<script setup>
defineProps({
  band: { type: Object, required: true },
  links: { type: Object, required: true },
  lime: { type: Boolean, default: false }
});
</script>

<script>
export default {
  name: "PodcastBand"
};
</script>

<style scoped>
.pod-band-cta {
  margin-top: 2rem;
}
</style>
