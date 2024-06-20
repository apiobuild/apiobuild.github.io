// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  // devtools: { enabled: true },
  pages: true,
  build: {
    transpile: ["vuetify", "@nuxtjs/robots", "@nuxtjs/sitemap"]
  },
  hooks: {
    "vite:extendConfig": (config) => {
      config.plugins.push(vuetify({ autoImport: true }));
    }
  },
  modules: [
    "@nuxt/content",
    "nuxt-disqus",
    "nuxt-gtag",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap"
  ],
  vite: {
    ssr: {
      noExternal: ["vuetify"]
    },
    vue: {
      template: {
        transformAssetUrls
      }
    }
  },

  nitro: {
    prerender: {
      // crawlLinks: true
      routes: ["/sitemap.xml"]
    }
  },
  site: {
    url: "https://apiobuild.com",
    name: "apiobuild",
    description:
      "apiobuild's mission is to create cost-effective technology tailored to the needs of small to medium-sized businesses. Technology is changing rapidly, and we understand that small businesses can struggle to keep up. Our solutions enable your business to grow and adapt to changes with manageable cost and resources while maintaining compliance with the highest industry standards. We strive to be your technology partner, driving your business's success every step of the way.",
    defaultLocale: "en"
  },
  content: {
    contentHead: false,
    markdown: {
      mdc: true,
      rehypePlugins: ["rehype-autolink-headings"]
    }
  },
  disqus: {
    shortname: "apiobuild-com"
  },
  gtag: {
    id: "G-K7JYQS9KVF"
  },
  components: [
    {
      path: "~/components"
    }
  ]
});
