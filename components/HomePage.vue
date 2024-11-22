<template>
  <div class="min-h-screen flex flex-col justify-center items-center">
    <div class="text-lg">
      <h1 class="text-2xl font-bold">{{ homepage?.data.title }}</h1>
      <p v-if="homepage?.data.metadata">
        <span v-for="(meta, index) in homepage?.data.metadata" :key="index">
          {{ meta.fieldName }}
          <!-- Replace fieldName with actual field in metadata -->
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "#imports";

const { find } = useStrapi();
const localPath = useLocalePath();
const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const homepage = ref(null);
const blogSlug = ref("");

// Reactive data fetching
watchEffect(async () => {
  homepage.value = await find("home", {
    locale: locale.value,
    populate: "metadata",
  });

  const blogResponse = await find("blog-page", { locale: locale.value });
  blogSlug.value = blogResponse?.data?.slug || "blog";

  // Redirect to the appropriate URL based on the locale
  // if (route.path !== "/" && route.path !== `/${locale.value}`) {
  //   if (locale.value !== "en") {
  //     router.push(`/${locale.value}`);
  //   } else {
  //     router.push(`/`);
  //   }
  // }
});

useHead(() => ({
  title: homepage?.value?.data?.metadata[0]?.meta_title || "Default Title",
  meta: [
    {
      name: "description",
      content:
        homepage?.value?.data?.metadata[0]?.meta_description ||
        "Default Description",
    },
    {
      name: "keywords",
      content:
        homepage?.value?.data?.metadata[0]?.meta_keywords ||
        "default, keywords",
    },
    {
      property: "og:title",
      content:
        homepage?.value?.data?.metadata[0]?.meta_title || "Default Title",
    },
    {
      property: "og:description",
      content:
        homepage?.value?.data?.metadata[0]?.meta_description ||
        "Default Description",
    },
    {
      property: "og:image",
      content:
        homepage?.value?.data?.metadata[0]?.og_image?.url ||
        "https://www.template.com/og-image.jpg",
    },
  ],
}));
</script>