<template>
  <h1 :class="`text-${block.level}xl font-semibold mt-4`">{{ block.children[0].text }}</h1>
</template>

<script setup>
const props = defineProps({
  block: Object
})

</script>
