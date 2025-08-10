import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://daily-life-diary.onrender.com', 
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [tailwindcss(),react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
  }
})
