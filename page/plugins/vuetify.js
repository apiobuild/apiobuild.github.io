import { aliases, fa } from 'vuetify/iconsets/fa'
import { mdi } from "vuetify/lib/iconsets/mdi";

import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'

import 'vuetify/styles'
import "~/assets/css/main.css";

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// import  "~/assets/css/main.css"

// color theme
const lightColorTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    primary: "#FEE600",
    "primary-darken-1": "#fe6700",
    secondary: "#39D2C0",
    "secondary-darken-1": "#3998d2",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
    anchor: "#276a93"
  }
};


export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: "lightColorTheme",
      themes: {
        lightColorTheme
      }
    },
    icons: {
      defaultSet: 'fa',
      aliases,
      sets: {
        mdi,
        fa
      }
    },
    components,
    directives,
  })
  app.vueApp.use(vuetify)
})