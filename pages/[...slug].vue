<template>
  <div>
    <div v-if="loading" class="min-h-screen flex justify-center items-center">
      <!-- You can replace this with a loading spinner or any other loading indicator -->
      <p>Loading...</p>
    </div>
    <div v-else>
      <div
        v-if="!componentName"
        class="min-h-screen flex justify-center items-center"
      >
        <HomePage />
      </div>
      <component v-else :is="componentName" />
    </div>
  </div>
</template>

<script setup>
import BlogPage from "~/components/BlogPage.vue";
import PrivacyPolicyPage from "~/components/PrivacyPolicyPage.vue";
import HomePage from "~/components/HomePage.vue";
import BlogPost from "~/components/BlogPost.vue";
import ReferencePage from "~/components/ReferencePage.vue";

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();

const componentName = shallowRef(null);
const loading = ref(true);
const oldLocale = useOldLocale();

watchEffect(async () => {
  loading.value = true;
  const theWholeRoute = route.params.slug || [];
  
  const slugToComponentMap = await usePageComponent(locale.value);
  const oldSlugToComponentMap = await usePageComponent(oldLocale.value);

  let component = null;

  // checking all slugs if they are valid or not
  for (const slug of theWholeRoute) {
    component = slugToComponentMap[slug] || oldSlugToComponentMap[slug];
    if (!component) break;
  }

//  if no matching component, redirect to homepage
  if (!component) {
    componentName.value = HomePage;
    if (locale.value !== "en") {
      await router.push(`/${locale.value}`);
    } else {
      await router.push(`/`);
    }
  } else {
    switch (component) {
      case "BlogPost":
        componentName.value = BlogPost;
        break;
      case "BlogPage":
        componentName.value = BlogPage;
        break;
      case "LegalNoticePage":
        componentName.value = LegalNoticePage;
        break;
      case "PrivacyPolicyPage":
        componentName.value = PrivacyPolicyPage;
        break;
      case "ReferencePage":
        componentName.value = ReferencePage;
        break;
      default:
        componentName.value = HomePage;
        if (locale.value !== "en") {
          await router.push(`/${locale.value}`);
        } else {
          await router.push(`/`);
        }
    }
  }
  loading.value = false;
});
</script>