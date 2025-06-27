import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/products': {
        target: 'http://api-gateway-service:3000',
        changeOrigin: true,
      },
      '/orders': {
        target: 'http://api-gateway-service:3000',
        changeOrigin: true,
      }
    }
  }
})
