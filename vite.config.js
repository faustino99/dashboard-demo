import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure correct asset paths when hosted at /dashboard-demo/
  base: '/dashboard-demo/',
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
