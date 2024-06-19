<template>
  <v-container ref="services" class="min-fill-height">
    <v-row class="p-extra">
      <span class="text-h4 pb-5">Services</span>
      <v-col
        class="pb-5 px-0"
        cols="12"
        v-for="service in services"
        :key="service.name"
      >
        <Service
          :title="service.title"
          :name="service.name"
          :icon="service.icon"
          :description="service.description"
          :actions="service.actions"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// import Service from "/src/components/Service.vue";
</script>

<script>
export default {
  name: "CompanyServices",
  data() {
    return {
      services: [
        {
          icon: { name: "far fa-window-maximize", color: "info" },
          title: "Software",
          name: "Apio Platform",
          description:
            "Our flagship product, Apio Platform, is a suite of AI-powered tools designed to help small businesses grow and succeed. From customer relationship management to inventory management, Apio Platform offers a range of automation to help you streamline your business operations and boost your bottom line.",
          actions: [
            {
              name: "Docs",
              link: { href: "https://apiobuild.com/docs/" },
              openNew: true
            },
            {
              name: "Demo",
              link: { href: "https://www.youtube.com/watch?v=w9IXo0i1xSE" },
              openNew: true
            },
            {
              name: "Try Now",
              link: { href: "https://telescope.apiobuild.com/" },
              openNew: true,
              accent: true
            }
          ]
        },
        {
          icon: { name: "fas fa-briefcase", color: "primary-darken-1" },
          title: "Tech Consulting",
          name: "ApioX Consulting",
          description:
            "Over a decade of experience in real-time data processing, system monitoring, data lake solutions for analytics, and AI/ML pipelines and integrations. We specialized in system security and governance,  architecture design to meet the ever changing industry compliance and regulatory standards. We implement and optimize large-scale cloud architectures and manage system migrations to improve performance and cost efficiency. Reach out to us for a free consultation to see how we can help with your technology needs.",
          actions: [
            {
              name: "Learn More",
              link: { to: "/consulting" },
              openNew: false
            },
            {
              name: "Book a Consultation",
              link: { href: "https://calendly.com/apiobuild" },
              accent: true,
              openNew: true
            }
          ]
        },
        {
          icon: { name: "fas fa-seedling", color: "secondary" },
          title: "Investment",
          name: "Test Capital",
          description:
            "We focus on partnering with small businesses with untapped potential for technology and AI transformation. If you believe your business could benefit from a technology partner but cannot afford the additional capital to hire external consultants, we'd love to invest in the business as your equity partner. Together, we'll embark on a journey of growth and success, sharing both the risks and rewards along the way.",
          actions: [
            {
              name: "Book a Consultation",
              link: { href: "https://calendly.com/apiobuild" },
              accent: true,
              openNew: true
            }
          ]
        }
      ]
    };
  }
};
</script>

<style scoped>
/* Add your component styles here */
.p-extra {
  padding-top: 120px;
  padding-bottom: 120px;
}
.min-fill-height {
  min-height: 100vh;
}
</style>
