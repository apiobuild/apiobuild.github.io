<template>
  <!-- The language switch: a cat hidden below the bottom-left edge of the
    screen that pops its head up now and then, saying the page's language.
    Tapping it swipes the page over to the other language. A real link, so
    it works without JavaScript and search engines find the other pages. -->
  <a
    :href="otherPath"
    class="pod-langcat"
    :class="{ 'is-up': popped || hovering || switching, 'is-hop': switching }"
    :lang="otherLang === 'zh' ? 'zh-Hant' : 'en'"
    :aria-label="otherLang === 'zh' ? '切換到中文 — Switch to Mandarin' : 'Switch to English — 切換到英文'"
    @click.prevent="switchLang"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @focus="hovering = true"
    @blur="hovering = false"
  >
    <span class="pod-langcat-window" aria-hidden="true">
      <span class="pod-langcat-say">{{ lang === "zh" ? "中" : "EN" }}</span>
      <span class="pod-langcat-tail"></span>
      <img class="pod-langcat-cat" src="/images/podcast-lang-cat.png" alt="" />
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
// sends language_switch with where from, where to, and how: "cat" (tapped
// here), or "browser" / "remembered" (a redirect to the reader's default
// language; see podcastDefaultRedirect).
const { gtag } = useGtag();
const trackSwitch = (from, to, method) => useTrackEvent("language_switch", { from, to, method });
watch(lang, (value) => gtag("set", { page_language: value }), { immediate: true });

// ---- Popping up ------------------------------------------------------------

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

// ---- Switching -------------------------------------------------------------

// The whole page swipes: out to the left, then the other language's page in
// from the right, like swiping to the next screen. Only the cat's siblings
// move; the cat itself (position: fixed) stays put.
const pageParts = (host) => [...host.children].filter((el) => !el.classList.contains("pod-langcat"));
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
  trackSwitch(from, to, "cat");

  if (reduceMotion()) {
    await navigateTo(target);
    return;
  }

  switching.value = true;
  const host = document.querySelector(".pod-langcat")?.parentElement;
  const root = document.documentElement;
  const overflow = root.style.overflowX;
  root.style.overflowX = "hidden";
  if (host) await slide(pageParts(host), "0", "-100vw", 260, "cubic-bezier(.6,0,.9,.6)");
  // Hold the incoming page off to the right until its slide starts.
  host?.classList.add("is-swipe-in");
  await navigateTo(target);
  await nextTick();
  await new Promise((resolve) => requestAnimationFrame(resolve));
  if (host) {
    const incoming = pageParts(host);
    const done = slide(incoming, "100vw", "0", 340, "cubic-bezier(.2,.7,.3,1)");
    host.classList.remove("is-swipe-in");
    await done;
    incoming.forEach((el) => el.getAnimations().forEach((animation) => animation.cancel()));
  }
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
  name: "PodcastLangCat"
};
</script>

<style scoped>
/* Fixed to the bottom-left of the screen (the buttons live on the right),
   clear of a phone's home-indicator area. */
.pod-langcat {
  position: fixed;
  z-index: 40;
  left: 10px;
  bottom: env(safe-area-inset-bottom, 0px);
  display: block;
  width: 54px;
  height: var(--pod-cat-room, 82px);
}
.pod-langcat:focus-visible {
  outline: 2px solid var(--pod-lime);
  outline-offset: 2px;
}

/* Everything below the screen's edge is cut off here. */
.pod-langcat-window {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* The cat's head (its collar along the bottom), facing right toward the
   page, with a cream sticker outline so a black cat shows on a black page. */
.pod-langcat-cat {
  position: absolute;
  left: 8px;
  bottom: 2px;
  width: 38px;
  height: auto;
  /* At rest it's fully hidden below the screen's edge. */
  transform: translateY(50px);
  transition: transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1);
  filter: drop-shadow(1.5px 0 0 #efece5) drop-shadow(-1.5px 0 0 #efece5) drop-shadow(0 1.5px 0 #efece5)
    drop-shadow(0 -1.5px 0 #efece5);
}
/* Up: its whole head, floating a little clear of the edge. */
.pod-langcat.is-up .pod-langcat-cat {
  transform: translateY(-8px);
}
.pod-langcat.is-hop .pod-langcat-cat {
  animation: pod-langcat-hop 0.38s ease;
}
@keyframes pod-langcat-hop {
  35% {
    transform: translateY(-16px) scale(1.03, 0.97);
  }
  70% {
    transform: translateY(-8px) scale(1.05, 0.94);
  }
}

/* The bubble, built like the ones over the characters on the hero's platform
   (NinthTrain.vue): the "JOIN THE CONVERSATION" sign's deep orange with white
   letter-spaced text, a darker isometric edge along the bottom and right, a
   slanted two-tone tail, and the same gentle bob. */
.pod-langcat-say {
  position: absolute;
  top: 3px;
  left: 9px;
  width: 32px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c4470f;
  color: #fff;
  font: 900 10px/1 Archivo, "PingFang TC", "Noto Sans TC", sans-serif;
  letter-spacing: 0.09em;
  transform-origin: 30% 100%;
  transform: scale(0);
  transition: transform 0.2s cubic-bezier(0.3, 1.7, 0.5, 1);
}
.pod-langcat-say::before,
.pod-langcat-say::after {
  content: "";
  position: absolute;
}
.pod-langcat-say::before {
  left: 0;
  top: 100%;
  width: 100%;
  height: 4px;
  background: #99380c;
  transform: skewX(45deg);
  transform-origin: top left;
}
.pod-langcat-say::after {
  left: 100%;
  top: 0;
  width: 4px;
  height: 100%;
  background: #7c2d0a;
  transform: skewY(45deg);
  transform-origin: left top;
}
.pod-langcat-tail {
  position: absolute;
  left: 14px;
  top: 23px;
  width: 13px;
  height: 9px;
  transform: scale(0);
  transform-origin: 30% 0;
  transition: transform 0.2s;
}
.pod-langcat-tail::before,
.pod-langcat-tail::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 9px;
}
.pod-langcat-tail::before {
  width: 13px;
  background: #99380c;
  clip-path: polygon(69.2% 0, 100% 0, 54.3% 100%, 23.5% 100%);
}
.pod-langcat-tail::after {
  width: 9px;
  background: #c4470f;
  clip-path: polygon(0 0, 100% 0, 34% 100%);
}
.pod-langcat.is-up .pod-langcat-say,
.pod-langcat.is-up .pod-langcat-tail {
  transform: scale(1);
  transition-delay: 0.18s;
  animation: pod-langcat-bob 2.4s ease-in-out 0.4s infinite;
}
@keyframes pod-langcat-bob {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -3px;
  }
}

/* While switching, the incoming page waits off to the right until its slide
   starts (see switchLang). */
:global(.podcast-page.is-swipe-in > :not(.pod-langcat)) {
  transform: translateX(100vw);
}

@media (prefers-reduced-motion: reduce) {
  .pod-langcat-cat,
  .pod-langcat-say,
  .pod-langcat-tail {
    transition: none;
  }
  .pod-langcat.is-hop .pod-langcat-cat,
  .pod-langcat.is-up .pod-langcat-say,
  .pod-langcat.is-up .pod-langcat-tail {
    animation: none;
  }
}
</style>
