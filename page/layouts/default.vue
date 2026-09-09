<template>
  <Appbar />
  <div class="page">
    <slot />
  </div>
  <Footer />
</template>

<script>
export default {
  name: "DefaultLayout"
};
</script>

<style>
@media (min-width: 1024px) {
  .page {
    max-width: 1280px;
    align-self: center;
  }
}
</style>
