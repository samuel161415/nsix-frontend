<template>
    <div class="flex items-center justify-center mt-10">
      <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)" class="pagination-button">
        Previous
      </button>
  
      <p>Page {{ currentPage }} of {{ totalPages }}</p>
  
      <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)" class="pagination-button">
        Next
      </button>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    currentPage: Number,
    totalPages: Number
  })
  
  const emit = defineEmits(["update:currentPage"])
  
  function changePage(newPage) {
    emit("update:currentPage", newPage)
  }
  </script>
  
  <style>
  .pagination-button {
    /* Add custom styles as desired */
  }
  </style>
  