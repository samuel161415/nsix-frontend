export async function usePageComponent(locale) {
  const { find } = useStrapi();

  // Fetch data to map slugs to components
  const [blogs, blogPage, legalNoticePage, privacyPolicyPage, referencePage] =
    await Promise.all([
      find("blogs", { locale }), // Collection type
      find("blog-page", { locale }), // Single type
      find("legal-notice-page", { locale }), // Single type
      find("privacy-policy-page", { locale }), // Single type
      find("reference-page", { locale }), // Single type
    ]);

  // Map slugs to their corresponding components
  const slugToComponentMap = {};

  // Map collection type slugs
  blogs?.data?.forEach((item) => {
    slugToComponentMap[item.slug] = "BlogPost";
  });

  // Map single type slugs
  if (blogPage?.data?.slug) {
    slugToComponentMap[blogPage.data.slug] = "BlogPage";
  }
  if (legalNoticePage?.data?.slug) {
    slugToComponentMap[legalNoticePage.data.slug] = "LegalNoticePage";
  }
  if (privacyPolicyPage?.data?.slug) {
    slugToComponentMap[privacyPolicyPage.data.slug] = "PrivacyPolicyPage";
  }
  if (referencePage?.data?.slug) {
    slugToComponentMap[referencePage.data.slug] = "ReferencePage";
  }

  return slugToComponentMap;
}
