// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: { enabled: true },

  pages: true,
  build: {
    transpile: ["vuetify", "@nuxtjs/mdc"]
  },
  hooks: {
    "vite:extendConfig": (config) => {
      config.plugins.push(vuetify({ autoImport: true }));
    }
  },
  modules: ["@nuxt/content", "nuxt-disqus", "nuxt-gtag"],
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
