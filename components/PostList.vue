<template>
  <div :class="gridClass" class="">
    <div
      v-for="(post, index) in posts"
      :key="post.slug"
      class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <NuxtLink :to="getPostUrl(post.slug)" @click="setSelectedPostIndex(index)">
        <NuxtImg
          :src="post.image || '/assets/images/default-blog.jpg'"
          alt="Blog Post"
          class="w-full h-64 object-cover"
          width="400"
          height="256"
        />
        <div class="p-4">
          <h2 class="text-primary font-semibold text-2xl">{{ post.title }}</h2>
          <p class="text-gray-500">{{ formatDate(post.date) }}</p>
          <p class="text-gray-700">{{ post.description || 'No description available.' }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLocalePath } from "#imports";

const props = defineProps({
  posts: Array
});

const localePath = useLocalePath();
const route = useRoute()
const selectedPostIndex = useSelectedPostIndex()

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const gridClass = computed(() => {
  const postCount = props.posts.length;
  if (postCount > 2) {
    return 'grid md:grid-cols-2 lg:grid-cols-3 gap-10 w-full';
  } else if (postCount === 2) {
    return 'grid grid-cols-1 md:grid-cols-2 gap-10 lg:w-2/3 mx-auto';
  } else {
    return 'grid grid-cols-1 gap-6 w-1/3 mx-auto';
  }
});

const getPostUrl = (slug) => {
  const blogSlug = route.params.slug[0] // Adjust this based on your blog page slug
  return `${blogSlug}/${slug}`;
};

const setSelectedPostIndex = (index) => {
  selectedPostIndex.value = index;
};

</script>