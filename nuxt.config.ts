import { env } from 'node:process'
import { appDescription } from './app/constants/index'

export default defineNuxtConfig({

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    'arco-design-nuxt-module',
  ],
  ssr: false,
  imports: {
    dirs: [
      'composables/PolygonLink/**',
      'composables/*',
    ],
  },
  devtools: {
    enabled: false,
  },

  app: {
    baseURL: '/csafetybst/riskpic/',
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: 'white' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#222222' },
      ],
    },
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },

  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  compatibilityDate: '2024-08-14',
  vite: {
    server: {
      proxy: {
        '/safedatapushboshite': {
          target: env.NUXT_VITE_SERVER_PROXY_TARGET,
          ws: true,
          changeOrigin: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        'fabric',
        'mitt',
        'nanoid',
        'axios',
        '@arco-design/web-vue/es/table/index',
        '@arco-design/web-vue/es/modal/index',
        '@arco-design/web-vue/es/table/style/css.js',
        '@arco-design/web-vue/es/modal/style/css.js',
        '@arco-design/web-vue/es/message/style/css.js',
        '@arco-design/web-vue/es',
        '@arco-design/web-vue/es/radio/index',
        '@arco-design/web-vue/es/radio/style/css.js',
      ],
    },
  },

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

})
