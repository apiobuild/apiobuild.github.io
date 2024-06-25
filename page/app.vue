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
@media (min-width: 1024px) {
  .page {
    max-width: 1280px;
    align-self: center;
  }
}
</style>

<script setup lang="ts">
const meta = {
  title: "apiobuild",
  description:
    "apiobuild's mission is to create cost-effective technology tailored to the needs of small to medium-sized businesses. Technology is changing rapidly, and we understand that small businesses can struggle to keep up. Our solutions enable your business to grow and adapt to changes with manageable cost and resources while maintaining compliance with the highest industry standards. We strive to be your technology partner, driving your business's success every step of the way.",
  image: "https://apiobuild.com/images/og_image.png"
};
useHead(
  {
    title: () => meta.title,
    meta: [
      {
        property: "og:title",
        content: meta.title
      },
      {
        name: "description",
        property: "og:description",
        content: meta.description
      },
      {
        name: "image",
        property: "og:image",
        content: meta.image
      },
      { name: "twitter:card", content: "summary" }
    ]
  },
  { tagPriority: "critical" }
);

useHead({
  link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }]
});
</script>
