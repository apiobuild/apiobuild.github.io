<template>
  <Meta :meta="meta" />
  <v-container class="py-0">
    <CompanyIntro />
    <NextButton
      @click="$refs.about.$el.scrollIntoView({ behavior: 'smooth' })"
    />
    <CompanyAbout ref="about" id="about" />
    <NextButton
      @click="$refs.services.$el.scrollIntoView({ behavior: 'smooth' })"
    />
    <CompanyServices ref="services" id="service" />
    <NextButton
      @click="$refs.team.$el.scrollIntoView({ behavior: 'smooth' })"
    />
    <CompanyTeam ref="team" id="team" />
  </v-container>
</template>

<script setup>
// import Intro from "/components/Company/Intro.vue";
// import About from "/src/views/Company/About.vue";
// import Services from "/src/views/Company/Services.vue";
// import Team from "/src/views/Company/Team.vue";
// import NextButton from "/src/components/NextButton.vue";
// import Meta from "/src/components/Meta.vue";
</script>

<script>
export default {
  name: "IntroPage",
  // Add your component logic here
  data() {
    return {
      meta: {
        title: "apiobuild",
        description:
          "apiobuild's mission is to build technology for small business.",
        img: "/src/assets/images/logo_square.png"
      }
    };
  }
};
</script>

<style scoped>
/* Add your component styles here */
</style>
