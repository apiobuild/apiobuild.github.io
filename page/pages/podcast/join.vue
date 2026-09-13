<template>
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
// in assets/podcast.json, next to the rest of the show's page.
import content from "~/assets/podcast.json";

definePageMeta({ layout: "podcast" });

const join = content.join;

// Same tags and priority as the show's page -- see pages/podcast/index.vue.
useHead(
  {
    title: join.meta.title,
    meta: [
      { property: "og:title", content: join.meta.title },
      { name: "description", property: "og:description", content: join.meta.description },
      { name: "image", property: "og:image", content: content.meta.image },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  },
  { tagPriority: 1 }
);
</script>

<script>
export default {
  name: "PodcastJoin"
};
</script>

<style scoped>
.pod-join {
  padding-block: clamp(3rem, 8vw, 6rem) var(--pod-band);
}

.pod-join-title {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  margin-bottom: 1.25rem;
}
</style>
