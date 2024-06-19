<template>
  <meta property="og:title" :content="meta.title" />
  <meta property="og:description" :content="meta.description" />
  <meta property="og:image" :content="meta.img" />
  <meta property="og:url" :content="getArticleUrl(url)" />
  <meta name="twitter:card" :content="meta.img" />
</template>

<script>
export default {
  name: "Meta",
  // Your component options here
  props: {
    meta: {
      type: Object,
      required: true
    },
    url: {
      type: String
    }
  },
  methods: {
    getArticleUrl(url) {
      const host = window.location.host;
      if (url) {
        return host + url;
      }
      return host;
    }
  }
};
</script>

<style scoped>
/* Your component styles here */
</style>
