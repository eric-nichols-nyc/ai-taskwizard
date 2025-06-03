import path from "path"
import react from "@vitejs/plugin-react"
import federation from "@originjs/vite-plugin-federation"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), federation({
    name: "dashboard",
    filename: 'remoteEntry.js',
    exposes: {
      "./Dashboard": "./src/Dashboard.tsx",
    },
    shared: ['react', 'react-dom']
  })],
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
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        "@turbo-with-tailwind-v4/design-system",
        "@turbo-with-tailwind-v4/ui"
      ]
    }
  },
  server: {
    port: 3001,
    
  },
})
