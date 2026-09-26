<template>
  <header class="pod-join-top">
    <div class="pod-shell">
      <NuxtLink class="pod-join-back" :to="content.links.home">
        <i class="fas fa-arrow-left" aria-hidden="true"></i>
        {{ content.hero.title }}
      </NuxtLink>
    </div>
  </header>

  <main class="pod-join">
    <div class="pod-shell pod-split">
      <div class="pod-split-label">
        <p class="pod-eyebrow">{{ join.eyebrow }}</p>
      </div>
      <div class="pod-split-body">
        <h1 class="pod-join-title">{{ join.title }}</h1>
        <PodcastJoinForm :join="join" />
      </div>
    </div>
  </main>

  <PodcastFooter :links="content.footer" />
</template>

<script setup>
// The copy, the form's fields and where it sends them all live under "join"
// in assets/podcast.json, next to the rest of the show's page. English only:
// it has no Mandarin version (see podcastHasZh).
definePageMeta({ layout: "podcast" });

const route = useRoute();
const content = podcastContent("en");
const join = content.join;

usePodcastHead({ title: join.meta.title, description: join.meta.description, path: route.path });
</script>

<script>
export default {
  name: "PodcastJoin"
};
</script>

<style scoped>
.pod-join-top {
  padding-block: 1.5rem;
}

.podcast-page .pod-join-back,
.podcast-page .pod-join-back:link,
.podcast-page .pod-join-back:visited {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--pod-text);
}
.podcast-page .pod-join-back:hover {
  color: var(--pod-accent);
}

.pod-join {
  padding-block: clamp(2rem, 6vw, 4.5rem) var(--pod-band);
}

.pod-join-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  margin-bottom: 1.25rem;
}
</style>
