import { defineConfig } from 'vite';

// Ajuste base conforme decisão (ver explicação):
// Para site raiz (repo usuario.github.io): base: '/'
const BASE = '/';

export default defineConfig(({ mode }) => ({
  base: BASE,
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: mode === 'development',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  optimizeDeps: {
    include: []
  }
}));
