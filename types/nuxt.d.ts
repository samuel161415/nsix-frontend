// types/nuxt.d.ts
import '@nuxt/schema'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    gtm?: {
      id?: string
      enabled?: boolean
      debug?: boolean
    }
  }
}
