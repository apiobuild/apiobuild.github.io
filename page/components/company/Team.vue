<template>
  <v-container class="d-flex flex-column min-fill-height p-extra">
    <v-row align="center">
      <v-col>
        <div class="text-h4 text-start pb-6">Team</div>
        <v-row>
          <v-col
            cols="12"
            v-for="teamMember in teamMembers"
            :key="teamMember.name"
          >
            <TeamMember
              :name="teamMember.name"
              :title="teamMember.title"
              :tagline="teamMember.tagline"
              :image="teamMember.image"
              :description="teamMember.description"
              :links="teamMember.links"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// import TeamMember from "/src/components/TeamMember.vue";
import LuluProfileImage from "~/assets/team/lulu-profile.png";
</script>

<script>
export default {
  name: "CompanyTeam",
  data() {
    return {
      teamMembers: [
        {
          name: "Lulu Cheng",
          title: "Founder",
          image: LuluProfileImage,
          description:
            "With over a decade of experience as a software engineer, I specialize in designing and implementing data systems. My expertise extends to ensuring security, privacy, compliance, architecting cloud solutions, and developing AI/ML platforms and infrastructure. I have a proven track record in large-scale infrastructure implementation and migration, enabling businesses to transition smoothly in their technology advancement journey. My approach focuses on creating robust, cost-effective solutions that drive innovation and efficiency. By understanding the unique challenges of complex technological landscapes, I help businesses stay ahead of the curve and achieve their strategic goals.",
          links: [
            {
              name: "bio",
              icon: "fa-solid fa-link",
              link: "https://l1990790120.github.io/"
            },
            {
              name: "linkedin",
              icon: "fab fa-linkedin",
              link: "https://www.linkedin.com/in/luluchengengineeratheart/"
            },
            {
              name: "email",
              icon: "fas fa-envelope",
              link: "mailto:luluc@apiobuild.com"
            }
          ]
        }
      ]
    };
  }
  // Add your component logic here
};
</script>

<style scoped>
.p-extra {
  padding-top: 120px;
  padding-bottom: 120px;
}
.min-fill-height {
  min-height: 100vh;
}
</style>
