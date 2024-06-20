<template>
  <v-container class="fill-height fill-width">
    <v-row class="fill-width my-auto">
      <v-col cols="12" md="8" class="text-left my-auto pl-0">
        <span class="text-h3 text-md-h1 logo">
          <v-avatar :size="mdImageSize" v-if="!mdAndUp">
            <img
              :width="mdImageSize"
              src="~/assets/consulting/luluc-profile.png"
            />
          </v-avatar>
          <p class="text-uppercase">ApioX Consulting</p>
        </span>
      </v-col>

      <v-col cols="12" md="4" v-if="mdAndUp">
        <v-avatar :size="largeImageSize">
          <img
            :width="largeImageSize"
            src="~/assets/consulting/luluc-profile.png"
          />
        </v-avatar>
      </v-col>
      <v-col cols="12" md="6" class="px-0">
        <v-card flat class="px-0">
          <v-card-text class="px-0 text-h6">
            Do you have data and AI/ML infrastrucutre and pipelines that's not
            quite meeting your business needs?
          </v-card-text>
          <v-card-actions class="px-0">
            <lets-talk-button />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";

const { mdAndUp } = useDisplay();
</script>

<script>
export default {
  name: "ConsultingIntro",
  // Add your component logic here
  data() {
    return {
      largeImageSize: 300,
      mdImageSize: 50
    };
  }
};
</script>

<style scoped>
/* Add your component styles here */

.fill-height {
  height: 100vh !important;
}
.fill-width {
  width: 100% !important;
}
.logo {
  font-family: "Comfortaa", cursive;
  text-align: justify;
}
</style>
