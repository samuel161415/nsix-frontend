// middleware/redirect-en.ts
// import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to) => {
 
  if (to.path === '/en') {
    return navigateTo('/')
  }
})
