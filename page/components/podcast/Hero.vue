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

      <div class="pod-hero-actions">
        <!-- The platform row is nested with the button that opens it, not
          placed after both buttons. Stacked on a phone that difference is
          the whole interaction: from below the second button the icons read
          as belonging to it, and sit far enough down to fall past the fold
          on a short screen, so the tap looks like it did nothing. -->
        <div
          class="pod-hero-listen"
          :class="{ 'is-open': platformsOpen, 'is-closing': platformsClosing }"
        >
          <!-- A podcast has no single place to send someone, so when the CTA's
            destination in podcast.json is a list of platforms the button opens
            into them rather than linking anywhere itself. A plain string still
            renders a plain link. -->
          <button
            v-if="platforms"
            ref="listenButton"
            type="button"
            class="pod-btn pod-btn-solid pod-listen-toggle"
            :aria-expanded="platformsOpen"
            aria-controls="pod-listen-platforms"
            @click="togglePlatforms"
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

          <!-- Side by side the row opens below the button, which stays put and
            stays the toggle. Stacked, it takes the button's place instead --
            adding a row there costs vertical space a phone may not have, and
            the visitor is looking at that spot anyway. The close button only
            exists for that second case, where the toggle is out of reach. -->
          <div
            v-if="platforms"
            id="pod-listen-platforms"
            class="pod-listen-platforms"
            :style="{ '--pod-count': platforms.length + 1 }"
          >
            <button
              v-if="platformsOpen"
              ref="closeButton"
              type="button"
              class="pod-listen-platform pod-listen-close"
              aria-label="Close"
              title="Close"
              @click="togglePlatforms"
            >
              <i class="fas fa-xmark" aria-hidden="true"></i>
            </button>
            <a
              v-for="(platform, index) in visiblePlatforms"
              :key="platform.name"
              class="pod-listen-platform"
              :style="{ '--pod-stagger': index + 1 }"
              :href="platform.href"
              :aria-label="platform.name"
              :title="platform.name"
              v-bind="podcastLinkAttrs(platform.href)"
            >
              <i :class="platform.icon" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <a
          class="pod-btn pod-btn-ghost"
          :href="links[hero.secondaryCta.link]"
          v-bind="podcastLinkAttrs(links[hero.secondaryCta.link])"
        >
          {{ hero.secondaryCta.label }}
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

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

const listenButton = ref(null);
const closeButton = ref(null);

// True only while the row is animating out. The icons stay mounted through
// it -- unmounting them on the click is what made closing instant while
// opening had a whole animation to itself.
const platformsClosing = ref(false);

// Long enough for the last icon to finish: the exit animation plus the
// delay the final icon waits through. Kept in step with the styles below.
const EXIT_MS = 200 + 45 * 4;

// The one breakpoint where the row takes the button's place, kept in step
// with the media query in this component's styles.
const STACKED = "(max-width: 32rem)";
const isStacked = () => window.matchMedia(STACKED).matches;
const isReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Where the row replaces the button, whichever control just disappeared was
// the one holding focus, so hand it to the one that took its place --
// otherwise a keyboard or screen-reader visitor is dropped back to the top
// of the document mid-interaction.
async function togglePlatforms() {
  // A second click mid-exit would otherwise reopen the row underneath the
  // animation still running over it.
  if (platformsClosing.value) return;

  if (platformsOpen.value) {
    // Hold the row open while it plays out, or the icons would be gone
    // before the animation had anything left to animate.
    if (!isReducedMotion()) {
      platformsClosing.value = true;
      await wait(EXIT_MS);
      platformsClosing.value = false;
    }
    platformsOpen.value = false;
  } else {
    platformsOpen.value = true;
  }

  if (!isStacked()) return;
  await nextTick();
  (platformsOpen.value ? closeButton.value : listenButton.value)?.focus();
}

// Escape closes the row too, so someone who opened it by accident is not
// stuck reaching for a specific small button.
function closeOnEscape(event) {
  if (event.key === "Escape") togglePlatforms();
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

.pod-hero-actions {
  display: flex;
  flex-wrap: wrap;
  /* Top, not the default stretch: the Listen group is taller than the ghost
     button beside it (it carries the platform row), and stretching would
     pull the ghost button down to match. */
  align-items: flex-start;
  gap: 0.85rem;
  margin-top: 0.5rem;
}

/* The Listen button and the platforms it opens, as one column. Each keeps
   its own width: the row of icons is wider than the button, and stretching
   the column's children to match grew the button on open. */
.pod-hero-listen {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
}

/* Out of flow, so the group's box stays exactly the button's whether the row
   is open or not. In flow it sized the group to its own width -- wider than
   the button by the icons it holds -- which pushed the button beside it
   sideways on open, and needed its height reserved to stop the same thing
   happening vertically. */
.pod-listen-platforms {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.6rem;
  /* Out of flow it would otherwise take the button's width and wrap the
     icons onto a second line -- they are wider than the button together. */
  width: max-content;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
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

/* Only the stacked layout puts the row where the button was, so that is the
   only layout needing a way back -- everywhere else the button is still
   above the row, still the toggle. Outlined rather than filled, so it reads
   as the odd one out among the platforms it leads. */
.pod-listen-close {
  display: none;
  --pod-stagger: 0;
  background: transparent;
  border: 1px solid var(--pod-rule);
  color: var(--pod-text);
}

.pod-listen-close:hover {
  border-color: var(--pod-text);
  transform: translateY(-2px);
}

/* Overshoots and settles, which reads as a pop rather than a fade. */
@keyframes pod-listen-pop {
  from {
    opacity: 0;
    transform: scale(0.3);
  }
}

/* Its own keyframes rather than the entry's played in reverse: the entry
   animation has already run on these elements, and swapping only the
   direction leaves the animation-name unchanged, so the browser keeps the
   finished animation instead of starting a new one and nothing moves. */
@keyframes pod-listen-unpop {
  to {
    opacity: 0;
    transform: scale(0.3);
  }
}

/* The row collapses the way it grew, and the stagger runs backwards --
   --pod-stagger counts from the close button outwards, so subtracting it
   from the count sends the far end first and the row zips back toward the
   button. `forwards` holds the icons gone for the rest of the exit, or they
   would snap back to full size and wait there until the row closes. */
.pod-hero-listen.is-closing .pod-listen-platform {
  animation: pod-listen-unpop 200ms cubic-bezier(0.4, 0, 1, 1) forwards;
  animation-delay: calc((var(--pod-count) - var(--pod-stagger)) * 45ms);
}

@media (prefers-reduced-motion: reduce) {
  .pod-listen-platform,
  /* Belt and braces -- the exit is skipped outright in the click handler,
     so this class should never be set under reduced motion. */
  .pod-hero-listen.is-closing .pod-listen-platform {
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

  /* Stacked, the button does fill its column -- that is what squares it off
     against the one below it. Nothing stretches to the icon row here, since
     the two never share the column: one replaces the other. */
  .pod-hero-listen {
    align-items: stretch;
  }

  /* The row takes the button's place instead of opening under it. Opening a
     row here costs vertical space a phone may not have -- below the fold the
     icons never appear, and the tap reads as broken. */
  .pod-hero-listen.is-open .pod-listen-toggle {
    display: none;
  }

  .pod-listen-close {
    display: inline-flex;
  }

  /* Closed, the row leaves the layout entirely: reserved height would show
     as a permanent gap between the two buttons, and even a zero-height box
     still leaves the column's gap behind it. Open, it stands exactly as tall
     as the button it replaced, so the button below it never moves. */
  .pod-hero-listen:not(.is-open) .pod-listen-platforms {
    display: none;
  }

  /* Back in flow: here the row is not floating under the button, it is
     standing in the button's place, so it has to occupy the column. */
  .pod-listen-platforms {
    position: static;
    margin-top: 0;
    width: auto;
    /* Tighter than elsewhere so the row stays inside the column the buttons
       set. Wider than that and the row drives the column instead, taking the
       button below it along -- the close button and three platforms come to
       204.8px at the standard gap, against 203px of column on a 375px
       screen. This keeps five of them inside a 320px screen. */
    gap: 0.5rem;
    align-items: center;
  }

  .pod-hero-listen.is-open .pod-listen-platforms {
    min-height: 3.5rem;
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
