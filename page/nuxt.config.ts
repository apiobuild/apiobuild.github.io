// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  // devtools: { enabled: true },

  pages: true,
  build: {
    transpile: ["vuetify"]
  },
  hooks: {
    "vite:extendConfig": (config) => {
      config.plugins.push(vuetify({ autoImport: true }));
    }
  },
  modules: ["@nuxt/content", "nuxt-disqus", "nuxt-gtag", "@nuxtjs/robots"],
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
  app: {
    link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }]
  },
  site: {
    url: "https://apiobuild.com"
  },
  content: {
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
