// server/api/__sitemap__/urls.ts
import { defineSitemapEventHandler } from '#imports'
import type { SitemapUrlInput } from '#sitemap/types'
import Strapi, { StrapiLocale } from "strapi-sdk-js"

interface StrapiPage {
    slug: string;
  }
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337'

export default defineSitemapEventHandler(async () => {
    const strapi = new Strapi({
      url: STRAPI_URL,
      prefix: '/api',
      store: {
        key: 'strapi_jwt',
        useLocalStorage: false,
        cookieOptions: { path: '/' },
      },
    });
    const mainLanguage = 'en';
    const locales: StrapiLocale[] = [mainLanguage, 'fr'];
    const routes: SitemapUrlInput[] = [];
  
    for (const element of locales) {
      let localeSlug = `/${element}`;
      if (element === mainLanguage) {
        localeSlug = '';
      }
  
      
      const blogPage = (await strapi.find('blog-page', { locale: element })) as { data: StrapiPage };
      const blogs = (await strapi.find('blogs', { locale: element })) as { data: StrapiPage[] };
      const home = (await strapi.find('home', { locale: element })) as { data: StrapiPage[] };
      const reference = (await strapi.find('reference-page', { locale: element })) as { data: StrapiPage };
      const privacy = (await strapi.find('privacy-policy-page', { locale: element })) as { data: StrapiPage };
  
      if (blogPage?.data?.slug) {
        routes.push({ loc: `${localeSlug}/${blogPage.data.slug}` });
      }
      blogs?.data?.forEach(blogElement => {
        routes.push({ loc: `${localeSlug}/${blogPage.data.slug}/${blogElement.slug}` });
      });

      if (home?.data) {
        routes.push({ loc: `${localeSlug}` });
      }
      if (reference?.data?.slug) {
        routes.push({ loc: `${localeSlug}/${reference.data.slug}` });
      }
      if (privacy?.data?.slug) {
        routes.push({ loc: `${localeSlug}/${privacy.data.slug}` });
      }
    }
  
    // console.log(routes);
    return routes;
});
  