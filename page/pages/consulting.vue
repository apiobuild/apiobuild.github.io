<template>
  <v-container>
    <Meta :meta="meta" url="/consulting" />
    <ConsultingIntro />
    <ConsultingNextButton
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

<script setup>
// import Intro from "/src/views/Consulting/Intro.vue";
// import Offering from "/src/views/Consulting/Offering.vue";
// import Articles from "/src/views/Consulting/Articles.vue";
// import NextButton from "/src/components/NextButton.vue";
// import Meta from "/src/components/Meta.vue";
</script>

<script>
export default {
  name: "Consulting",
  // Add your component logic here
  data() {
    return {
      meta: {
        title: "ApioX Contulting",
        description:
          "We help you build custom data and AI/ML infrastrucutre and pipelines.",
        img: "/src/assets/images/logo_square.png"
      }
    };
  }
};
</script>

<style scoped>
/* Add your component styles here */
</style>
