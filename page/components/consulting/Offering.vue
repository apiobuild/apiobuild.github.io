<template>
  <v-container>
    <v-row class="p-extra">
      <v-col cols="12" class="pt-15 px-0">
        <span class="text-h3"> How Can We Help? </span>
        <v-row class="pt-15">
          <v-col cols="12" md="6">
            <v-card elevation="3" class="min-height d-flex flex-column">
              <v-card-title class="pt-5 text-wrap">
                Consulting Services
              </v-card-title>
              <v-card-text>
                <p class="text-subtitle-1 py-5">
                  We build software and infrastructure that's ...
                </p>
                <v-list-item v-for="item in emphasize" :key="item">
                  <template v-slot:prepend>
                    <v-icon color="primary-darken-1">
                      fas fa-chevron-right
                    </v-icon>
                  </template>
                  <v-list-item-title class="text-uppercase">
                    {{ item }}
                  </v-list-item-title>
                </v-list-item>
                <p class="text-subtitle-1 py-5">
                  We are always happy to chat and see how we can help streamline
                  your data operations and platform vendors.
                </p>
              </v-card-text>
              <v-card-actions>
                <lets-talk-button />
              </v-card-actions>
            </v-card>
          </v-col>
          <template v-for="item in content" :key="item.name">
            <v-col cols="12" md="6">
              <span class="anchor" :id="item.ref" :ref="item.ref"></span>
              <v-card elevation="3" class="min-height">
                <v-card-title class="pt-5 text-wrap">
                  {{ item.name }}
                </v-card-title>
                <v-card-text>
                  <v-list-item
                    class="pt-5"
                    v-for="_case in item.cases"
                    :key="_case.name"
                  >
                    <template v-slot:prepend>
                      <v-icon
                        color="primary-darken-1"
                        icon="fas fa-chevron-right"
                      />
                    </template>
                    <v-list-item-title class="text-wrap font-weight-black">
                      {{ _case.name }}
                    </v-list-item-title>

                    <MarkdownRenderer :content="_case.description" />
                  </v-list-item>
                </v-card-text>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup></script>

<script>
export default {
  name: "ConsultingOffering",
  // Your component logic goes here
  data() {
    return {
      emphasize: ["Flexible", "Secure", "Scalable", "Cost-Effective"],
      content: [
        {
          name: "Data and AI/ML Infrastructure and Pipeline",
          ref: "data-ai-infra",
          cases: [
            {
              name: "Real-time Fraud Detection Pipeline",
              description:
                "Ingest real-time transactions and user data into AI/ML models to identify fraudulent activity or transactions for banking and financial services. Help businesses reduce financial loss and protect their customers."
            },
            {
              name: "System Monitoring and Alerting",
              description:
                "Create automated system monitoring and alerting to ensure the health and performance of platforms and infrastructure. Implement real-time monitoring and alerting to detect anomalies and potential issues. Improve system uptime and reliability."
            },
            {
              name: "IoT Device Monitoring and Management",
              description:
                "Create real-time analytics and monitoring tools to ensure continuous operation of critical IoT devices. Predict failures trends and schedule proactive maintenance to minimize downtime and enhance operational efficiency."
            }
          ]
        },
        {
          name: "Data and AI/ML Platform Security and Governance",
          ref: "security",
          cases: [
            {
              name: "Data Encryption and Access Control",
              description:
                "Create cost-efficient, scalable, and low-latency end-to-end data encryption solutions for cross-platform data systems. Secure data flow from ingestion and transport to data lakes, AI/ML applications, and customer reporting. Provide key management, access control approval flow, and continuous monitoring to maintain security integrity across your entire data ecosystem."
            },
            {
              name: "Automated Compliance and Governance",
              description:
                "Ensure data systems meet compliance standards and regulations such as ISO-27001 and SOX, as well as privacy requirements such as GDPR and CCPA. Review the existing data system architecture to identify gaps and risks. Implement automated compliance and governance tools, and integrate with CI/CD pipelines to ensure continuous compliance and governance."
            }
          ]
        },
        {
          name: "Cloud and Infrastructure Architecture Design and Migration",
          ref: "cloud-infra",
          cases: [
            {
              name: "Legacy System Modernization and Consolidation",
              description:
                "System design and review of existing legacy systems. Identify areas for modernization and improvement. Define migration and consolidation strategy. Implement cloud-native architecture and migration strategies to improve system performance, scalability, reliability, cost-efficiency and developer productivity."
            },
            {
              name: "Cloud-based Application Development",
              description:
                "Leverage [Apio platform](https://apiobuild.com/platform). We pre-wrap common application components and services, such as user management, data and content management, cross-platform deployment, and usage analytics, to accelerate custom application development. Build cloud-native applications that are scalable, secure, and cost-effective for various business needs such as event sign-ups, case management, e-commerce, and content management applications."
            }
          ]
        }
      ]
    };
  }
};
</script>

<style scoped>
.p-extra {
  padding-bottom: 120px;
}
.min-height {
  min-height: 500px;
}
.v-btn.call-to-action-button {
  background-color: rgb(var(--v-theme-primary));
  min-width: 80%;
}
.anchor {
  display: block;
  position: relative;
  top: -60px;
  visibility: hidden;
}
</style>
