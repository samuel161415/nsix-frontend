// composables/useLocalizedSlug.js



export async function useLocalizedSlug(componentType, locale) {
  const { find } = useStrapi();
  const selectedPostIndex = useSelectedPostIndex()
  let response;
  switch (componentType) {
    case "BlogPage":
      response = await find("blog-page", { locale });
      return response?.data?.slug || "";
    case "LegalNoticePage":
      response = await find("legal-notice-page", { locale });
      return response?.data?.slug || "";
    case "PrivacyPolicyPage":
      response = await find("privacy-policy-page", { locale });
      return response?.data?.slug || "";
    case "ReferencePage":
      response = await find("reference-page", { locale });
      return response?.data?.slug || "";
    case "BlogPost":
      response = await find("blogs", { locale });
      return response?.data?.[selectedPostIndex?.value]?.slug || ""; // Assuming you want the first blog post slug
    default:
      return "";
  }
}