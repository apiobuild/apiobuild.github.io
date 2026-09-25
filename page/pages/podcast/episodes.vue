<template>
  <div class="pod-episodes">
    <!-- Sticky, so the way back and the station finder are always in reach
      however far down the line someone has ridden. -->
    <header ref="bar" class="pod-episodes-bar">
      <div class="pod-shell pod-episodes-bar-inner">
        <NuxtLink class="pod-episodes-back" to="/podcast">
          <i class="fas fa-arrow-left" aria-hidden="true"></i>
          <span class="pod-episodes-bullet" aria-hidden="true">9</span>
          <span>{{ showTitle }}</span>
        </NuxtLink>

        <div class="pod-episodes-search" @keydown="onSearchKey">
          <i class="fas fa-magnifying-glass" aria-hidden="true"></i>
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            role="combobox"
            :placeholder="page.searchPlaceholder"
            :aria-label="page.searchPlaceholder"
            aria-controls="pod-episodes-results"
            :aria-expanded="showResults"
            :aria-activedescendant="showResults && results[highlight] ? `pod-result-${results[highlight].id}` : undefined"
            autocomplete="off"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <ul v-if="showResults" id="pod-episodes-results" class="pod-episodes-results" role="listbox">
            <li
              v-for="(station, index) in results"
              :id="`pod-result-${station.id}`"
              :key="station.id"
              role="option"
              :aria-selected="index === highlight"
              :class="{ 'is-highlighted': index === highlight }"
              @mousedown.prevent="goTo(station.id)"
              @mouseenter="highlight = index"
            >
              <span class="pod-episodes-result-station">{{ station.station }}</span>
              <span class="pod-episodes-result-meta">{{ station.title }}</span>
            </li>
            <li v-if="!results.length" class="pod-episodes-result-empty" role="option" aria-disabled="true">
              No station by that name yet.
            </li>
          </ul>
        </div>
      </div>

      <!-- Phones and tablets have no line map, so the next stop rides in the sticky bar. -->
      <p v-if="next" class="pod-shell pod-episodes-next-hint">
        <span class="pod-episodes-next-hint-name" :lang="next.language.htmlLang">{{ next.station }}</span>
        <span class="pod-episodes-next-hint-line" aria-hidden="true">
          <span class="pod-episodes-next-hint-track"></span>
          <span class="pod-episodes-stop"></span>
        </span>
      </p>
    </header>

    <!-- For screen readers; the platforms say what the page is. -->
    <h1 class="pod-episodes-title">{{ page.title }}</h1>

    <div class="pod-shell pod-episodes-body">
      <!-- The line map: every station as a stop on one line, the one in view
        lit. Doubles as the table of contents. -->
      <nav class="pod-episodes-line" :aria-label="page.title">
        <ol>
          <li
            v-for="station in stations"
            :key="station.id"
            :class="{ 'is-current': station.id === current }"
          >
            <a :href="`#${station.id}`" :aria-current="station.id === current ? 'location' : undefined" @click.prevent="goTo(station.id)">
              <span class="pod-episodes-stop" aria-hidden="true"></span>
              <span class="pod-episodes-stop-name">
                {{ station.station }}
                <span v-if="station.language.badge" class="pod-episodes-stop-lang" :lang="station.language.htmlLang">{{ station.language.label }}</span>
              </span>
              <span class="pod-episodes-stop-ep">{{ station.title }}</span>
            </a>
          </li>
        </ol>

        <!-- The coming-next episode has no platform yet, so it lives only
          here: an unfilled stop at the end of the line. -->
        <div v-if="next" class="pod-episodes-next">
          <div class="pod-episodes-next-stop">
            <span class="pod-episodes-stop" aria-hidden="true"></span>
            <span class="pod-episodes-stop-name">
              {{ next.station }}
              <span v-if="next.language.badge" class="pod-episodes-stop-lang" :lang="next.language.htmlLang">{{ next.language.label }}</span>
            </span>
            <span class="pod-episodes-stop-ep">{{ page.nextStopLabel }}</span>
          </div>
        </div>
      </nav>

      <main class="pod-episodes-stations">
        <PodcastStation
          v-for="station in stations"
          :key="station.id"
          :ref="(el) => (stationEls[station.id] = el?.$el)"
          :station="station"
          :labels="labels"
          :language="station.language"
          :arrived="arrived.has(station.id)"
        />
      </main>
    </div>

    <PodcastFooter :links="content.footer" />
  </div>
</template>

<script setup>
// Every station lives in assets/podcast-episodes.json: add one there with a
// Spotify link and a character image and it joins the line. Character images
// go in assets/episodes/ (or reuse one from assets/ninth-hero/) and are named
// by filename in the JSON.
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import content from "~/assets/podcast.json";
import page from "~/assets/podcast-episodes.json";

definePageMeta({ layout: "podcast" });

// Same reason as podcast/index.vue: a path arriving as a string from JSON is
// never seen by the bundler, so glob the folders and look up by filename.
const images = Object.fromEntries(
  Object.entries({
    ...import.meta.glob("../../assets/ninth-hero/*", { eager: true, import: "default" }),
    ...import.meta.glob("../../assets/episodes/*", { eager: true, import: "default" })
  }).map(([path, url]) => [path.split("/").pop(), url])
);

// An episode names its language by code ("zh"); leaving it out means the
// show's default. Only a non-default language earns a badge.
const resolveLanguage = (code = page.defaultLanguage) => ({
  code,
  ...page.languages[code],
  badge: code !== page.defaultLanguage
});

const allStations = page.stations.map((station) => ({
  ...station,
  character: images[station.character] ?? null,
  language: resolveLanguage(station.language)
}));

// "next": true marks the episode that's coming but not out. It gets no
// platform, only the unfilled stop at the end of the line map.
const stations = allStations.filter((s) => !s.next);
const next = allStations.find((s) => s.next);

const showTitle = content.hero.title;
const labels = { listen: page.listenLabel, comingSoon: page.comingSoonLabel };

// ---- Where the rider is --------------------------------------------------

const current = ref(stations[0]?.id);
// Stations whose character has stepped on; never emptied, so scrolling back
// up doesn't replay every arrival.
const arrived = reactive(new Set());
const stationEls = {};
let observer = null;

// The sticky bar's real height, so a phone's station fills exactly the
// screen under it (see Station.vue).
const bar = ref(null);
let barObserver = null;
const setBarHeight = () =>
  document.documentElement.style.setProperty("--pod-bar-h", `${bar.value.offsetHeight}px`);

onMounted(() => {
  setBarHeight();
  barObserver = new ResizeObserver(setBarHeight);
  barObserver.observe(bar.value);

  // A band across the middle of the screen: whichever station crosses it is
  // the one you're at.
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        current.value = entry.target.id;
        arrived.add(entry.target.id);
      }
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );
  for (const el of Object.values(stationEls)) if (el) observer.observe(el);

  // The first screen's station has already arrived by the time you look.
  if (stations[0]) arrived.add(stations[0].id);

  // A shared link to a station lands on it.
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (hash && stations.some((s) => s.id === hash)) goTo(hash, "instant");
});

onBeforeUnmount(() => {
  observer?.disconnect();
  barObserver?.disconnect();
  document.documentElement.style.removeProperty("--pod-bar-h");
});

function goTo(id, behavior = "smooth") {
  const el = stationEls[id];
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "instant" : behavior, block: "start" });
  history.replaceState(null, "", `#${id}`);
  current.value = id;
  arrived.add(id);
  query.value = "";
  searchInput.value?.blur();
}

// ---- Station finder ------------------------------------------------------

const searchInput = ref(null);
const query = ref("");
const searchFocused = ref(false);
const highlight = ref(0);

const results = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  return stations
    .filter((s) =>
      [s.station, s.title, s.headline, s.guest, s.description, s.language.label, s.language.searchAs]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    )
    .slice(0, 6);
});

const showResults = computed(() => searchFocused.value && query.value.trim() !== "");

function onSearchKey(event) {
  if (!showResults.value) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    highlight.value = Math.min(highlight.value + 1, results.value.length - 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    highlight.value = Math.max(highlight.value - 1, 0);
  } else if (event.key === "Enter" && results.value[highlight.value]) {
    event.preventDefault();
    goTo(results.value[highlight.value].id);
  } else if (event.key === "Escape") {
    query.value = "";
  } else {
    highlight.value = 0;
  }
}

usePodcastHead({ title: page.meta.title, description: page.meta.description });
</script>

<script>
export default {
  name: "PodcastEpisodes"
};
</script>

<style scoped>
/* Mandarin titles fall back past Archivo, which has no CJK glyphs. */
.pod-episodes {
  font-family: Archivo, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif;
}

/* Night-platform dark, the same token swap the hero makes. */
.pod-episodes {
  --pod-bg: #101014;
  --pod-bg-raised: #1b1b22;
  --pod-text: #f4f1e8;
  --pod-text-muted: #c9c6bc;
  --pod-accent: #ff6319;
  --pod-accent-strong: #e0551a;
  --pod-rule: rgba(244, 241, 232, 0.18);
  display: flex;
  flex-direction: column;
  flex: 1;
  background: var(--pod-bg);
  color: var(--pod-text);
}

.pod-episodes :deep(.pod-eyebrow) {
  color: #ffc694;
}

.pod-episodes :deep(.pod-footer) {
  border-top: 1px solid var(--pod-rule);
}

/* ---- Bar ---------------------------------------------------------------- */

.pod-episodes-bar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(16, 16, 20, 0.92);
  backdrop-filter: blur(8px);
}

.pod-episodes-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.9rem;
}

.pod-episodes .pod-episodes-back,
.pod-episodes .pod-episodes-back:link,
.pod-episodes .pod-episodes-back:visited {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 800;
  font-size: 1rem;
  color: var(--pod-text);
  white-space: nowrap;
}

.pod-episodes .pod-episodes-back:hover {
  color: var(--pod-accent);
}

.pod-episodes-bullet {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  background: #ff6319;
  color: #fff;
  font-weight: 900;
}

.pod-episodes-search {
  position: relative;
  flex: 0 1 22rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--pod-rule);
  border-radius: 999px;
  background: var(--pod-bg-raised);
  color: var(--pod-text-muted);
}

.pod-episodes-search:focus-within {
  border-color: var(--pod-accent);
}

.pod-episodes-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--pod-text);
  font: inherit;
  font-size: 0.95rem;
}

.pod-episodes-search input::placeholder {
  color: var(--pod-text-muted);
  opacity: 0.7;
}

.pod-episodes-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.4rem;
  list-style: none;
  background: var(--pod-bg-raised);
  border: 1px solid var(--pod-rule);
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}

.pod-episodes-results li {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  line-height: 1.35;
}

.pod-episodes-results li.is-highlighted {
  background: rgba(255, 99, 25, 0.18);
}

.pod-episodes-result-station {
  font-weight: 800;
  color: var(--pod-text);
}

.pod-episodes-result-meta {
  font-size: 0.85rem;
  color: var(--pod-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pod-episodes-results li.pod-episodes-result-empty {
  cursor: default;
  font-size: 0.9rem;
  color: var(--pod-text-muted);
}

/* ---- Body --------------------------------------------------------------- */

/* A screen tall, so the footer sits below the fold; centred on desktop. */
.pod-episodes-body {
  min-height: calc(100svh - var(--pod-bar-h, 4.5rem));
  box-sizing: border-box;
  align-content: center;
  display: grid;
  grid-template-columns: 12rem minmax(0, 1fr);
  gap: 3rem;
  padding-block: 2rem;
}

.pod-episodes-line {
  position: sticky;
  top: 6rem;
  align-self: start;
}

.pod-episodes-title {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.pod-episodes-line ol {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
}

/* The line itself, running through every stop's dot. */
.pod-episodes-line ol::before {
  content: "";
  position: absolute;
  left: 0.55rem;
  top: 0.9rem;
  bottom: 0.9rem;
  width: 4px;
  margin-left: -2px;
  background: #ff6319;
}

.pod-episodes-line a,
.pod-episodes-line a:link,
.pod-episodes-line a:visited {
  position: relative;
  display: grid;
  grid-template-columns: 1.1rem 1fr;
  column-gap: 0.9rem;
  padding-block: 0.45rem;
  color: var(--pod-text-muted);
  line-height: 1.3;
}

.pod-episodes-line a:hover .pod-episodes-stop-name {
  color: var(--pod-text);
}

.pod-episodes-stop {
  grid-row: span 2;
  align-self: start;
  margin-top: 0.15rem;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: var(--pod-bg);
  border: 3px solid #ff6319;
  transition: transform 0.2s, background-color 0.2s;
}

.pod-episodes-stop-name {
  font-weight: 700;
  font-size: 0.95rem;
}

.pod-episodes-stop-ep {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
}

/* Filled, not bigger: every stop on the line is the same size. */
.is-current .pod-episodes-stop {
  background: #ff6319;
}

.is-current .pod-episodes-stop-name {
  color: var(--pod-text);
}


/* ---- The next stop ---- */
.pod-episodes-next {
  position: relative;
  margin-top: 0.5rem;
}

/* The line running on from the last aired stop into this one. */
.pod-episodes-next::before {
  content: "";
  position: absolute;
  left: 0.55rem;
  top: -1.9rem;
  height: 2.6rem;
  width: 4px;
  margin-left: -2px;
  background: #ff6319;
}

.pod-episodes-next-stop {
  display: grid;
  grid-template-columns: 1.1rem 1fr;
  column-gap: 0.9rem;
  padding-block: 0.45rem;
  line-height: 1.3;
}

.pod-episodes-next .pod-episodes-stop {
  position: relative;
}

.pod-episodes-next .pod-episodes-stop-ep {
  color: #e8b33a;
}

.pod-episodes-next-hint {
  display: none;
}

.pod-episodes-stations {
  display: flex;
  flex-direction: column;
  gap: clamp(4rem, 9vw, 7rem);
}

/* One column: the line map gives way. */
@media (max-width: 60rem) {
  .pod-episodes-body {
    grid-template-columns: minmax(0, 1fr);
    align-content: start;
    padding-top: 1.5rem;
  }
  .pod-episodes-line {
    display: none;
  }

  /* The next station's name over the line running into its stop. */
  .pod-episodes-next-hint {
    display: grid;
    justify-items: center;
    row-gap: 0.35rem;
    padding-bottom: 0.75rem;
    line-height: 1.1;
    text-align: center;
  }

  .pod-episodes-next-hint-name {
    font-weight: 800;
    font-size: 1.05rem;
    color: var(--pod-text);
  }

  /* The stop is what centres under the name; the track hangs off its left. */
  .pod-episodes-next-hint-line {
    position: relative;
    display: flex;
  }

  .pod-episodes-next-hint-track {
    position: absolute;
    right: 100%;
    top: 50%;
    width: 1.5rem;
    height: 4px;
    transform: translateY(-50%);
    background: #ff6319;
  }

  .pod-episodes-next-hint .pod-episodes-stop {
    margin: 0;
  }
}

@media (max-width: 40rem) {
  .pod-episodes-search {
    flex: 1;
  }
}

/* One column: scrolling settles on one station at a time. */
@media (max-width: 60rem) {
  :global(html:has(.pod-episodes)) {
    scroll-snap-type: y proximity;
  }
  .pod-episodes-body {
    padding-block: 0 1.5rem;
  }
  /* Each station (and the hint) is as wide as its height-capped frame, centred. */
  .pod-episodes-stations {
    gap: 0;
    align-items: center;
    --pod-station-w: min(100%, max(11.8rem, calc((100svh - var(--pod-bar-h, 4.5rem) - 15.75rem) * 488 / 620)));
  }
  .pod-episodes-stations > * {
    width: var(--pod-station-w);
  }
}

/* Phones: full width; the frame nearly fills it anyway. */
@media (max-width: 40rem) {
  .pod-episodes-stations {
    --pod-station-w: 100%;
  }
}

@media (max-width: 32rem) {
  .pod-episodes-back span:last-child {
    display: none;
  }
  .pod-episodes-search {
    flex: 1;
  }
}
</style>
