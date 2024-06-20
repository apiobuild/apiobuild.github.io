<template>
  <v-container>
    <ConsultingIntro />
    <NextButton
      @click="$refs.cases.$el.scrollIntoView({ behavior: 'smooth' })"
    />
    <ConsultingOffering ref="cases" id="cases" />
    <NextButton
      class="offset-top"
      @click="$refs.articles.$el.scrollIntoView({ behavior: 'smooth' })"
    />
    <ConsultingArticles ref="articles" id="articles" />
  </v-container>
</template>

<script setup></script>

<script>
export default {
  name: "Consulting"
};
</script>

<style scoped>
/* Add your component styles here */
</style>
