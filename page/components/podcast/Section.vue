<template>
  <!-- The shape every section on the page shares: an eyebrow label in the
    left column, a heading and whatever the section is made of in the right.
    Position in assets/podcast.json decides the id, the order, and whether
    this one sits on a lime field. -->
  <section :id="id" class="pod-band" :class="{ 'pod-on-lime': lime }">
    <div class="pod-shell pod-split">
      <div class="pod-split-label">
        <p class="pod-eyebrow">{{ eyebrow }}</p>
      </div>
      <div class="pod-split-body">
        <h2 v-if="title" class="pod-band-title">{{ title }}</h2>
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, required: true },
  eyebrow: { type: String, required: true },
  // Optional: a section reads fine as an eyebrow and its content, so an
  // empty title renders no heading rather than an empty one.
  title: { type: String, default: "" },
  lime: { type: Boolean, default: false }
});
</script>

<script>
export default {
  name: "PodcastSection"
};
</script>

<style scoped>
.pod-band-title {
  font-size: clamp(1.9rem, 4vw, 2.9rem);
  max-width: 20ch;
  margin-bottom: 1.25rem;
}
</style>
