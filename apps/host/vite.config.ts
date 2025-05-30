import path from "path"
import react from "@vitejs/plugin-react"
import federation from "@originjs/vite-plugin-federation"
import { defineConfig } from "vite"

// https://vite.dev/config/
const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'preview';
const dashboardRemote = isDev
  ? 'http://localhost:3001/assets/remoteEntry.js'
  : 'https://ai-taskmaster-dashboard.vercel.app/assets/remoteEntry.js';
const calendarRemote = isDev
  ? 'http://localhost:3002/assets/remoteEntry.js'
  : 'https://ai-taskmaster-calendar-2.vercel.app/assets/remoteEntry.js';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      remotes: {
        dashboard: dashboardRemote,
        calendar: calendarRemote
      },
      shared: ['react', 'react-dom']
    })
  ],
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
    sourcemap: true,
    rollupOptions: {
      external: [
        "@turbo-with-tailwind-v4/design-system",
        "@turbo-with-tailwind-v4/ui"
      ]
    }
  },
  server: {
    port: 3000,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  },
})
