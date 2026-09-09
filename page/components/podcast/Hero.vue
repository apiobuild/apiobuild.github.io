<template>
  <header class="pod-hero">
    <div class="pod-shell pod-hero-inner">
      <p class="pod-eyebrow">{{ hero.eyebrow }}</p>
      <h1 class="pod-hero-title">{{ hero.title }}</h1>
      <p class="pod-lede">{{ hero.body }}</p>
      <div class="pod-hero-actions">
        <a
          class="pod-btn pod-btn-solid"
          :href="links[hero.primaryCta.link]"
          target="_blank"
          rel="noopener"
        >
          {{ hero.primaryCta.label }}
        </a>
        <a
          class="pod-btn pod-btn-ghost"
          :href="links[hero.secondaryCta.link]"
          target="_blank"
          rel="noopener"
        >
          {{ hero.secondaryCta.label }}
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  hero: { type: Object, required: true },
  // The whole links map, since a CTA names its destination by key
  // ("listen", "community") rather than carrying a URL of its own.
  links: { type: Object, required: true }
});
</script>

<script>
export default {
  name: "PodcastHero"
};
</script>

<style scoped>
.pod-hero {
  display: flex;
  align-items: center;
  min-height: 100vh;
  padding-block: var(--pod-band);
  /* A warm wash behind the headline so the hero doesn't read as a flat
     rectangle. */
  background:
    radial-gradient(70rem 40rem at 15% 0%, rgba(168, 70, 26, 0.09), transparent 62%),
    var(--pod-bg);
}

.pod-hero-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.75rem;
}

.pod-hero-title {
  font-size: clamp(2.5rem, 7vw, 4.75rem);
  max-width: 18ch;
}

.pod-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 0.5rem;
}
</style>
