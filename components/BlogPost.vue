<template>
  <main
    class="flex flex-col justify-center items-center mx-auto py-10 pt-[100px] relative w-[100vw]"
  >
    <div
      class="custom-curve absolute z-[-1] h-[40vh] bg-gradient-to-b from-[#4146C1] to-[#447DF3] top-0 w-full"
    >
      <NuxtImg src="svgs/bubbles.svg" />
    </div>

    <!-- Title and Date -->
    <h1 class="text-4xl font-bold text-white">{{ blogPost?.title }}</h1>
    <p class="text-white">{{ formatDate(blogPost?.published_date) }}</p>

    <div class="blog-post mt-[30vh] max-w-6xl md:w-2/3 lg:w-1/2">
      <!-- Cover Image -->
      <NuxtImg
        v-if="blogPost?.cover_image"
        :src="blogPost?.cover_image"
        class="w-full h-64 object-cover mb-5"
        alt="Blog cover image"
      />

      <!-- Render Content Blocks -->
      <div class="content-area mt-5">
        <component
          v-for="(block, index) in blogPost?.content"
          :is="getComponentType(block)"
          :key="index"
          :block="block"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import HeadingBlock from "~/components/HeadingBlock.vue";
import ParagraphBlock from "~/components/ParagraphBlock.vue";

const props = defineProps({
  slug: String,
});

const blogPost = ref(null);
const { locale } = useI18n();
const { find } = useStrapi();
const route = useRoute()

const theWholeRoute = route.params.slug;
const slug = theWholeRoute?.slice(-1)[0] || "";

// console.log("the slug route in the specific post",slug)

// Fetch blog post based on slug and locale, and update SEO metadata
watchEffect(async () => {
  try {
    const response = await find("blogs", {
      filters: { slug: slug },
      locale: locale.value,
      populate: "*",
    });
    // console.log("response of each blog post",response?.data)

    // Ensure response has data and only get the first blog post if available
    if (response.data.length === 0) {
      // console.error("Blog post not found!");
      return;
    }
    

    const attributes = response.data[0];

    // Set blog post data
    blogPost.value = {
      title: attributes.title,
      published_date: attributes.published_date,
      description: attributes.description,
      cover_image: attributes.cover_image
        ? `http://localhost:1337${attributes.cover_image.url}`
        : null,
      content: attributes.content,
      seo_meta: attributes.seo_meta?.[0] || {},
    };
    // Update SEO metadata
    useHead({
      title:
        blogPost.value.seo_meta.meta_title ||
        blogPost.value.title ||
        "Blog Post",
      meta: [
        {
          name: "description",
          content:
            blogPost.value.seo_meta.meta_description ||
            "Default description for blog post",
        },
        {
          name: "keywords",
          content: blogPost.value.seo_meta.meta_keywords || "default, keywords",
        },
        {
          property: "og:title",
          content: blogPost.value.seo_meta.meta_title || blogPost.value.title,
        },
        {
          property: "og:description",
          content:
            blogPost.value.seo_meta.meta_description ||
            "Default description for blog post",
        },
        {
          property: "og:image",
          content:
            blogPost.value.seo_meta.og_image?.url || blogPost.value.cover_image,
        },
      ],
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }
});

// Map content blocks to Vue components
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

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
</script>

<style>
/* Global styles for all Markdown content */
.content-area h1,
.content-area h2,
.content-area h3 {
  font-family: "Inter", sans-serif;
  line-height: 1.6;
  margin: 0;
  font-weight: bold;
  color: black;
  text-align: start;
}
.content-area h1 {
  /* Dark grey color for the title */
  font-size: 2.2em;
}
.content-area h2 {
  /* Lighter grey for subtitles */
  font-size: 1.8em;
  margin-top: 20px;
}

.content-area h3 {
  /* Even lighter grey for sub-subtitles */
  font-size: 1.5em;
  margin-top: 15px;
}
.content-area p {
  color: #777; /* Even lighter grey for sub-subtitles */
  font-size: medium;
  margin-top: 18px;
  font-size: 24px;
}
.gradient-div {
  /* clip-path: polygon(
      0 0, 100% 0,
      100% 85%,
      50% 75%,
      0 85%
    ); */
  position: absolute;
  width: 100%;
  top: 0;
}

.custom-curve {
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 20px),
    50% 100%,
    0 calc(100% - 20px)
  );
}

/* Add more styles for other elements like p, img, a, etc., as needed */
</style>
