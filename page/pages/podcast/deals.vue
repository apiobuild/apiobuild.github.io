<template>
  <main class="pod-deals">
    <div class="pod-shell pod-split">
      <div class="pod-split-label">
        <p class="pod-eyebrow">{{ deals.eyebrow }}</p>
      </div>
      <div class="pod-split-body">
        <h1 class="pod-deals-title">{{ deals.title }}</h1>
        <p class="pod-lede">{{ deals.body }}</p>
      </div>
    </div>

    <!-- One block per category, in the order the first deal of each appears
      in podcast.json. -->
    <section v-for="group in groups" :key="group.category" class="pod-shell pod-split pod-deals-group">
      <div class="pod-split-label">
        <h2 class="pod-deals-category">{{ group.category }}</h2>
      </div>
      <ul class="pod-deals-grid">
        <li v-for="item in group.items" :key="item.name" class="pod-deal">
          <p class="pod-deal-name">{{ item.name }}</p>
          <p class="pod-deal-headline">{{ item.deal }}</p>
          <p class="pod-deal-details">{{ item.details }}</p>
          <a class="pod-deal-link" :href="item.url" target="_blank" rel="noopener">
            See the offer <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
        </li>
      </ul>
    </section>

    <div class="pod-shell pod-split pod-deals-footer">
      <div class="pod-split-label"></div>
      <div class="pod-split-body">
        <p class="pod-deals-note">{{ deals.note }}</p>
        <div class="pod-deals-join">
          <p class="pod-deals-join-copy">{{ deals.join.body }}</p>
          <NuxtLink class="pod-btn pod-btn-solid" to="/podcast/join">{{ deals.join.label }}</NuxtLink>
        </div>
      </div>
    </div>
  </main>

  <PodcastFooter :links="content.footer" />
</template>

<script setup>
// Every deal lives under "deals" in assets/podcast.json. Terms belong to each
// company and change, so each entry links to the page they're stated on.
import content from "~/assets/podcast.json";

definePageMeta({ layout: "podcast" });

const deals = content.deals;

const groups = deals.items.reduce((list, item) => {
  const group = list.find((entry) => entry.category === item.category);
  if (group) group.items.push(item);
  else list.push({ category: item.category, items: [item] });
  return list;
}, []);

// Same tags and priority as the show's page -- see pages/podcast/index.vue.
useHead(
  {
    title: deals.meta.title,
    meta: [
      { property: "og:title", content: deals.meta.title },
      { name: "description", property: "og:description", content: deals.meta.description },
      { name: "image", property: "og:image", content: content.meta.image },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  },
  { tagPriority: 1 }
);
</script>

<script>
export default {
  name: "PodcastDeals"
};
</script>

<style scoped>
.pod-deals {
  padding-block: clamp(3rem, 8vw, 6rem) var(--pod-band);
}

.pod-deals-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  margin-bottom: 1.25rem;
}

.pod-deals-group {
  margin-top: clamp(3rem, 6vw, 4.5rem);
}

/* Styled as the eyebrow, but a real heading so the page has an outline. */
.pod-deals-category {
  font-family: var(--pod-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  line-height: 1.75;
  color: var(--pod-accent);
}

.pod-deals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pod-deal {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.35rem 1.4rem;
  border: 1px solid var(--pod-rule);
  border-radius: 1rem;
  background: #fff;
}

.pod-deal-name {
  font-weight: 800;
  font-size: 1.1rem;
  line-height: 1.3;
}

/* The offer itself, marked in lime like the hosts' names in the hero. */
.pod-deal-headline {
  align-self: flex-start;
  background: var(--pod-lime);
  padding: 0.05em 0.35em;
  font-weight: 600;
  font-size: 0.9rem;
  line-height: 1.5;
}

.pod-deal-details {
  flex: 1;
  margin-top: 0.25rem;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--pod-text-muted);
}

.podcast-page .pod-deal-link,
.podcast-page .pod-deal-link:link,
.podcast-page .pod-deal-link:visited {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--pod-accent);
}
.podcast-page .pod-deal-link:hover {
  color: var(--pod-accent-strong);
}

.pod-deal-link i {
  font-size: 0.75em;
}

.pod-deals-footer {
  margin-top: clamp(3rem, 6vw, 4.5rem);
}

.pod-deals-note {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--pod-text-muted);
  max-width: 42rem;
}

.pod-deals-join {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.5rem;
  margin-top: 2rem;
  padding: 1.75rem 2rem;
  border-radius: 1.25rem;
  background: var(--pod-lime);
}

.pod-deals-join-copy {
  font-weight: 600;
  max-width: 28rem;
}
</style>
