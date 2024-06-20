<template>
  <v-row>
    <v-col cols="12" md="6">
      <LetsTalkButton :text="ctaText" :buttonText="buttonText" />
    </v-col>
    <v-col cols="12" md="6"> <Subscribe :text="subscribeText" /> </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  ctaText: {
    type: String
  },
  subscribeText: {
    type: String
  },
  buttonText: {
    type: String,
    default: "Let's Talk"
  }
});
</script>

<script>
export default {
  name: "LetsTalkAndSubscribe"
  // Your component's JavaScript logic goes here
};
</script>

<style scoped>
/* Your component's CSS styles go here */
</style>
