import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Crucial for Electron/Offline builds to locate assets via relative paths
  server: {
    open: false, // Let Electron handle the window opening
    port: 5173,
    strictPort: true,
  }
});