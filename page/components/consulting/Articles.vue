<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="12">
        <span class="text-h3">Articles</span>
      </v-col>
      <template v-for="article in articles" :key="article.path">
        <v-col cols="12" md="4" v-if="article.meta.visible != false">
          <v-card :to="{ path: 'articles/' + article.path }" class="article">
            <v-img cover :src="article.meta.img" class="article-img" />
            <v-card-title class="text-wrap">
              {{ article.meta.title }}
            </v-card-title>
            <v-card-subtitle>
              By {{ article.meta.author }} on {{ article.meta.date }}
            </v-card-subtitle>
            <v-card-text>
              {{ article.meta.description }}
            </v-card-text>
          </v-card>
        </v-col>
      </template>
      <v-col cols="12" md="4">
        <v-card class="article d-flex flex-column">
          <v-img contain :src="Logo" class="article-img" />
          <v-card-title>Learn more?</v-card-title>
          <v-card-text>
            We are always up for a chat to learn about your data and AI/ML
            problems.
          </v-card-text>
          <v-card-actions class="mt-auto">
            <lets-talk-button />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import LetsTalkButton from "/src/components/LetsTalkButton.vue";
import Logo from "/src/assets/images/logo_square.png";
import { routes } from "vue-router/auto-routes";
</script>

<script>
export default {
  name: "ConsultingArticles",
  data() {
    return {};
  },
  computed: {
    articles() {
      const filtered = routes.filter((route) => route.path === "/articles");
      if (filtered.length === 0) {
        return [];
      }
      const articles = filtered[0];
      return articles.children;
    }
  }
};
</script>

<style scoped>
/* Add your custom styles here */
a {
  color: black;
}
.article {
  min-height: 400px;
}
.article-img {
  height: 180px;
}

@media (min-width: 1024px) {
  .fill-height {
    min-height: 100vh;
  }
}

.fill-height {
  height: max-content !important;
}
</style>
