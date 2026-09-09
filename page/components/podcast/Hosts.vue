<template>
  <!-- The hosts section: the same shape as a prose band, with cards in place
    of the copy. -->
  <PodcastSection :id="band.id" :eyebrow="band.eyebrow" :title="band.title" :lime="lime">
    <ul class="pod-hosts">
      <li v-for="person in band.people" :key="person.name" class="pod-host">
        <img v-if="person.photo" class="pod-host-photo" :src="person.photo" alt="" />
        <!-- A host without a photo yet still gets the same circle, so the
          row keeps its rhythm instead of collapsing to one card. -->
        <span v-else class="pod-host-photo pod-host-photo-empty" aria-hidden="true">
          {{ person.name.charAt(0) }}
        </span>
        <div>
          <p class="pod-host-name">{{ person.name }}</p>
          <p class="pod-host-role">{{ person.role }}</p>
          <p class="pod-host-bio">{{ person.bio }}</p>
          <!-- Icon-only, with the link's name as its accessible label. -->
          <p v-if="person.links?.length" class="pod-host-links">
            <a
              v-for="link in person.links"
              :key="link.name"
              class="pod-host-link"
              :class="{ 'pod-host-link-brand': link.image || link.color }"
              :style="link.color ? { color: link.color } : null"
              :href="link.href"
              :aria-label="link.name"
              :title="link.name"
              v-bind="podcastLinkAttrs(link.href)"
            >
              <!-- A brand's own mark where it has one, an icon otherwise. -->
              <img v-if="link.image" :src="link.image" alt="" />
              <i v-else :class="link.icon" aria-hidden="true"></i>
            </a>
          </p>
        </div>
      </li>
    </ul>
  </PodcastSection>
</template>

<script setup>
defineProps({
  band: { type: Object, required: true },
  lime: { type: Boolean, default: false }
});
</script>

<script>
export default {
  name: "PodcastHosts"
};
</script>

<style scoped>
.pod-hosts {
  display: grid;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pod-host {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  gap: 1.5rem;
  align-items: start;
}

.pod-host-photo {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 999px;
  object-fit: cover;
  background: var(--pod-bg-raised);
}

.pod-host-photo-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--pod-display);
  font-size: 2rem;
  color: var(--pod-text-muted);
}

.pod-host-name {
  font-family: var(--pod-display);
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.3;
}

.pod-host-role {
  color: var(--pod-accent);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-bottom: 0.5rem;
}

.pod-host-bio {
  color: var(--pod-text-muted);
  font-size: 1rem;
  max-width: 38rem;
}

.pod-host-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.85rem;
}

/* Outlined and smaller than the hero's platform buttons -- same family, but
   these sit under a bio rather than acting as the page's main call. */
.pod-host-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 999px;
  border: 1px solid var(--pod-rule);
  font-size: 0.95rem;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.pod-host-links a:link,
.pod-host-links a:visited {
  color: var(--pod-accent);
}
.pod-host-links a:hover {
  background: var(--pod-accent);
  border-color: var(--pod-accent);
  color: #f4f6ea;
}

/* A brand mark stands in for the icon glyph, so it sits inside the ring at
   the same size the icons do rather than filling the circle. */
/* Each mark carries its own padding, so a logo that brings a background
   fills the circle while one that doesn't sits inside it, without either
   needing a rule of its own here. */
.pod-host-link-brand img {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 999px;
  object-fit: contain;
}

/* Every chip sits on a neutral disc: brand colours need a ground that isn't
   the band -- the Bagel mark is a green close enough to the lime to vanish
   into it, and LinkedIn's glyph knocks its letters out of the square, so
   whatever is behind shows through them. */
.pod-host-links a {
  background: var(--pod-bg);
}

/* A link carrying its own colours keeps them on hover too; the accent fill
   would bury a logo, and it cannot recolour one. */
.pod-host-links a.pod-host-link-brand:hover {
  background: var(--pod-bg);
  border-color: var(--pod-accent);
}

@media (max-width: 32rem) {
  .pod-host {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
