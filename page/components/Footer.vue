<template>
  <v-footer color="primary" class="pa-10">
    <v-row class="full-width no-gutter">
      <v-col cols="12" md="3" class="text-start white--text">
        <p class="text-h6 ml-1 font-weigiht-black">Get In Touch</p>
        <Subscribe />
      </v-col>
      <v-col cols="8" class="pl-0">
        <v-row>
          <v-spacer />
          <v-col
            cols="12"
            md="3"
            v-for="directory in directories"
            :key="directory.name"
          >
            <v-list-item>
              <v-list-item-title class="text-h6 pb-5">
                <span class="font-weight-black"> {{ directory.name }} </span>
              </v-list-item-title>
              <v-list-item
                class="px-0"
                v-for="link in directory.links"
                :key="link.name"
                :to="link.link.to"
                :href="link.link.href"
                :target="link.link.openNew ? '_blank' : null"
                :active="false"
              >
                {{ link.name }}
              </v-list-item>
            </v-list-item>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" class="text-center pb-5">
        <v-list-item>
          <div>
            <v-btn
              variant="text"
              v-for="social in socials"
              :key="social.name"
              :href="social.link"
              target="_blank"
              icon
            >
              <v-icon>{{ social.icon }}</v-icon>
            </v-btn>
          </div>
        </v-list-item>
        <span class="text-subtitle-1"> Made by 🦌 in 🗽 </span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup></script>

<script>
export default {
  name: "Footer",
  // Your component's logic goes here
  data() {
    return {
      directories: [
        {
          name: "Company",
          links: [
            {
              name: "About",
              link: { to: { path: "/", hash: "#about" } },
            },
            {
              name: "Services",
              link: { to: { path: "/", hash: "#service" } },
            },
            {
              name: "Team",
              link: { to: { path: "/", hash: "#team" } },
            },
          ],
        },
        {
          name: "Service",
          links: [
            {
              name: "Platform",
              link: { href: "https://apiobuild.com/platform", openNew: true },
            },
            { name: "Consulting", link: { to: { path: "/consulting" } } },
            {
              name: "Articles",
              link: { to: { path: "/articles" } },
            },
          ],
        },
        {
          name: "Legal",
          links: [
            {
              name: "Privacy Policy",
              link: { to: { path: "/articles/privacy-policy" } },
            },
            {
              name: "Terms of Service",
              link: { to: { path: "/articles/terms-of-service" } },
            },
          ],
        },
      ],
      socials: [
        {
          name: "linkedin",
          link: "https://www.linkedin.com/company/apiobuild/",
          icon: "fab fa-linkedin",
        },
        {
          name: "youtube",
          link: "https://www.youtube.com/apiobuild",
          icon: "fab fa-youtube",
        },
        {
          name: "email",
          link: "mailto:support@apiobuild.com",
          icon: "fas fa-envelope",
        },
        {
          name: "instagram",
          link: "https://www.instagram.com/apiobuild",
          icon: "fab fa-instagram",
        },
      ],
    };
  },
};
</script>

<style scoped>
.form {
  max-width: 300px;
}
.full-width {
  width: 100vw;
}
a {
  color: black;
}
</style>
