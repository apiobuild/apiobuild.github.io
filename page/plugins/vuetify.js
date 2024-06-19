// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

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
    components,
    directives,
  })
  app.vueApp.use(vuetify)
})