<template>
  <!-- The site-wide Footer is not on this layout, so the legal links and the
    way back to apiobuild.com live here instead. -->
  <footer class="pod-footer">
    <div class="pod-shell pod-footer-inner">
      <a class="pod-footer-home" href="/">apiobuild</a>
      <nav class="pod-footer-links">
        <a
          v-for="link in links"
          :key="link.name"
          :href="link.href"
          :target="link.openNew ? '_blank' : null"
          :rel="link.openNew ? 'noopener' : null"
        >
          {{ link.name }}
        </a>
      </nav>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  links: { type: Array, required: true }
});
</script>

<script>
export default {
  name: "PodcastFooter"
};
</script>

<style scoped>
.pod-footer {
  border-top: 1px solid var(--pod-rule);
  padding-block: 3rem;
}

.pod-footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
}

.pod-footer-home {
  font-family: var(--pod-display);
  font-size: 1.1rem;
  font-weight: 600;
}

.pod-footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.9rem;
}

.pod-footer :deep(a),
.pod-footer a:link,
.pod-footer a:visited {
  color: var(--pod-text-muted);
}
.pod-footer a:hover {
  color: var(--pod-text);
}
</style>
