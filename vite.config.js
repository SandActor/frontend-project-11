import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
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
