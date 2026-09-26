<template>
  <header class="pod-hero">
    <div class="pod-shell pod-hero-inner">
      <!-- The scene and the name are grouped for a phone, where together they
        are the first screen. Side by side the group dissolves (display:
        contents) and the name sits over the rest of the copy, beside the scene. -->
      <div class="pod-hero-top">
        <PodcastNinthTrain class="pod-hero-art" :scene="hero.scene" />
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
          <!-- "Hosted by" (hero.hostedBy) and the names, highlighted as one
            line. One line per name so the comma hugs it instead of picking
            up the template's line break as a space. -->
          <p class="pod-hero-hosted">
            <span class="pod-mark">
              <template v-if="hero.hostedBy">{{ `${hero.hostedBy} ` }}</template>
              <template v-for="(person, index) in hosts" :key="person.name">
                <strong>{{ person.name }}</strong><template v-if="index < hosts.length - 1">{{ hero.hostSeparator ?? ", " }}</template>
              </template>
            </span>
          </p>
        </div>

        <div class="pod-hero-actions">
          <a
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
  min-height: 100vh;
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
    height: calc(100vh - 2 * var(--pod-hero-pad));
    height: calc(100svh - 2 * var(--pod-hero-pad));
    min-height: fit-content;
    /* The bottom of that first screen is left empty for the language cat,
       which peeks up at the screen's bottom edge (LangCat.vue): the scene
       and the name sit above it, and the next section still starts below
       the fold. */
    box-sizing: border-box;
    padding-bottom: var(--pod-cat-room);
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
    /* Always the full measure: auto margins alone shrink a block to fit its
       text, and a shorter line in one language (the Mandarin eyebrow) would
       narrow it and pull it off the left edge the other language sits on. */
    width: 100%;
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
    /* The name sits on the block's bottom edge, so an eyebrow that's a line
       shorter in one language never moves the title. */
    justify-content: flex-end;
  }

  /* Buttons go to the right on phones and tablets: where a thumb reaches
     them, and clear of the language cat at the bottom-left. */
  .pod-hero-actions {
    align-self: flex-end;
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
  align-items: flex-start;
  gap: 0.85rem;
  margin-top: 0.5rem;
}

/* On a phone the two buttons wrap onto separate lines, where hugging their
   own labels left them different widths against a shared left edge -- a
   ragged pair that reads as a mistake. Stacked, they both take the width of
   the longer label, so the pair squares off, on the right edge (see above).
   Same breakpoint the hosts band stacks at. */
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
/* "Hosted by" in the regular weight, the names bold; if the line wraps,
   each line keeps its own highlight. */
.pod-hero-hosted .pod-mark {
  font-weight: 400;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
.pod-hero-hosted strong {
  font-weight: 700;
}
</style>
