import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset URLs work both at the GitHub Pages project URL and the custom domain root.
  base: './',
  plugins: [react()],
});
