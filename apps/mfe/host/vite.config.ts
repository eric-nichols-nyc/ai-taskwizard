import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "@turbo-with-tailwind-v4/design-system",
      "@turbo-with-tailwind-v4/ui"
    ]
  },
  build: {
    rollupOptions: {
      external: [
        "@turbo-with-tailwind-v4/design-system",
        "@turbo-with-tailwind-v4/ui"
      ]
    }
  },
  server: {
    port: 3000,
  },
})
