import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@turbo-with-tailwind-v4/design-system": path.resolve(__dirname, "../../packages/design-system/src"),
    },
  },
})
