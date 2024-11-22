<template>
  <div
    class="min-h-screen flex flex-col justify-start items-center md:max-w-6xl px-5 pt-[100px]"
  >
    <div class="text-lg">
      <component
        v-for="(block, index) in referenceContent"
        :is="getComponentType(block)"
        :key="index"
        :block="block"
      />
    </div>
  </div>
</template>

<script setup>
import HeadingBlock from "~/components/HeadingBlock.vue";
import ParagraphBlock from "~/components/ParagraphBlock.vue";

const { find } = useStrapi();
const localPath = useLocalePath();
const { locale, t } = useI18n();

const privacy = ref(null);
const referenceContent = ref([]);

// Reactive data fetching
watchEffect(async () => {
  privacy.value = await find("reference-page", {
    locale: locale.value,
    populate: "metadata",
  });

  referenceContent.value = privacy?.value?.data?.content;
});

useHead(() => ({
  title: privacy?.value?.data?.metadata[0]?.meta_title || "Default Title",
  meta: [
    {
      name: "description",
      content:
        privacy?.value?.data?.metadata[0]?.meta_description ||
        "Default Description",
    },
    {
      name: "keywords",
      content:
        privacy?.value?.data?.metadata[0]?.meta_keywords || "default, keywords",
    },
    {
      property: "og:title",
      content: privacy?.value?.data?.metadata[0]?.meta_title || "Default Title",
    },
    {
      property: "og:description",
      content:
        privacy?.value?.data?.metadata[0]?.meta_description ||
        "Default Description",
    },
    {
      property: "og:image",
      content:
        privacy?.value?.data?.metadata[0]?.og_image?.url ||
        "https://www.template.com/og-image.jpg",
    },
  ],
}));

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
</script>
