<template>
  <!-- Same two-column band shape as PodcastBand, with host cards in place of
    the prose. Its position on the page comes from where its entry sits in
    assets/podcast.json, like every other band. -->
  <section :id="band.id" class="pod-band">
    <div class="pod-shell pod-split">
      <div class="pod-split-label">
        <p class="pod-eyebrow">{{ band.eyebrow }}</p>
      </div>
      <div class="pod-split-body">
        <h2 class="pod-hosts-title">{{ band.title }}</h2>
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
              <p v-if="person.links.length" class="pod-host-links">
                <a
                  v-for="link in person.links"
                  :key="link.name"
                  :href="link.href"
                  target="_blank"
                  rel="noopener"
                >
                  {{ link.name }}
                </a>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  band: { type: Object, required: true }
});
</script>

<script>
export default {
  name: "PodcastHosts"
};
</script>

<style scoped>
.pod-hosts-title {
  font-size: clamp(1.9rem, 4vw, 2.9rem);
  max-width: 20ch;
  margin-bottom: 2rem;
}

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
  gap: 1.25rem;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.pod-host-links a:link,
.pod-host-links a:visited {
  color: var(--pod-text);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.pod-host-links a:hover {
  color: var(--pod-accent);
}

@media (max-width: 32rem) {
  .pod-host {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
