<script setup>

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { property: 'og:title', content: `order Form ` },
    { name: 'description', content: 'Order Form is new test form' },
    { property: 'og:url', content: 'https://testform.kornevgmbh.com/' }
  ],
  title: `Order Form`,
})
</script>

<template>
  <main class="max-w-8xl">
    <slot/>
  </main>
</template>
