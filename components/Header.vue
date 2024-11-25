<template>
  <header class="absolute top-0 left-0 w-full z-30 ">
    <div class="flex justify-between items-center p-6 max-w-7xl mx-auto">
      <!-- Logo/Title -->
      <div class="text-2xl pb-1 font-[600] cursor-pointer">
        <NuxtLink to="/">ToNudge</NuxtLink>
      </div>
      <div class="tabs">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab?.slug"
          :to="localPath(`/${tab.slug}`)"
        >
          <span class="mx-2">
            {{ tab.title }}
          </span>
        </NuxtLink>
      </div>

      <!-- Dropdown Button for Mobile -->
      <div class="lg:hidden">
        <button @click="toggleDropdown" class="focus:outline-none">
        <!-- <NuxtImg v-if="dropdownOpen" format="webp" src="images/close.png" alt="open images" />
        <NuxtImg v-else format="webp" src="images/menu.png" alt="close images" />
         -->
          <img :src="dropdownOpen ? 'images/close.png' : 'images/menu.png'" alt="Menu imga" />
          <!-- <NuxtImg :src="dropdownOpen ? 'images/close.png' : 'images/menu.png'" alt="icon images" /> -->
        </button>
      </div>

      <!-- Navigation Links for Desktop -->
      <nav
        :class="['lg:flex lg:space-x-8', dropdownOpen ? 'block' : 'hidden']"
        class="w-full lg:w-auto"
      >
        <LanguageSwitcher />
      </nav>

      <!-- Install Button -->
      <button
        class="hidden lg:block bg-white py-2 px-4 rounded-lg hover:scale-110"
        v-if="!showContactUs"
      >
        Install Now
      </button>

      <!-- Contact Us Button -->
      <a
        href="mailto:contact@tonudge.com"
        class="hidden lg:block bg-white py-2 px-4 rounded-lg transform transition-all duration-300 ease-in-out hover:scale-110"
        v-if="showContactUs"
      >
        Contact Us
      </a>
    </div>

    <!-- Mobile Dropdown Modal -->
    <div v-if="dropdownOpen" class="fixed inset-0 bg-black/50 z-30 lg:hidden">
      <!-- Header with Title and Close Button -->
      <div class="h-[60vh] bg-white w-full flex flex-col p-5">
        <div class="flex justify-between items-center mb-4">
          <div class="text-3xl font-[600]">ToNudge</div>
          <button
            @click="toggleDropdown"
            class="hover:cursor-pointer focus:outline-none"
          >
            <NuxtImg src="images/close.png" alt="close icon" />
          </button>
        </div>

        <!-- Navigation Links for Mobile -->
        <nav class="flex flex-col space-y-4">
          <LanguageSwitcher />
        </nav>

        <!-- Install Button -->
        <button
          class="my-3 w-full text-blue-500 text-lg font-semibold border border-blue-500 bg-white py-3 px-8 rounded-lg"
        >
          Install Now
        </button>
        <a
          href="mailto:contact@tonudge.com"
          class="my-5 w-full text-blue-500 text-center text-lg font-semibold border border-blue-500 bg-white py-3 px-8 rounded-lg transform transition-all duration-300 ease-in-out hover:scale-110"
        >
          Contact Us
        </a>
      </div>
    </div>
  </header>
</template>

<script setup >
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { ref } from "vue";

const showContactUs = ref(true);
const dropdownOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const { locale } = useI18n();
const { find } = useStrapi();
const localPath = useLocalePath();

const tabs = ref([]);

watchEffect(async () => {
  const homeData = await find("home", { locale: locale.value });
  const blogData = await find("blog-page", {
    locale: locale.value ,
  });
  const privacyata = await find("privacy-policy-page", {
    locale: locale.value ,
  });
  const referenceData = await find("reference-page", {
    locale: locale.value ,
  });


  tabs.value = [
    {
      slug:  "",
      title: homeData?.data?.title || "Home",
    },
    {
      slug: blogData?.data?.slug ,
      title: blogData?.data?.title ,
    },
    {
      slug: privacyata?.data?.slug ,
      title: privacyata?.data?.title ,
    },
    {
      slug: referenceData?.data?.slug ,
      title: referenceData?.data?.title ,
    },

  ];


});
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
