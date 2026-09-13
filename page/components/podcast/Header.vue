<template>
  <!-- On every podcast page, from the layout. The links live under "nav" in
    assets/podcast.json. On a phone they fold into a menu under a button. -->
  <header class="pod-header">
    <div class="pod-shell pod-header-inner">
      <NuxtLink class="pod-header-name" to="/podcast">{{ title }}</NuxtLink>

      <nav class="pod-header-nav" :class="{ 'is-open': open }" aria-label="What's the Tea">
        <NuxtLink v-for="link in nav.links" :key="link.label" class="pod-header-link" :to="link.to">
          {{ link.label }}
        </NuxtLink>
        <NuxtLink class="pod-btn pod-btn-solid pod-header-cta" :to="nav.cta.to">{{ nav.cta.label }}</NuxtLink>
      </nav>

      <button
        type="button"
        class="pod-header-toggle"
        :aria-expanded="open"
        :aria-label="open ? 'Close menu' : 'Open menu'"
        @click="open = !open"
      >
        <i :class="open ? 'fas fa-xmark' : 'fas fa-bars'" aria-hidden="true"></i>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from "vue";
import content from "~/assets/podcast.json";

const title = content.hero.title;
const nav = content.nav;
const open = ref(false);

// A tap on a link navigates without reloading, so the menu has to close itself.
const route = useRoute();
watch(() => route.fullPath, () => (open.value = false));
</script>

<script>
export default {
  name: "PodcastHeader"
};
</script>

<style scoped>
/* Sticky, and on the page's own ground so the lime bands pass under it
   without the header changing colour. */
.pod-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--pod-bg);
  border-bottom: 1px solid var(--pod-rule);
}

.pod-header-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  height: var(--pod-header);
}

.podcast-page .pod-header-name,
.podcast-page .pod-header-name:link,
.podcast-page .pod-header-name:visited {
  font-family: var(--pod-display);
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: var(--pod-text);
}

.pod-header-nav {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.podcast-page .pod-header-link,
.podcast-page .pod-header-link:link,
.podcast-page .pod-header-link:visited {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--pod-text);
}
.podcast-page .pod-header-link:hover,
.podcast-page .pod-header-link.router-link-exact-active {
  color: var(--pod-accent);
}

.pod-header-cta {
  padding: 0.55rem 1.25rem;
  font-size: 0.9rem;
}

.pod-header-toggle {
  display: none;
  width: 2.75rem;
  height: 2.75rem;
  margin-right: -0.6rem;
  border: 0;
  background: transparent;
  color: var(--pod-text);
  font-size: 1.2rem;
  cursor: pointer;
}

/* A phone: the links drop down under the bar as a full-width panel. */
@media (max-width: 40rem) {
  .pod-header-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .pod-header-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: -1.25rem;
    right: -1.25rem;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0.5rem 1.25rem 1.25rem;
    background: var(--pod-bg);
    border-bottom: 1px solid var(--pod-rule);
  }

  .pod-header-nav.is-open {
    display: flex;
  }

  .pod-header-link {
    padding-block: 0.85rem;
    border-bottom: 1px solid var(--pod-rule);
    font-size: 1.05rem;
  }

  .pod-header-cta {
    margin-top: 1rem;
    padding-block: 0.8rem;
  }
}
</style>
