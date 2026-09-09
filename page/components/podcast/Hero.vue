<template>
  <header class="pod-hero pod-on-lime">
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
  /* The hero is the page's largest lime field -- flat, no wash. A gradient
     across this much saturated green muddies it rather than adding depth. */
  background: var(--pod-lime);
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
