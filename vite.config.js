import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves this project below /zhechun333/, not at the domain root.
  base: '/zhechun333/',
  plugins: [react()],
});
