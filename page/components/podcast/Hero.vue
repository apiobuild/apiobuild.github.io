<template>
  <header class="pod-hero">
    <div class="pod-shell pod-hero-inner">
      <!-- The scene and the name are grouped for a phone, where together they
        are the first screen. Side by side the group dissolves (display:
        contents) and the name sits over the rest of the copy, beside the scene. -->
      <div class="pod-hero-top">
        <PodcastNinthTrain class="pod-hero-art" />
        <div class="pod-hero-lead">
          <!-- Optional, like the hosts band's heading: the hero reads fine
            without a label when the headline already says who the show is for. -->
          <p v-if="hero.eyebrow" class="pod-eyebrow">{{ hero.eyebrow }}</p>
          <!-- The scene's own badge, echoed here so the name carries the
            show's mark even for anyone who never touches the scene. -->
          <h1 class="pod-hero-title">
            <span class="pod-hero-nine" aria-hidden="true">9</span><span>{{ hero.title }}</span>
          </h1>
        </div>
      </div>

      <div class="pod-hero-copy">
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
          <!-- Just the names: the faces beside them already say these are the
            hosts. One line per name so the comma hugs it instead of picking
            up the template's line break as a space. -->
          <p class="pod-hero-hosted">
            <template v-for="(person, index) in hosts" :key="person.name">
              <span class="pod-mark">{{ person.name }}</span><template v-if="index < hosts.length - 1">, </template>
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
            :class="{
              'is-open': platformsOpen,
              'is-closing': platformsClosing,
              'is-returning': toggleReturning
            }"
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

// True only while the Listen button is animating back in, once the row it
// stood in for has finished leaving. Stacked, the button is display:none
// for the whole time the row is open, so without this it snaps back at
// full size the moment the row unmounts.
const toggleReturning = ref(false);
const RETURN_MS = 240;

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

    // Not awaited: the button is back and focusable immediately, and only
    // its arrival is being animated.
    if (!isReducedMotion()) {
      toggleReturning.value = true;
      wait(RETURN_MS).then(() => {
        toggleReturning.value = false;
      });
    }
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
/* The hero alone goes dark, night-platform dark to match the scene it now
   carries -- orange for the accent the scene already uses, lime kept as the
   second color everywhere it marked something (host chips, the faces'
   ring). Reassigning the tokens here rather than touching podcast.css keeps
   every band below the hero on the page's usual light ground; only what is
   var()'d and lives inside .pod-hero picks up the swap, and anything that
   instead inherits a *resolved* color from further up (the plain text color
   on .podcast-page) needs restating here to pick the new tokens up too. */
.pod-hero {
  display: flex;
  align-items: center;
  /* A screen less the sticky header above it. */
  min-height: calc(100vh - var(--pod-header));
  padding-block: var(--pod-band);
  --pod-bg: #101014;
  --pod-bg-raised: #1b1b22;
  --pod-text: #f4f1e8;
  --pod-text-muted: #c9c6bc;
  --pod-accent: #ff6319;
  --pod-accent-strong: #e0551a;
  --pod-rule: rgba(244, 241, 232, 0.18);
  background: var(--pod-bg);
  color: var(--pod-text);
}

.pod-hero .pod-eyebrow {
  /* Orange (podcast.css's default eyebrow color) never read as high-contrast
     here even lightened and bolded -- a lime highlight, the same treatment
     .pod-mark gives the host names below, sidesteps the question rather
     than fighting it. Padding only, no pill shape: a mark behind the text,
     not a button. */
  background: var(--pod-lime);
  color: #282b0d;
  padding: 0.15em 0.4em;
}

.pod-hero .pod-mark {
  /* Always a lime chip regardless of the ground it sits on, so its text
     stays the fixed dark that reads on lime rather than following the
     hero's light text token. */
  color: #282b0d;
}

.pod-hero .pod-btn-ghost,
.pod-hero a.pod-btn-ghost:link,
.pod-hero a.pod-btn-ghost:visited {
  /* A hairline nearly vanishes against a dark ground -- solid white instead
     of the light-on-light original's translucent dark one, so the ghost
     button reads as clearly as the solid orange one beside it. White, not
     orange, so it reads as this pair's *other* button rather than a paler
     copy of the one that already owns orange. */
  border-width: 3px;
  border-color: var(--pod-text);
}

.pod-hero a.pod-btn-ghost:hover {
  background: rgba(244, 241, 232, 0.12);
}

/* Side by side: the name over the rest of the copy on the left, the scene
   spanning both on the right. */
.pod-hero-inner {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  grid-template-areas:
    "lead art"
    "copy art";
  align-content: center;
  column-gap: clamp(2rem, 5vw, 4rem);
  row-gap: 1.75rem;
}

/* Only a box on a phone; here its children place themselves in the grid. */
.pod-hero-top {
  display: contents;
}

.pod-hero-lead,
.pod-hero-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.75rem;
}

.pod-hero-lead {
  grid-area: lead;
  align-self: end;
}

.pod-hero-copy {
  grid-area: copy;
  align-self: start;
}

.pod-hero-inner .pod-hero-art {
  grid-area: art;
  align-self: center;
}

/* One column on tablet down. The first screen is always the scene and the
   name under it, whatever the screen's size: the name holds its height and
   the scene takes the rest -- a drag scrubs it along the ride. The lede,
   hosts and buttons follow on scroll. */
@media (max-width: 60rem) {
  .pod-hero {
    --pod-hero-pad: clamp(1.5rem, 4svh, 3rem);
    padding-top: var(--pod-hero-pad);
    /* More than the top: the copy column's last button otherwise sits
       right against the band below it, with none of the breathing room
       every other section boundary on the page gets. */
    padding-bottom: calc(var(--pod-hero-pad) * 2);
  }

  .pod-hero-inner {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "top"
      "copy";
    row-gap: var(--pod-hero-pad);
  }

  /* A screen tall less the hero's padding, name pinned to the bottom.
     fit-content lets it grow instead of overlapping on a screen too short
     for the name and the scene's floor. The scene fills everything above
     the name (flex-grow below) and centers itself within that -- taller
     than its own natural size on a tall phone, which is the point: a
     naturally-sized scene with the group merely centered left the name
     stranded in the middle of the screen instead of anchored to an edge. */
  .pod-hero-top {
    grid-area: top;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: var(--pod-hero-pad);
    height: calc(100vh - var(--pod-header) - 2 * var(--pod-hero-pad));
    height: calc(100svh - var(--pod-header) - 2 * var(--pod-hero-pad));
    min-height: fit-content;
  }

  /* Grows to fill whatever the column leaves above the name; the scene
     itself centers within that (see NinthTrain.vue) rather than sitting
     pinned to the top of it. The scene is width-bound (portrait, and its
     column is narrower than it is tall), so on a tall phone it stops
     growing well short of a 40rem cap regardless -- lowering the cap here
     is what actually leaves flex-end genuine leftover space to push the
     whole group down toward the middle of the screen instead of pinning
     the scene flush to the top with the leftover parked below the hint. A
     floor so it never vanishes, and a cap so a tablet's scene stays sane
     and not a wall. */
  .pod-hero-inner .pod-hero-art {
    flex: 1 1 0;
    width: 100%;
    min-height: 8rem;
    max-height: 28rem;
  }

  /* The text stays left-aligned (its normal reading orientation), but as a
     block it centers on the page like the scene above it: max-width caps it
     a little wider than the scene's own rendered width (28rem tall * the
     488:620 aspect ratio) rather than the full column, and margin-inline
     centers that narrower block, so the *block* lines up with the scene
     even though the text inside it still starts flush left. */
  .pod-hero-lead,
  .pod-hero-copy {
    max-width: 24rem;
    margin-inline: auto;
  }

  /* .pod-hero-lead's own align-self: end is a *grid* row-alignment rule
     (bottom-align within its desktop grid row) -- .pod-hero-top is a flex
     column here, where align-self instead means "push to the end of the
     cross axis" (the right edge), shrinking lead to fit-content width and
     stranding it flush-right instead of centered under the scene. Flex and
     grid read the same property differently; reset it back for this
     context. */
  .pod-hero-lead {
    align-self: auto;
  }
}

/* The grid column sets the measure now, not a max-width of its own. Flex
   (not vertical-align, which was eyeballing an offset against the text's
   baseline and sitting the badge visibly high) centers the badge on the
   text's own line box regardless of font metrics or the clamp below. */
.pod-hero-title {
  display: flex;
  align-items: center;
  font-size: clamp(2.5rem, 7vw, 4.75rem);
}

/* The scene's own badge is 48px against a 30px wordmark there -- circle:text
   = 1.6, digit:circle = 0.7. Matched here in two steps because CSS's em is
   parent-relative for font-size but self-relative for every other property:
   font-size (the digit, sized against the title's) is set first at
   1.6*0.7 = 1.12em of the title, then width/height (the circle) at
   1.6/1.12 = 1.43em of THIS element's own now-resolved font-size, landing
   back at 1.6em of the title either way. Chaining both off the badge's own
   font-size the simpler-looking way (font-size then width in the same em)
   compounds instead of matching, which is what undersized it before. */
.pod-hero-nine {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  background: #ff6319;
  color: #fff;
  font-size: 1.12em;
  width: 1.43em;
  height: 1.43em;
  margin-right: 0.14em;
  font-weight: 900;
  line-height: 1;
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

/* The button coming back. A gentler start than the icons' 0.3 -- a pill
   this wide swelling from a third of its size reads as a different element
   arriving rather than this one returning. */
@keyframes pod-listen-return {
  from {
    opacity: 0;
    transform: scale(0.92);
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

  /* Only here does the button ever leave, so only here does it arrive.
     Side by side it never went anywhere and has nothing to animate. */
  .pod-hero-listen.is-returning .pod-listen-toggle {
    animation: pod-listen-return 240ms cubic-bezier(0.34, 1.56, 0.64, 1);
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
