<template>
  <span v-html="render(content)"></span>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import iterator from "markdown-it-for-inline";

const props = defineProps({
  content: {
    type: String,
    required: true
  }
});

const md = MarkdownIt();

md.use(iterator, "url_new_win", "link_open", function (tokens, idx) {
  tokens[idx].attrSet("target", "_blank");
});

function render(content) {
  return md.render(content);
}
</script>

<script>
export default {
  name: "MarkdownRenderer"
};
</script>

<style scoped>
/* Add your component styles here */
</style>
