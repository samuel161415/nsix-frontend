import { defineEventHandler, getRequestURL, sendRedirect } from "h3";
import Strapi from "strapi-sdk-js";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export default defineEventHandler(async (event) => {
  const urlObj = getRequestURL(event); // Get the current URL
  const currentPath = urlObj.pathname;

  // Ignore Nuxt error routes
  if (currentPath.startsWith("/__nuxt_error")) return;

  // Initialize Strapi client
  const strapi = new Strapi({
    url: STRAPI_URL,
    prefix: "/api",
    store: {
      key: "strapi_jwt",
      useLocalStorage: false,
      cookieOptions: { path: "/" },
    },
  });

  try {
    // Fetch all redirect rules from Strapi
    const { data: redirects } = await strapi.find("redirects", {
    //   filters: { enabled: true },
    });

    // Create a map of redirect rules
    const redirectMap = redirects.reduce((map, item) => {
      map[item.redirectFrom] = item.redirectTo;
      return map;
    }, {});

    // Split the current path into slugs
    const slugs = currentPath.split("/").filter(Boolean);

    // Replace slugs in the path using redirect rules
    const newSlugs = slugs.map((slug) => redirectMap[slug] || slug);
    const newPath = `/${newSlugs.join("/")}`;

    // Perform a 301 redirect if the path has changed
    if (newPath !== currentPath) {
      await sendRedirect(event, newPath, 301);
    }
  } catch (error) {
    console.error("Error fetching redirects from Strapi:", error);
  }
});
