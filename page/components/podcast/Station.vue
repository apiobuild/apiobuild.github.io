<template>
  <article :id="station.id" class="pod-station" :class="{ 'is-arrived': arrived }">
    <!-- The platform, in the same frame as the hero's ride: the episode's
      title heads it where the hero says THE NINTH, over the station, and
      the card on the wall says who it's by. It carries the title and guest
      for sighted readers, so the copy below doesn't repeat them; the title
      is also in the copy for screen readers, which skip the frame. -->
    <div class="pod-station-stage" aria-hidden="true">
      <PodcastBezel :name="station.title" :tag="station.station">
        <div class="pod-station-scene">
          <div class="pod-station-frieze"></div>
          <div class="pod-station-pillar pod-station-pillar-a"></div>
          <div class="pod-station-pillar pod-station-pillar-b"></div>

          <div class="pod-station-floor"></div>

          <div class="pod-station-poster">
            <template v-if="station.guest">
              <div class="pod-station-poster-eyebrow">{{ station.guest }}</div>
              <div class="pod-station-poster-rule"></div>
            </template>
            <div class="pod-station-poster-title">{{ station.title }}</div>
            <span v-if="language.badge" class="pod-station-lang" :lang="language.htmlLang">{{ language.label }}</span>
          </div>

          <div class="pod-station-bench"></div>

          <img
            v-if="station.character"
            class="pod-station-character"
            :src="station.character"
            :style="{ '--pod-character-scale': station.characterScale ?? 1 }"
            alt=""
            draggable="false"
          />
        </div>
      </PodcastBezel>
    </div>

    <div class="pod-station-details">
      <div class="pod-station-copy">
        <h2 class="pod-station-title" :lang="language.htmlLang">
          {{ station.title }}<template v-if="station.guest">, with {{ station.guest }}</template>
        </h2>
        <p v-if="date || language.badge" class="pod-eyebrow">
          {{ date }}
          <span v-if="language.badge" class="pod-station-lang" :lang="language.htmlLang">{{ language.label }}</span>
        </p>
        <p v-if="station.headline" class="pod-station-headline" :lang="language.htmlLang">
          {{ station.headline }}
        </p>
        <p v-if="station.description" class="pod-station-description" :lang="language.htmlLang">
          {{ station.description }}
        </p>
      </div>

      <!-- Listen, at the bottom right. -->
      <div class="pod-station-foot">
        <a v-if="live" class="pod-station-listen" :href="station.spotify" target="_blank" rel="noopener">
          <i class="fas fa-play" aria-hidden="true"></i>
          {{ labels.listen }}
        </a>
        <span v-else class="pod-station-listen pod-station-soon">{{ labels.comingSoon }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";
import { formatAirDate } from "~/utils/airDate";

const props = defineProps({
  // One entry of podcast-episodes.json's "stations", with `character`
  // already resolved to a built URL by the page.
  station: { type: Object, required: true },
  labels: { type: Object, required: true },
  // This station's entry from podcast-episodes.json's "languages", resolved
  // by the page; `badge` is false for the show's default language.
  language: { type: Object, required: true },
  // Set once the station first scrolls into view, so the character steps
  // onto the platform as it arrives rather than all of them at page load.
  arrived: { type: Boolean, default: false }
});

// "#" or a missing link is an episode that isn't out yet.
const live = computed(() => !!props.station.spotify && props.station.spotify !== "#");

// Dates are stored as plain YYYY-MM-DD; read as UTC so a visitor west of
// Greenwich doesn't see the day before.
const date = computed(() => formatAirDate(props.station.date, { month: "short", day: "numeric", year: "numeric" }));
</script>

<script>
export default {
  name: "PodcastStation"
};
</script>

<style scoped>
.pod-station {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  /* Clears the sticky bar when a jump lands on this station. */
  scroll-margin-top: 6rem;
}

/* The frame's box: PodcastBezel scales its 488x620 design to fit inside.
   Never taller than the screen leaves once the sticky bar and the copy
   under it are counted, at any width -- the frame then fits the height and
   centres, rather than filling a wide column and running off the screen.
   --pod-bar-h is the bar's measured height, set by the page. */
.pod-station-stage {
  width: 100%;
  aspect-ratio: 488 / 620;
  max-height: max(15rem, calc(100svh - var(--pod-bar-h, 4.5rem) - 15.75rem));
}

/* Fills the frame's viewport, which is 460x499 at the frame's native size.
   Drawn in the same pixels as the hero's platforms (NinthTrain.vue) -- the
   tiles, the navy band at 132, the floor and its yellow edge at 360, the
   pillars, the bench and the dark card -- so a station reads as one more
   stop on the same ride. PodcastBezel scales the whole thing. */
.pod-station-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: #efece5;
  background-image:
    repeating-linear-gradient(0deg, rgba(32, 38, 48, 0.1) 0 1px, transparent 1px 22px),
    repeating-linear-gradient(90deg, rgba(32, 38, 48, 0.1) 0 1px, transparent 1px 22px);
}

.pod-station-scene > * {
  position: absolute;
}

.pod-station-frieze {
  left: 0;
  right: 0;
  top: 132px;
  height: 26px;
  background: #2b3340;
}

.pod-station-pillar {
  top: 0;
  width: 22px;
  height: 400px;
  background: #39414e;
}

.pod-station-pillar-a {
  left: 36px;
}
.pod-station-pillar-b {
  right: 36px;
}

.pod-station-floor {
  left: 0;
  right: 0;
  top: 360px;
  bottom: 0;
  background: #5f636b;
  border-top: 15px solid #e8b33a;
  box-shadow: inset 0 3px 0 rgba(0, 0, 0, 0.22);
}

/* The hero's dark card, with the same skewed edges standing in for depth. */
.pod-station-poster {
  left: 78px;
  top: 96px;
  width: 196px;
  box-sizing: border-box;
  padding: 16px 18px;
  background: #0c0f16;
  color: #fdfbf7;
}

.pod-station-poster::before,
.pod-station-poster::after {
  content: "";
  position: absolute;
}

.pod-station-poster::before {
  left: 0;
  top: 100%;
  width: 100%;
  height: 9px;
  background: #2a2f36;
  transform: skewX(45deg);
  transform-origin: top left;
}

.pod-station-poster::after {
  left: 100%;
  top: 0;
  width: 9px;
  height: 100%;
  background: #1a1e24;
  transform: skewY(45deg);
  transform-origin: left top;
}

.pod-station-poster-eyebrow {
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: #ffc694;
}

.pod-station-poster-rule {
  height: 2px;
  margin: 13px 0;
  background: rgba(253, 251, 247, 0.5);
}

.pod-station-poster-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Two slats and two legs, as on the hero's platforms. */
.pod-station-bench {
  left: 78px;
  top: 396px;
  width: 148px;
  height: 12px;
  background: #8a5a33;
  box-shadow: 0 16px 0 #9a663a;
}

.pod-station-bench::before,
.pod-station-bench::after {
  content: "";
  position: absolute;
  top: 28px;
  width: 8px;
  height: 26px;
  background: #3a4350;
}

.pod-station-bench::before {
  left: 10px;
}

.pod-station-bench::after {
  right: 10px;
}

/* Feet on the platform where the hero's riders stand (455 down), and
   bigger than they are there: the guest is the point of this platform.
   Scaled per character in the config so a cat isn't the size of a person. */
.pod-station-character {
  left: 284px;
  bottom: 44px;
  height: calc(265px * var(--pod-character-scale));
  width: auto;
  pointer-events: none;
  user-select: none;
  opacity: 0;
  transform: translateY(10%);
  transition:
    opacity 0.5s ease-out,
    transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pod-station.is-arrived .pod-station-character {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .pod-station-character {
    transition: none;
  }
}

/* Desktop: the portrait platform sits beside its copy instead of above it. */
@media (min-width: 60.01rem) {
  .pod-station {
    display: grid;
    grid-template-columns: minmax(0, 20rem) minmax(0, 1fr);
    align-items: center;
    gap: 2.5rem;
  }
}

/* One column (phones and tablets): one station per screen. The frame takes
   whatever height the bar and the copy leave (see .pod-station-stage), the
   copy is trimmed to fit, and scrolling settles on a station at a time. */
@media (max-width: 60rem) {
  .pod-station {
    scroll-snap-align: start;
    scroll-margin-top: var(--pod-bar-h, 9.5rem);
    gap: 0.9rem;
    padding-block: 1rem 1.5rem;
  }
  .pod-station-copy {
    gap: 0.35rem;
  }
  .pod-station-headline {
    font-size: 1.45rem;
  }
  /* Three lines at most, so a station still fits one screen. */
  .pod-station-description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 0.9rem;
    line-height: 1.45;
  }
  .pod-station-listen {
    font-size: 0.95rem;
  }
  .pod-station-listen {
    padding: 0.6rem 1.1rem 0.6rem 0.9rem;
  }
}

.pod-station-details {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.pod-station-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.pod-station-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* The frame says it; this is for screen readers. The visible line under
   the frame is the optional headline. */
.pod-station-title {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.pod-station-headline {
  font-family: var(--pod-display);
  font-weight: 800;
  font-size: clamp(1.6rem, 3.4vw, 2.3rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.pod-station-description {
  color: var(--pod-text-muted);
  font-size: 1rem;
  line-height: 1.5;
  max-width: 36rem;
}

.pod-station-listen {
  flex-shrink: 0;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.3rem 0.65rem 1.05rem;
  border-radius: 999px;
  background: var(--pod-accent);
  font-weight: 800;
  font-size: 1rem;
  line-height: 1.2;
  transition: background-color 0.2s;
}

.podcast-page a.pod-station-listen:link,
.podcast-page a.pod-station-listen:visited {
  color: #fff;
}

.podcast-page a.pod-station-listen:hover {
  background: var(--pod-accent-strong);
  color: #fff;
}

.pod-station-listen .fa-play {
  font-size: 0.85em;
}

.pod-station-soon {
  border: 2px dashed var(--pod-rule);
  background: transparent;
  color: var(--pod-text-muted);
}

.pod-station-lang {
  display: inline-flex;
  margin-left: 0.5em;
  padding: 0.1em 0.55em;
  border: 1px solid currentColor;
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: none;
}

.pod-station-poster .pod-station-lang {
  margin: 10px 0 0;
  font-size: 11px;
}

</style>
