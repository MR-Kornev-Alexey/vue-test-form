<script setup>

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { property: 'og:title', content: `Kanban` },
    { name: 'description', content: 'Kanban is new table kanban ' },
    { property: 'og:url', content: 'https://kanban.kornevgmbh.com/' }
  ],
  title: `Kanban`,
})
</script>

<template>
  <main class="max-w-8xl">
    <slot/>
  </main>
</template>
