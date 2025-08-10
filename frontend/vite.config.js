import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "https://daily-life-dairy.onrender.com"
    }
  },
  plugins: [tailwindcss(),react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
  }
})
