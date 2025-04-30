# mfe

This is a micro-frontend (MFE) project built with [Vite](https://vitejs.dev/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and (optionally) [Tailwind CSS](https://tailwindcss.com/).

## Getting Started

1. **Install dependencies:**
   ```sh
   pnpm install
   ```

2. **Start the development server:**
   ```sh
   pnpm run dev
   ```

3. **Build for production:**
   ```sh
   pnpm run build
   ```

## Running in Production Mode

To run the micro-frontend applications in production mode, follow these steps:

1. **Build and run the Calendar (Remote) app first:**
   ```sh
   cd apps/mfe/calendar
   pnpm build
   pnpm preview --host --port 3001
   ```
   This will make the calendar component available at http://localhost:3001

2. **Build and run the Host app in a new terminal:**
   ```sh
   cd apps/mfe/host
   pnpm build
   pnpm preview --host --port 3000
   ```
   The main application will be available at http://localhost:3000

The `--host` flag makes the applications accessible from your local network, which is useful for:
- Testing on other devices (phones, tablets) on the same network
- Accessing the app via your machine's IP address
- Development in VMs or containers

## Project Structure

- `src/` — Main source code (React components, etc.)
- `public/` — Static assets
- `index.html` — Main HTML entry point
- `host/` — Main application that consumes the remote calendar component
- `calendar/` — Remote calendar component that gets federated into the host app

## Tailwind CSS (optional)
If you want to use Tailwind CSS, follow these steps:
1. Install Tailwind and dependencies:
   ```sh
   pnpm add -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
2. Configure Tailwind in your project as described in the [Tailwind docs](https://tailwindcss.com/docs/guides/vite).

---

Generated with Vite + React + TypeScript.
