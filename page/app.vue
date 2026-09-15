<template>
  <v-app id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

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

// The podcast page carries its own mark instead of the site-wide one --
// route-based here rather than the page overriding this tag, since two
// separate useHead calls registering the same rel="icon" left it up to
// dedupe/priority ordering between a root-level and a page-level call,
// which didn't resolve the way the tagPriority pattern above does for
// meta tags. A single reactive href sidesteps that ambiguity entirely.
const route = useRoute();
useHead({
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: () => (route.path.startsWith("/podcast") ? "/images/podcast-favicon.png" : "/favicon.png")
    }
  ]
});
</script>
