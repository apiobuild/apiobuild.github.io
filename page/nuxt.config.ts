// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    // baseURL: "/page-nuxt/"
  },
  pages: true,
  css: [
    "@mdi/font/css/materialdesignicons.min.css",
    "@fortawesome/fontawesome-svg-core/styles.css"
  ],
  build: {
    transpile: ["vuetify"]
  },
  modules: [
    "@nuxt/content",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    }
    //...
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
  components: [
    {
      path: "~/components"
    }
  ]
});
