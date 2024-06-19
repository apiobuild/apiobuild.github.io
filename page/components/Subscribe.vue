<template>
  <p class="pl-7 pb-0 font-weight-bold">{{ text }}</p>
  <form ref="email" class="form" />
</template>

<script>
export default {
  name: "Subscribe",
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  // Your component's logic goes here
  mounted() {
    const plugin = document.createElement("script");
    plugin.setAttribute(
      "src",
      "https://eocampaign1.com/form/941338f4-23d0-11ef-a26d-8d84b44bc225.js"
    );
    plugin.setAttribute("data-form", "941338f4-23d0-11ef-a26d-8d84b44bc225");
    plugin.async = true;
    this.$refs.email.appendChild(plugin);
  }
};
</script>

<style scoped>
/* Your component's styles go here */
</style>
