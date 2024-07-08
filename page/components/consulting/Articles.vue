<template>
  <v-container class="fill-height pt-extra">
    <v-row>
      <v-col cols="12" class="px-0">
        <span class="text-h3">Articles</span>
      </v-col>
      <v-row>
        <ContentList path="/articles" v-slot="{ list }">
          <template v-for="article in sortByDate(list)" :key="article._path">
            <v-col cols="12" md="4" v-if="article.visible != false">
              <v-card :to="{ path: article._path }" class="article">
                <v-img cover :height="image.height" :width="image.width" :src="article.img" />

                <v-card-title class="text-wrap">
                  {{ article.title }}
                </v-card-title>
                <v-card-subtitle>
                  By {{ article.author }} on {{ formatDate(article.date) }}
                </v-card-subtitle>
                <v-card-text>
                  {{ article.description }}
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </ContentList>
        <v-col cols="12" md="4" class="">
          <v-card class="article d-flex flex-column">
            <v-img cover :height="image.height" :width="image.width" :src="Logo" />

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
    </v-row>
  </v-container>
</template>

<script setup>
import Logo from "~/assets/images/logo_square.png";
import moment from "moment";
</script>

<script>
export default {
  name: "ConsultingArticles",
  data() {
    return {
      image: {
        height: "200px",
        width: "100%"
      }
    };
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
  },
  methods: {
    formatDate(date) {
      return moment(date).utc().format("YYYY-MM-DD");
    },
    sortByDate(list) {
      list.sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        }
        if (a.date > b.date) {
          return -1;
        }
        return 0;
      });
      return list;
    }
  }
};
</script>

<style scoped>
/* Add your custom styles here */
a {
  color: black;
}

.pt-extra {
  padding-top: 100px;
}

.article {
  min-height: 420px;
}

@media (min-width: 1024px) {
  .fill-height {
    min-height: 100vh;
  }
}

.fill-height {
  height: 100% !important;
}
</style>
