<template>
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

<script>
export default {
  name: "index"
};
</script>

<style scoped>
/* Add your component styles here */
</style>
