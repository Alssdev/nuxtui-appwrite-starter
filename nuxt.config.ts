// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/main.css'],

  runtimeConfig: {
    public: {
      appwriteEndpoint: process.env.NUXT_PUBLIC_APPWRITE_ENDPOINT,
      appwriteProjectId: process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID,
      appwriteDBId: process.env.NUXT_PUBLIC_APPWRITE_DATABASE_ID,
    },
  },

  ui: {
    colors: {
      primary: 'blue',
      neutral: 'zinc'
    },
    colorMode: false
  }
})
