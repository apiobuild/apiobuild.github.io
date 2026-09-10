<template>
  <header class="pod-hero">
    <div class="pod-shell pod-hero-inner">
      <!-- Optional, like the hosts band's heading: the hero reads fine
        without a label when the headline already says who the show is for. -->
      <p v-if="hero.eyebrow" class="pod-eyebrow">{{ hero.eyebrow }}</p>
      <h1 class="pod-hero-title">{{ hero.title }}</h1>
      <p class="pod-lede">{{ hero.body }}</p>

      <!-- The hosts, up front. Lime has no field to fill on a white hero, so
        it rings each face and marks each name instead. -->
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

      <!-- Buttons and platform icons are one group, so the hero's own
        1.75rem gap falls before the pair instead of between them. -->
      <div class="pod-hero-cta">
        <div class="pod-hero-actions">
        <!-- A podcast has no single place to send someone, so when the CTA's
          destination in podcast.json is a list of platforms the button opens
          into them rather than linking anywhere itself. A plain string still
          renders a plain link. -->
        <button
          v-if="platforms"
          type="button"
          class="pod-btn pod-btn-solid"
          :aria-expanded="platformsOpen"
          aria-controls="pod-listen-platforms"
          @click="platformsOpen = !platformsOpen"
        >
          {{ hero.primaryCta.label }}
        </button>
        <a
          v-else
          class="pod-btn pod-btn-solid"
          :href="links[hero.primaryCta.link]"
          v-bind="podcastLinkAttrs(links[hero.primaryCta.link])"
        >
          {{ hero.primaryCta.label }}
        </a>
        <a
          class="pod-btn pod-btn-ghost"
          :href="links[hero.secondaryCta.link]"
          v-bind="podcastLinkAttrs(links[hero.secondaryCta.link])"
        >
          {{ hero.secondaryCta.label }}
        </a>
        </div>

        <!-- Below the actions rather than in place of the button: the button
          stays put and stays the toggle, so nothing the visitor is aiming at
          moves when the row opens. Icon-only, with the platform name as the
          accessible label. -->
        <div v-if="platforms" id="pod-listen-platforms" class="pod-listen-platforms">
          <a
            v-for="(platform, index) in visiblePlatforms"
            :key="platform.name"
            class="pod-listen-platform"
            :style="{ '--pod-stagger': index }"
            :href="platform.href"
            :aria-label="platform.name"
            :title="platform.name"
            v-bind="podcastLinkAttrs(platform.href)"
          >
            <i :class="platform.icon" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  hero: { type: Object, required: true },
  // The whole links map, since a CTA names its destination by key
  // ("listen", "community") rather than carrying a URL of its own.
  links: { type: Object, required: true },
  // The same people the hosts band renders further down, shown here as
  // faces and names only. They stay defined in one place in podcast.json.
  hosts: { type: Array, default: () => [] }
});

const platformsOpen = ref(false);

// Null unless the primary CTA's destination is a list, which is what tells
// the template to render the opener instead of a plain link.
const platforms = computed(() => {
  const target = props.links[props.hero.primaryCta.link];
  return Array.isArray(target) ? target : null;
});

// Only the icons come and go; their container always renders and holds its
// height, so opening the row cannot move the button above it.
const visiblePlatforms = computed(() => (platformsOpen.value ? platforms.value : []));

// Escape closes the row too, so someone who opened it by accident is not
// stuck reaching for a specific small button.
function closeOnEscape(event) {
  if (event.key === "Escape") platformsOpen.value = false;
}

watch(platformsOpen, (open) => {
  if (open) window.addEventListener("keydown", closeOnEscape);
  else window.removeEventListener("keydown", closeOnEscape);
});

onBeforeUnmount(() => window.removeEventListener("keydown", closeOnEscape));
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

.pod-hero-cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.pod-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

/* Holds the icons' height whether or not they are showing, so the button
   above never moves. Matches .pod-listen-platform's height. */
.pod-listen-platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  min-height: 2.75rem;
}

.pod-listen-platform {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  background: var(--pod-accent);
  color: #f4f6ea;
  font-size: 1.15rem;
  transition: background-color 0.2s, transform 0.2s;

  /* Staggered so the row opens out of the button. `backwards` holds the
     start frame through the delay, or later icons flash before their turn. */
  animation: pod-listen-pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
  animation-delay: calc(var(--pod-stagger) * 60ms);
}

.podcast-page a.pod-listen-platform:link,
.podcast-page a.pod-listen-platform:visited {
  color: #f4f6ea;
}

.podcast-page a.pod-listen-platform:hover {
  background: var(--pod-accent-strong);
  color: #f4f6ea;
  transform: translateY(-2px);
}

/* Overshoots and settles, which reads as a pop rather than a fade. */
@keyframes pod-listen-pop {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pod-listen-platform {
    animation: none;
  }
  .podcast-page a.pod-listen-platform:hover {
    transform: none;
  }
}

/* On a phone the two buttons wrap onto separate lines, where hugging their
   own labels left them different widths against a shared left edge -- a
   ragged pair that reads as a mistake. Stacked, they both take the width of
   the longer label, so the pair squares off while staying on the left edge
   the headline and copy sit on. Same breakpoint the hosts band stacks at. */
@media (max-width: 32rem) {
  .pod-hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
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
