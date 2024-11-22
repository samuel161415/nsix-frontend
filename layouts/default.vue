<template>
  <main class="flex-grow relative z-10 bg-white min-h-screen">
    <Header />
    <slot />
  </main>
</template>

<script setup>
import Header from "~/components/Header.vue";
</script>
