import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@locales': path.resolve(__dirname, 'locales')
    }
  },
  server: {
    fs: {
      strict: false
    }
  }
});