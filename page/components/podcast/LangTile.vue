<template>
  <!-- The language switch: a tile hidden below the bottom-left edge of the
    screen that pops up now and then, saying the page's language -- a 紅中
    mahjong tile on the Mandarin pages, Scrabble tiles spelling EN on the
    English ones. Tapping it flips the tile and swipes the page over to the
    other language. A real link, so
    it works without JavaScript and search engines find the other pages. -->
  <a
    :href="otherPath"
    class="pod-langtile"
    :class="{ 'is-up': popped || hovering || switching }"
    :lang="otherLang === 'zh' ? 'zh-Hant' : 'en'"
    :aria-label="otherLang === 'zh' ? '切換到中文 — Switch to Mandarin' : 'Switch to English — 切換到英文'"
    @pointerdown="pointerType = $event.pointerType"
    @click.prevent="onTap"
    @pointerenter="$event.pointerType === 'mouse' && (hovering = true)"
    @pointerleave="hovering = false"
    @focus="onFocus"
    @blur="hovering = false"
  >
    <span class="pod-langtile-window" aria-hidden="true">
      <img ref="tile" class="pod-langtile-tile" :src="`/images/podcast-lang-${lang}.png`" alt="" />
    </span>
  </a>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const route = useRoute();
const lang = usePodcastLang();
const otherLang = computed(() => (lang.value === "zh" ? "en" : "zh"));
const otherPath = computed(() => podcastPath(route.path, otherLang.value));

// ---- Analytics -------------------------------------------------------------
// Page views already carry the path (/podcast vs /podcast/zh). On top of
// that, every event from these pages carries page_language, and switching
// sends language_switch with where from, where to, and how: "tile" (tapped
// here), or "browser" / "remembered" (a redirect to the reader's default
// language; see podcastDefaultRedirect).
const { gtag } = useGtag();
const trackSwitch = (from, to, method) => useTrackEvent("language_switch", { from, to, method });
watch(lang, (value) => gtag("set", { page_language: value }), { immediate: true });

// ---- Popping up ------------------------------------------------------------

const tile = ref(null);
const popped = ref(false);
const hovering = ref(false);
const switching = ref(false);
let popTimer = null;
let hideTimer = null;
let scrollTimer = null;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function pop(ms) {
  popped.value = true;
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => (popped.value = false), ms);
}
// When scrolling stops the reader is looking at the page: say hello then.
function onScroll() {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => pop(3000), 400);
}

// ---- Tapping ---------------------------------------------------------------

// A mouse shows the tile on hover, so a click always switches. A finger has
// no hover: while the tile is hidden, the first tap on its corner only brings
// it up, and a tap while it's showing switches.
let pointerType = null;
function onFocus() {
  // A tap focuses the link too; only the keyboard should raise the tile here.
  if (pointerType !== "touch") hovering.value = true;
}
function onTap() {
  const touch = pointerType === "touch";
  pointerType = null;
  if (touch && !popped.value && !switching.value) {
    pop(4000);
    return;
  }
  switchLang();
}

// ---- Switching -------------------------------------------------------------

// The whole page swipes: out to the left, then the other language's page in
// from the right, like swiping to the next screen. Only the tile's siblings
// move; the tile itself (position: fixed) stays put.
const pageParts = (host) => [...host.children].filter((el) => !el.classList.contains("pod-langtile"));
const slide = (els, from, to, ms, easing) =>
  Promise.all(
    els.map(
      (el) =>
        el.animate([{ transform: `translateX(${from})` }, { transform: `translateX(${to})` }], {
          duration: ms,
          easing,
          fill: "forwards"
        }).finished
    )
  );

async function switchLang() {
  if (switching.value) return;
  const from = lang.value;
  const to = otherLang.value;
  // `force`: the Mandarin pages are aliases of the English ones, and the
  // router counts an alias and its original as the same location -- without
  // it, switching would be skipped as a redundant navigation.
  const target = { path: otherPath.value, hash: route.hash, force: true };
  savePodcastLangChoice(to);
  trackSwitch(from, to, "tile");

  if (reduceMotion()) {
    await navigateTo(target);
    return;
  }

  switching.value = true;
  const host = document.querySelector(".pod-langtile")?.parentElement;
  const root = document.documentElement;
  const overflow = root.style.overflowX;
  root.style.overflowX = "hidden";
  // The tile turns edge-on as the page leaves...
  const turn = (from, to, ms) =>
    tile.value?.animate([{ transform: `rotateY(${from})` }, { transform: `rotateY(${to})` }], {
      duration: ms,
      easing: "ease-in-out",
      fill: "forwards"
    }).finished;
  await Promise.all([host && slide(pageParts(host), "0", "-100vw", 260, "cubic-bezier(.6,0,.9,.6)"), turn("0deg", "90deg", 200)]);
  // Hold the incoming page off to the right until its slide starts.
  host?.classList.add("is-swipe-in");
  await navigateTo(target);
  await nextTick();
  await new Promise((resolve) => requestAnimationFrame(resolve));
  // ...and comes back round showing the other language as the new page arrives.
  const turnedBack = turn("-90deg", "0deg", 260);
  if (host) {
    const incoming = pageParts(host);
    const done = slide(incoming, "100vw", "0", 340, "cubic-bezier(.2,.7,.3,1)");
    host.classList.remove("is-swipe-in");
    await done;
    incoming.forEach((el) => el.getAnimations().forEach((animation) => animation.cancel()));
  }
  await turnedBack;
  tile.value?.getAnimations().forEach((animation) => animation.cancel());
  root.style.overflowX = overflow;
  switching.value = false;
  pop(1800);
}

onMounted(() => {
  // Arrived here by a redirect to the reader's default language, made before
  // analytics had loaded: report it now.
  const autoSwitch = takePodcastAutoSwitch();
  if (autoSwitch) trackSwitch("en", lang.value, autoSwitch);

  // With reduced motion it just stays up, no popping in and out.
  if (reduceMotion()) {
    popped.value = true;
    return;
  }
  setTimeout(() => pop(4000), 800);
  popTimer = setInterval(() => pop(3500), 8000);
  window.addEventListener("scroll", onScroll, { passive: true });
});

onBeforeUnmount(() => {
  clearInterval(popTimer);
  clearTimeout(hideTimer);
  clearTimeout(scrollTimer);
  window.removeEventListener("scroll", onScroll);
});
</script>

<script>
export default {
  name: "PodcastLangTile"
};
</script>

<style scoped>
/* Fixed to the bottom-left of the screen (the buttons live on the right),
   clear of a phone's home-indicator area. */
.pod-langtile {
  position: fixed;
  z-index: 40;
  left: 10px;
  bottom: env(safe-area-inset-bottom, 0px);
  display: block;
  width: 64px;
  height: var(--pod-tile-room, 82px);
}
.pod-langtile:focus-visible {
  outline: 2px solid var(--pod-lime);
  outline-offset: 2px;
}

/* Everything below the screen's edge is cut off here. */
.pod-langtile-window {
  position: absolute;
  inset: 0;
  clip-path: inset(-20px -20px 0 -20px);
  perspective: 300px;
}

/* The tile, facing right toward the page. Both images are cut the same
   height, so the mahjong tile and the wider Scrabble pair sit on the same
   line. `translate` moves it up and down; `transform` is left free for the
   flip (see switchLang). */
.pod-langtile-tile {
  position: absolute;
  left: 6px;
  bottom: 4px;
  height: 40px;
  width: auto;
  /* At rest it's fully hidden below the screen's edge. */
  translate: 0 56px;
  transition: translate 0.35s cubic-bezier(0.3, 1.4, 0.5, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
}
.pod-langtile.is-up .pod-langtile-tile {
  translate: 0 -6px;
}

/* While switching, the incoming page waits off to the right until its slide
   starts (see switchLang). */
:global(.podcast-page.is-swipe-in > :not(.pod-langtile)) {
  transform: translateX(100vw);
}

@media (prefers-reduced-motion: reduce) {
  .pod-langtile-tile {
    transition: none;
  }
}
</style>
