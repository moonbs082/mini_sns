import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** GitHub Pages 주소(https://moonbs082.github.io/mini_sns/)에 맞춘 base 경로 */
export default defineConfig({
  plugins: [react()],
  base: '/mini_sns/',
});
