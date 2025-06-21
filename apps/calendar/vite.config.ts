import path from "path"
import react from "@vitejs/plugin-react"
import federation from "@originjs/vite-plugin-federation"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), federation({
    name: "calendar",
    filename: 'remoteEntry.js',
    exposes: {
      "./App": "./src/App.tsx",
      "./CalendarApp": "./src/CalendarApp.tsx"
    },
    shared: [
      'react',
      'react-dom',
      '@turbo-with-tailwind-v4/database'
    ]
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "@turbo-with-tailwind-v4/design-system",
      '@turbo-with-tailwind-v4/database'
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
        "@turbo-with-tailwind-v4/ui",
        '@turbo-with-tailwind-v4/database'
      ]
    }
  },
  server: {
    port: 3002,
  },
})
