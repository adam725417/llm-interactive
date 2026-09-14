import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'game',
  base: './',
  build: {
    outDir: '../_game_dist',
    emptyOutDir: true,
  },
})
