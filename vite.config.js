import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/goit-advancedjs-hw-04/',
  define: {
    global: 'globalThis',
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
