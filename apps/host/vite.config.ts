import path from "path"
import react from "@vitejs/plugin-react"
import federation from "@originjs/vite-plugin-federation"
import { defineConfig, loadEnv } from "vite"

console.log('Loaded env:', process.env);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Explicitly load the env file for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  console.log('Loaded env:', env);

  if (!env.VITE_DASHBOARD_REMOTE || !env.VITE_CALENDAR_REMOTE) {
    throw new Error('Missing required remoteEntry.js URLs in environment variables!');
  }
  const dashboardRemote = env.VITE_DASHBOARD_REMOTE;
  const calendarRemote = env.VITE_CALENDAR_REMOTE;

  console.log('Vite mode:', mode);
  return {
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
  }
})
