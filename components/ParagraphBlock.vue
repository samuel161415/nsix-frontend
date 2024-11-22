<template>
  <p class="text-lg leading-relaxed mt-2  mb-5">{{ block.children[0].text }}</p>
</template>

<script setup>
const props = defineProps({
  block: Object,
});
</script>
