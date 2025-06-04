import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@locales': path.resolve(__dirname, 'public/locales')
    }
  },
  base: './',
  build: {
    rollupOptions: {
      external: ['i18next', 'i18next-http-backend', 'i18next-browser-languagedetector']
    }
  },
  server: {
    proxy: {
      '/locales': {
        target: 'http://localhost:5173',
        rewrite: (path) => path.replace(/^\/locales/, '/public/locales')
      }
    }
  }
})
