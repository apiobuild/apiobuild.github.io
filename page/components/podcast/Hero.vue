<template>
  <header class="pod-hero">
    <div class="pod-shell pod-hero-inner">
      <p class="pod-eyebrow">{{ hero.eyebrow }}</p>
      <h1 class="pod-hero-title">{{ hero.title }}</h1>
      <p class="pod-lede">{{ hero.body }}</p>

      <!-- The hosts, up front. On a white hero the lime has no field to
        fill, so it does this instead: the ring around each face and the
        mark behind each name. -->
      <div v-if="hosts.length" class="pod-hero-hosts">
        <div class="pod-hero-faces">
          <span v-for="person in hosts" :key="person.name" class="pod-hero-face">
            <img v-if="person.photo" :src="person.photo" alt="" />
            <span v-else class="pod-hero-face-empty" aria-hidden="true">
              {{ person.name.charAt(0) }}
            </span>
          </span>
        </div>
        <p class="pod-hero-hosted">
          Hosted by
          <template v-for="(person, index) in hosts" :key="person.name">
            <span class="pod-mark">{{ person.name }}</span>
            <template v-if="index < hosts.length - 1"> and </template>
          </template>
        </p>
      </div>

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
  links: { type: Object, required: true },
  // The same people the hosts band renders further down, shown here as
  // faces and names only. They stay defined in one place in podcast.json.
  hosts: { type: Array, default: () => [] }
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
  background: var(--pod-bg);
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

.pod-hero-hosts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.9rem;
}

.pod-hero-faces {
  display: flex;
}

.pod-hero-face {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 999px;
  overflow: hidden;
  /* The lime ring, plus a ring of the page behind it, so overlapping faces
     stay separate instead of merging into one shape. */
  box-shadow:
    0 0 0 3px var(--pod-lime),
    0 0 0 6px var(--pod-bg);
}

/* Faces after the first tuck under the one before, which reads as a pair
   rather than a list. */
.pod-hero-face + .pod-hero-face {
  margin-left: -0.75rem;
}

.pod-hero-face img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pod-hero-face-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: var(--pod-bg-raised);
  font-family: var(--pod-display);
  font-size: 1.25rem;
  color: var(--pod-accent);
}

.pod-hero-hosted {
  font-size: 1rem;
  color: var(--pod-text);
}

.pod-mark {
  background: var(--pod-lime);
  padding: 0.1em 0.3em;
  font-weight: 600;
}
</style>
