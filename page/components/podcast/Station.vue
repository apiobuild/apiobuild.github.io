<template>
  <article :id="station.id" class="pod-station" :class="{ 'is-arrived': arrived }">
    <!-- The platform, in the same frame as the hero's ride: the station's
      name heads it where the hero says THE NINTH. Purely scenery -- the
      name and the poster's text are repeated in the details below, so the
      whole frame is hidden from assistive tech. -->
    <div class="pod-station-stage" aria-hidden="true">
      <PodcastBezel :name="station.station" :tag="`EP ${pad(station.number)}`">
        <div class="pod-station-scene">
          <div class="pod-station-frieze"></div>
          <div class="pod-station-pillar pod-station-pillar-a"></div>
          <div class="pod-station-pillar pod-station-pillar-b"></div>

          <div class="pod-station-poster">
            <div class="pod-station-poster-eyebrow">EP {{ pad(station.number) }}</div>
            <div class="pod-station-poster-rule"></div>
            <div class="pod-station-poster-guest">{{ station.guest }}</div>
            <span v-if="language.badge" class="pod-station-lang" :lang="language.htmlLang">{{ language.label }}</span>
          </div>

          <div class="pod-station-floor"></div>
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
        <p class="pod-eyebrow">
          EP {{ pad(station.number) }}<template v-if="date"> · {{ date }}</template>
          <span v-if="language.badge" class="pod-station-lang" :lang="language.htmlLang">{{ language.label }}</span>
        </p>
        <h2 class="pod-station-title" :lang="language.htmlLang">{{ station.title }}</h2>
      </div>

      <!-- Guest on the left, Listen on the right, sharing one centre line.
        The guest never wraps: when a name is too long to share the row,
        Listen drops to its own line, still on the right. -->
      <div class="pod-station-foot">
        <p v-if="station.guest" class="pod-station-guest">with <span class="pod-mark">{{ station.guest }}</span></p>
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

const pad = (n) => String(n ?? "").padStart(2, "0");

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

/* Portrait first: phones are the main way in. Everything inside the scene
   is sized in cqw (the scene's own width), so one layout scales from a
   phone to the narrower column it gets beside the copy on desktop. */
/* The frame's box: PodcastBezel scales its 488x620 design to fit inside. */
.pod-station-stage {
  width: 100%;
  aspect-ratio: 488 / 620;
}

/* Fills the frame's viewport. Positions are percentages of it and sizes are
   cqw (its width), so the platform is drawn once at the frame's native size
   and scales with it. */
.pod-station-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  container-type: inline-size;
  background-color: #efece5;
  background-image:
    repeating-linear-gradient(0deg, rgba(32, 38, 48, 0.1) 0 1px, transparent 1px 5.5cqw),
    repeating-linear-gradient(90deg, rgba(32, 38, 48, 0.1) 0 1px, transparent 1px 5.5cqw);
}

.pod-station-scene > * {
  position: absolute;
}

.pod-station-frieze {
  left: 0;
  right: 0;
  top: 9%;
  height: 4%;
  background: #2b3340;
}

.pod-station-pillar {
  top: 0;
  width: 4%;
  height: 84%;
  background: #39414e;
}

.pod-station-pillar-a {
  left: 2%;
}
.pod-station-pillar-b {
  right: 2%;
}

.pod-station-floor {
  left: 0;
  right: 0;
  top: 80%;
  bottom: 0;
  background: #5f636b;
  border-top: 2.6cqw solid #e8b33a;
  box-shadow: inset 0 0.8cqw 0 rgba(0, 0, 0, 0.22);
}

/* An ad on the wall that happens to be the episode's. */
.pod-station-poster {
  left: 10%;
  top: 24%;
  width: 38%;
  padding: 3cqw;
  background: #c4470f;
  color: #fff;
  box-shadow: 1.4cqw 1.4cqw 0 #7c2d0a;
  font-size: 3.3cqw;
  line-height: 1.25;
}

.pod-station-poster-eyebrow {
  font-weight: 900;
  letter-spacing: 0.16em;
  color: #ffc694;
}

.pod-station-poster-rule {
  height: 0.5cqw;
  margin: 0.6em 0;
  background: rgba(253, 251, 247, 0.5);
}

.pod-station-poster-guest {
  font-weight: 800;
  font-size: 1.3em;
  letter-spacing: -0.01em;
}

.pod-station-bench {
  left: 10%;
  top: 72%;
  width: 32%;
  height: 2.6%;
  background: #8a5a33;
  box-shadow: 0 1.6cqw 0 #9a663a;
}

/* Feet on the platform just past its yellow edge, the way the hero's riders
   stand. Height is a share of the scene, scaled per character in the config
   so a cat isn't the size of a person. */
.pod-station-character {
  left: 55%;
  bottom: 11%;
  height: calc(56% * var(--pod-character-scale));
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

/* Phone: one station per screen. The frame takes whatever height the bar
   and the copy leave, and the copy is trimmed to fit. --pod-bar-h is the sticky bar's measured height, set
   by the page. */
@media (max-width: 40rem) {
  .pod-station {
    scroll-snap-align: start;
    scroll-margin-top: var(--pod-bar-h, 9.5rem);
    min-height: calc(100svh - var(--pod-bar-h, 9.5rem));
    gap: 0.9rem;
    padding-block: 1rem 1.5rem;
  }
  /* The last platform is only as tall as it needs to be, so whatever ends
     the line (the next stop) follows it instead of a screen further down. */
  .pod-station:last-of-type {
    min-height: 0;
  }
  /* Never taller than the bar and the copy leave; the frame then fits the
     height and centres, rather than pushing the copy off the screen. */
  .pod-station-stage {
    max-height: max(15rem, calc(100svh - var(--pod-bar-h, 9.5rem) - 12.5rem));
  }
  .pod-station-copy {
    gap: 0.35rem;
  }
  .pod-station-title {
    font-size: 1.45rem;
  }
  .pod-station-guest,
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

.pod-station-title {
  font-size: clamp(1.6rem, 3.4vw, 2.3rem);
}

.pod-station-guest {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--pod-text);
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
  margin: 0.5em 0 0;
  font-size: 0.85em;
}

</style>
