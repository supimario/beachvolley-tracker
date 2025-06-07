import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    historyApiFallback: true // 👈 THIS is the key for React Router
  },
  build: {
    outDir: 'dist'
  }
})
