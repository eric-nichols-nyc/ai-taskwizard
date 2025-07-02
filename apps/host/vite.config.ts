import path from "path"
import react from "@vitejs/plugin-react"
import federation from "@originjs/vite-plugin-federation"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from "vite"


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Explicitly load the env file for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  console.log('Loaded env:', env);

  if (!env.VITE_DASHBOARD_REMOTE || !env.VITE_CALENDAR_REMOTE || !env.VITE_NOTES_REMOTE) {
    throw new Error('Missing required remoteEntry.js URLs in environment variables!');
  }
  const dashboardRemote = env.VITE_DASHBOARD_REMOTE;
  const calendarRemote = env.VITE_CALENDAR_REMOTE;
  const notesRemote = env.VITE_NOTES_REMOTE;
  const focusRemote = env.VITE_FOCUS_REMOTE;
  const settingsRemote = env.VITE_SETTINGS_REMOTE;
  const kanbanRemote = env.VITE_KANBAN_REMOTE;


  console.log('Vite mode:', mode);
  return {
    plugins: [
      react(),
      tailwindcss(),
      federation({
        name: 'host',
        remotes: {
          dashboard: dashboardRemote,
          calendar: calendarRemote,
          notes: notesRemote,
          focus: focusRemote,
          settings: settingsRemote,
          kanban: kanbanRemote
        },
        shared: ['react',
          'react-dom',
        ]
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@turbo-with-tailwind-v4/database": path.resolve(__dirname, "../../packages/database/src"),
        "@turbo-with-tailwind-v4/design-system": path.resolve(__dirname, "../../packages/design-system/src"),
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
      sourcemap: true,
      rollupOptions: {
        external: [
         // "@turbo-with-tailwind-v4/ui"
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
