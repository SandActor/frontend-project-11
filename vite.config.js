import { defineConfig } from 'vite'

export default defineConfig({
  base: './',          // Важно для корректных путей
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
