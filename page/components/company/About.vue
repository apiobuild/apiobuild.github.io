<template>
  <v-container class="fill-height align-center" ref="about">
    <v-row>
      <v-col cols="12">
        <div class="text-h4 text-start pb-6">About</div>
        <div>
          apiobuild's mission is to create cost-effective technology tailored to
          the needs of small to medium-sized businesses. Technology is changing
          rapidly, and we understand that small businesses can struggle to keep
          up. Our solutions enable your business to grow and adapt to changes
          with manageable cost and resources while maintaining compliance with
          the highest industry standards. We strive to be your technology
          partner, driving your business's success every step of the way.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CompanyAbout"
};
</script>

<style scoped>
.about {
  text-align: center;
  margin-top: 20px;
}
.fill-height {
  height: 100vh !important;
}
</style>
