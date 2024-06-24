<template>
  <v-app id="app">
    <Appbar />
    <div class="page">
      <NuxtPage />
    </div>
    <Footer />
  </v-app>
</template>

<style>
.page {
  max-width: 1280px;
  align-self: center;
}
</style>

<script setup lang="ts">
useHead({
  title: () => "apiobuild",
  meta: [
    {
      name: "description",
      content:
        "apiobuild's mission is to create cost-effective technology tailored to the needs of small to medium-sized businesses. Technology is changing rapidly, and we understand that small businesses can struggle to keep up. Our solutions enable your business to grow and adapt to changes with manageable cost and resources while maintaining compliance with the highest industry standards. We strive to be your technology partner, driving your business's success every step of the way."
    },
    {
      name: "og:title",
      content: "apiobuild"
    },
    {
      name: "og:image",
      content: "/images/og_image.png"
    }
  ],
  link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }]
});
</script>
