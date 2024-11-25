// nuxt.config.ts
import type { ModuleOptions as SitemapOptions } from "@nuxtjs/sitemap";
// import { NuxtGtmOptions } from '@zadigetvoltaire/nuxt-gtm'

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["./assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/strapi",
    "@nuxt/image",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    
    // "@zadigetvoltaire/nuxt-gtm",
    // '@nuxtjs/gtm',
  ],

  strapi: {
    url: process.env.STRAPI_URL,
  },
  // site: {
  //   url: 'https://www.template.com',
  //   name: 'Awesome Site',
  //   description: 'Welcome to my awesome site!',
  // },
  i18n: {
    lazy: true,
    langDir: "locales", // Where your language files are stored
    locales: [
      { code: "en", file: "en-US.json", name: "English(en-US)" },
      { code: "fr", file: "fr-FR.json", name: "Français" },
    ],
    defaultLocale: "en",
    strategy: "prefix_except_default", // Only add locale prefix for non-default locale
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      alwaysRedirect: true,
      fallbackLocale: "en",
    },
  },

  image: {
  //  dir: 'assets/images'
  },
  sitemap: <Partial<SitemapOptions>>{
    hostname: "https://www.template.com",
    sources: ["/api/__sitemap__/urls"],
  },
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.template.com',
  },
  runtimeConfig: {
    public: {
      gtm: {
        id: process.env.GTM_ID || 'GTM-444444', // Replace with your GTM ID
        queryParams: {
          gtm_auth: 'AB7cDEf3GHIjkl-MnOP8qr', // Optional
          gtm_preview: 'env-4', // Optional
          gtm_cookies_win: 'x', // Optional
        },
        defer: false, // Load the GTM script after the page load
        compatibility: false, // Set to true if using an older GTM container
        nonce: '', // Optional security attribute
        enabled: true, // Enable GTM in production
        debug: true, // Enable debug mode
        loadScript: true, // Automatically load the GTM script
        enableRouterSync: true, // Track route changes
        ignoredViews: [], // Add pages to ignore if needed
        trackOnNextTick: false, // Trigger tracking in the next tick
        devtools: true, // Enable devtools for debugging
      },
    },
  },
});
