// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  target: 'static', // Указываем, что мы создаем статический сайт
  generate: {
    fallback: true, // Позволяет использовать режим SPA для несуществующих страниц
  },
  modules: [
    "nuxt-icon",
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "nuxt-headlessui",
    "@pinia/nuxt"
  ],
  tailwindcss: {
    cssPath: "~/assets/css/tailwind.css",
    config: {
      theme: {
        fontFamily: {
          'poppins': ['Poppins', 'sans-serif'],
          'volkhov': ['Volkhov', 'serif']
        }
      },
      plugins: [
        require('tailwind-scrollbar-hide')
      ]
    }
  },

});
