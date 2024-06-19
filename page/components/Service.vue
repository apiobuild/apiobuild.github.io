<template>
  <v-card flat color="grey-lighten-4" class="fixed-min-height">
    <v-row>
      <v-col class="px-0 my-auto" cols="12" md="3">
        <div class="text-h1 pa-10" align="center">
          <v-icon :color="icon.color" :icon="icon.name" />
        </div>
      </v-col>
      <v-col class="d-flex flex-column" cols="12" md="9">
        <v-card-title class="pt-10 text-h4 text-wrap">{{ name }} </v-card-title>
        <v-card-subtitle class="text-overline">{{ title }}</v-card-subtitle>
        <v-card-text>{{ description }}</v-card-text>
        <v-spacer />
        <v-card-actions class="mx-3 mb-3">
          <v-row class="justify-end">
            <v-col cols="12" md="4" v-for="action in actions">
              <v-btn
                block
                :variant="action.accent ? null : 'outlined'"
                :class="action.accent ? 'call-to-action-button' : null"
                :key="action.name"
                :to="action.link.to"
                :href="action.link.href"
                :target="action.openNew ? '_blank' : null"
              >
                {{ action.name }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
const props = defineProps({
  title: String,
  name: String,
  description: String,
  actions: Array,
  icon: Object
});
</script>

<script>
export default {
  name: "Service"
  // Your component's JavaScript logic goes here
};
</script>

<style scoped>
.v-btn.call-to-action-button {
  background-color: rgb(var(--v-theme-primary));
  color: black;
}
.fixed-min-height {
  min-height: 300px;
}
</style>
