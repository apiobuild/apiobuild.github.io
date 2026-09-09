<template>
  <!-- One shape for every prose section on the page -- eyebrow, heading,
    copy, optional CTA. Sections are added and reordered in
    assets/podcast.json, not here. -->
  <section :id="band.id" class="pod-band" :class="{ 'pod-on-lime': lime }">
    <div class="pod-shell pod-split">
      <div class="pod-split-label">
        <p class="pod-eyebrow">{{ band.eyebrow }}</p>
      </div>
      <div class="pod-split-body">
        <h2 class="pod-band-title">{{ band.title }}</h2>
        <p class="pod-lede">{{ band.body }}</p>
        <a
          v-if="band.cta"
          class="pod-btn pod-btn-solid pod-band-cta"
          :href="links[band.cta.link]"
          v-bind="podcastLinkAttrs(links[band.cta.link])"
        >
          {{ band.cta.label }}
        </a>
      </div>
    </div>
  </section>
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
.pod-band-title {
  font-size: clamp(1.9rem, 4vw, 2.9rem);
  max-width: 20ch;
  margin-bottom: 1.25rem;
}

.pod-band-cta {
  margin-top: 2rem;
}
</style>
