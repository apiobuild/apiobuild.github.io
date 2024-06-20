<template>
  <v-app-bar variant="flat" color="primary">
    <v-toolbar-title class="logo">
      <RouterLink to="/" class="logo"> apiobuild </RouterLink>
    </v-toolbar-title>
    <v-spacer />

    <v-app-bar-nav-icon
      color="black"
      icon="fas fa-bars"
      @click.stop="drawer = !drawer"
      v-if="!mdAndUp"
    />
    <template v-else>
      <v-list-item
        class="py-0 fill-height"
        v-for="item in items"
        :key="item.name"
        :to="item.link.to"
        :href="item.link.href"
        :target="item.link.openNew ? '_blank' : null"
      >
        {{ item.name }}
      </v-list-item>
    </template>
  </v-app-bar>

  <v-navigation-drawer location="right" temporary v-model="drawer">
    <v-list class="px-0" nav>
      <template v-for="item in items" :key="item.name">
        <v-list-group class="px-0" :value="item.name" v-if="item.links">
          <template v-slot:activator="{ props }">
            <v-list-item rounded="0" v-bind="props">
              <v-list-item-title class="py-3 text-subtitle-1">
                {{ item.name }}
              </v-list-item-title>
              <template v-slot:append>
                {{ item.link.hash }}
                <v-btn
                  icon="fas fa-caret-down"
                  size="small"
                  variant="text"
                ></v-btn>
              </template>
            </v-list-item>
          </template>

          <v-row class="py-3">
            <v-col class="item-group-div py-0" cols="12">
              <v-list-item
                class="text-subtitle-1"
                v-for="link in item.links"
                :key="link.name"
                :to="{ path: link.link.path, hash: link.link.hash }"
                :href="link.link.href"
                :active="false"
                :target="item.link.openNew ? '_blank' : null"
              >
                {{ link.name }}
              </v-list-item>
            </v-col>
          </v-row>
        </v-list-group>
        <template v-else>
          <v-row class="py-3">
            <v-col class="py-0" cols="12">
              <v-list-item
                class="text-subtitle-1"
                rounded="0"
                :href="item.link.href"
                :to="item.link.to"
                :target="item.link.openNew ? '_blank' : null"
              >
                {{ item.name }}
              </v-list-item>
            </v-col>
          </v-row>
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
const { mdAndUp } = useDisplay();
</script>

<script>
export default {
  name: "Appbar",
  // Add your component options here
  data() {
    return {
      drawer: false,
      items: [
        {
          name: "Company",
          link: { to: "/" },
          links: [
            {
              name: "About",
              link: { path: "/", hash: "#about" }
            },
            {
              name: "Services",
              link: { path: "/", hash: "#service" }
            },
            {
              name: "Team",
              link: { path: "/", hash: "#team" }
            }
          ]
        },
        {
          name: "Platform",
          link: { href: "https://apiobuild.com/platform", openNew: true }
        },
        {
          name: "Consulting",
          link: { to: "/consulting" },
          links: [
            {
              name: "How Can We Help?",
              link: { path: "/consulting", hash: "#cases" }
            },
            {
              name: "Data and AI/ML Infrastructure",
              link: { path: "/consulting", hash: "#data-ai-infra" }
            },
            {
              name: "Data and AI/ML Security",
              link: { path: "/consulting", hash: "#security" }
            },
            {
              name: "Cloud Infrastructure",
              link: { path: "/consulting", hash: "#cloud-infra" }
            }
          ]
        },
        {
          name: "Articles",
          link: { to: "/articles" }
        }
      ]
    };
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap");

.logo {
  font-family: "Comfortaa", cursive;
  text-align: justify;
}
.item-group-div {
  background-color: #f5f5f5;
}
a {
  color: black;
}
</style>
