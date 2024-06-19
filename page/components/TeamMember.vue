<template>
  <v-card variant="outlined">
    <v-row class="fixed-min-height py-5 px-5">
      <v-col cols="12" md="4" class="py-5 my-auto justify-center text-center">
        <v-avatar :size="imageSize">
          <img :width="imageSize" :src="image" />
        </v-avatar>
        <v-list-item>
          <v-list-item-title class="text-h5">{{ name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ title }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item>
          <v-card-actions class="justify-center">
            <v-btn
              variant="outlined"
              v-for="link in links"
              :icon="link.icon"
              :key="link.name"
              :href="link.link"
              target="_blank"
            />
          </v-card-actions>
        </v-list-item>
      </v-col>

      <v-col class="d-flex flex-column my-auto" cols="12" md="8">
        <div class="my-auto">
          <span v-html="description" />
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const props = defineProps({
  name: String,
  title: String,
  tagline: String,
  image: String,
  description: String,
  links: Array
});
</script>
<script>
export default {
  name: "TeamMember",
  // Add your component's logic here
  data() {
    return {
      imageSize: 150
    };
  }
};
</script>

<style scoped>
.fixed-min-height {
  min-height: 250px;
}
</style>
