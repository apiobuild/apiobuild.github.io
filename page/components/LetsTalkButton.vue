<template>
  <v-col cols="12" class="pa-0" :md="cols">
    <p class="font-weight-black pb-3" v-if="text">
      {{ text }}
    </p>

    <v-btn
      flat
      block
      size="x-large"
      class="call-to-action-button"
      :href="link"
      target="_blank"
    >
      {{ buttonText }}
    </v-btn>
  </v-col>
</template>

<script setup>
const propos = defineProps({
  text: {
    type: String
  },
  buttonText: {
    type: String,
    default: "Let's Talk"
  },
  cols: {
    type: String,
    default: "12"
  },
  link: {
    type: String,
    default: "https://calendly.com/apiobuild"
  }
});
</script>

<script>
export default {
  name: "LetsTalkButton"
};
</script>

<style scoped>
a {
  color: black;
}
.v-btn.call-to-action-button {
  background-color: rgb(var(--v-theme-primary));
}
</style>
