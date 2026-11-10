import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    // Loopback only: the dev server is never reachable from the local network.
    // Use `npm run dev -- --host` deliberately if you need to share it.
    host: '127.0.0.1',
    port: 5173,
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        // CodeMirror and sql-formatter are the bulk of the bundle and change
        // far less often than app code, so splitting them keeps the vendor
        // chunks cached across deploys.
        manualChunks: {
          editor: ['@uiw/react-codemirror', '@codemirror/lang-sql'],
          formatter: ['sql-formatter'],
          grid: ['react-window', 'react-csv'],
        },
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/**/*.test.{js,jsx}', 'src/test/**', 'src/main.jsx', 'src/data/**'],
    },
  },
});
