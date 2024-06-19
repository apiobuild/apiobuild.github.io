<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="12" class="text-h2 py-2 align-center">
        {{ typewriterEffect.text }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "CompanyIntro",
  data() {
    return {
      typewriterEffect: {
        typewriterText: "Hi! We Build Technology for Small Business.",
        text: "", // dynamically typed text
        counter: 0,
        delay: 100
      }
    };
  },
  mounted() {
    this.startTypingEffect();
  },
  methods: {
    startTypingEffect() {
      for (let i = 0; i < this.typewriterEffect.typewriterText.length; i++) {
        setTimeout(() => {
          // append next character
          this.typewriterEffect.text =
            this.typewriterEffect.text +
            this.typewriterEffect.typewriterText[i];
        }, this.typewriterEffect.delay * this.typewriterEffect.counter); // equal delay between characters

        this.typewriterEffect.counter += 1;
      }
    }
  }
};
</script>

<style scoped>
.fill-height {
  height: 95vh !important;
}
.flex-grow-1 {
  flex-grow: 1;
}
</style>
