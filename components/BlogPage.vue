<template>
  <main
    class="container mx-auto py-10 pt-[100px] min-h-screen flex flex-col justify-between md:max-w-6xl px-5"
  >
    <div class="w-fll">
      <component
        v-for="(block, index) in blogPage?.content"
        :is="getComponentType(block)"
        :key="index"
        :block="block"
        :class="widthContianer"
        
      />
      <PostList :posts="paginatedPosts" />
    </div>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:currentPage="updateCurrentPage"
    />
  </main>
</template>

<script setup>
import PostList from "~/components/PostList.vue";
import Pagination from "~/components/Pagination.vue";
import HeadingBlock from "~/components/HeadingBlock.vue";
import ParagraphBlock from "~/components/ParagraphBlock.vue";

const posts = ref([]);
const currentPage = ref(1);
const postsPerPage = 6;
const totalPages = ref(1);
const blogPage = ref();

const route = useRoute();
const { locale } = useI18n();
const { find } = useStrapi();

// Define the base URL of your Strapi server
const strapiBaseURL = "http://localhost:1337";
// Watch for changes in locale and fetch blog posts accordingly
watchEffect(async () => {
  try {
    const blogPageResponse = await find("blog-page", {
      locale: locale.value,
      populate: "*",
    });
    blogPage.value = blogPageResponse?.data;

    const response = await find("blogs", {
      locale: locale.value,
      populate: "*",
      pagination: {
        page: currentPage.value,
        pageSize: postsPerPage,
      },
    });

    totalPages.value = response.meta.pagination.pageCount;

    // Transform posts data
    posts.value = response.data.map((post) => {
      const seoMeta = post.seo_meta?.[0] || {};
      return {
        title: post.title, // Using "Title" as returned by Strapi
        slug: post.slug,
        description: post.description,
        image: post.cover_image
          ? `${strapiBaseURL}${post.cover_image.url}`
          : null,
        date: post.createdAt,
        seo_meta: {
          meta_title: seoMeta.meta_title,
          meta_description: seoMeta.meta_description,
          meta_keywords: seoMeta.meta_keywords,
        },
      };
    });

    // Apply SEO metadata for the first post or use defaults
    const firstPostMeta = blogPage.value?.metadata[0] || {};
    useHead({
      title: firstPostMeta.meta_title || "Default Blog Page Title",
      meta: [
        {
          name: "description",
          content:
            firstPostMeta.meta_description || "Default Blog Page Description",
        },
        {
          name: "keywords",
          content: firstPostMeta.meta_keywords || "default, keywords",
        },
        {
          property: "og:title",
          content: firstPostMeta.meta_title || "Default Blog Page Title",
        },
        {
          property: "og:description",
          content:
            firstPostMeta.meta_description || "Default Blog Page Description",
        },
        {
          property: "og:image",
          content:
            firstPostMeta?.og_image?.url ||
            "https://www.template.com/og-image.jpg",
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }
});

// Paginate posts based on current page
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = currentPage.value * postsPerPage;
  return posts.value.slice(start, end);
});

// Update the current page when pagination changes
function updateCurrentPage(newPage) {
  currentPage.value = newPage;
}

function getComponentType(block) {
  switch (block.type) {
    case "heading":
      return HeadingBlock;
    case "paragraph":
      return ParagraphBlock;
    default:
      return "div";
  }
}
const widthContianer = computed(()=>{
  const postCount = paginatedPosts.value.length;
  if(postCount >2) return 'w-full'
  else if(postCount === 2) return 'w-2/3 mx-auto'
  else return 'w-1/3 mx-auto'
})
</script>
