import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/wheel-spin-result': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/wheel-spin-result/, '/wheel-spin-result')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
