<template>
  <div class="language-switcher">
    <select
      v-model="selectedLocale"
      @change="changeLanguage"
      class="p-1 rounded border"
    >
      <option v-for="loc in locales" :key="loc.code" :value="loc.code">
        {{ loc.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const route = useRoute();
const router = useRouter();

const localizedSlugs = ref({});
const oldLocale = useOldLocale();
const selectedLocale = ref(locale.value); // Separate variable for v-model

watchEffect(async () => {
  localizedSlugs.value = await usePageComponent(locale.value);
});

async function changeLanguage() {
  oldLocale.value = locale.value; // Set the old locale global state
  const newLocale = selectedLocale.value; // Use selectedLocale for the new locale
  locale.value = newLocale; // Update the locale

  
  const slugs = route.params.slug || [];
  const newSlugs = await Promise.all(
    slugs.map(async (slug) => {
      const componentType = localizedSlugs.value[slug] || "";  // to get the current Content Type based on the current slug before language change
      return await useLocalizedSlug(componentType, newLocale);
    })
  );
  
  const path = switchLocalePath(newLocale);

  if (path) {
    if (newSlugs) {
      const pathSegments = path.split("/");
      pathSegments.splice(-slugs.length, slugs.length, ...newSlugs);
      const newPath = pathSegments.join("/");
      await router.push(newPath);
    } else {
      await router.push(path);
    }
  }
}
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}
</style>
