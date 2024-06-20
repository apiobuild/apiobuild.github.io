<template>
  <v-card flat rounded="0" class="min-width">
    <v-img cover :src="post.img" v-if="post.img" />
    <v-card-title class="text-h3 text-wrap px-0">
      {{ post.title }}
    </v-card-title>
    <v-card-subtitle class="text-subtitle-1 px-0">
      By
      <a :href="post.authorLink" target="_blank">{{ post.author }}</a> on
      {{ formatDate(post.date) }}
    </v-card-subtitle>
    <v-card-text class="px-0">
      <v-chip-group class="px-0">
        <v-chip v-for="tag in post.tags" :key="tag" class="ma-1" outlined>
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  post: {
    type: Object,
    required: true
  }
});
useSeoMeta({
  title: props.post.title,
  ogTitle: props.post.title,
  description: props.post.description,
  ogDescription: props.post.description,
  ogImage: props.post.img,
  twitterCard: 'summary_large_image',
})
</script>

<script>
import moment from "moment";
export default {
  name: "ArticleHeader",

  methods: {
    formatDate(date) {
      return moment(date).format("YYYY-MM-DD");
    }
  }
};
</script>

<style scoped:>
@media (min-width: 1024px) {

  .min-width {
    min-width: 1024px;
  }
}
</style>
