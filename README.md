# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Project Structure
```
├── apps/
│   ├── mfe/                    # Micro-frontend applications
│   │   ├── shell/             # Main shell application (Port 3000)
│   │   │   ├── src/
│   │   │   │   ├── App.tsx
│   │   │   │   ├── components/
│   │   │   │   └── providers/
│   │   │   │       └── auth/  # Auth context provider
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── dashboard/         # Dashboard MFE (Port 3001)
│   │   │   ├── src/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── components/
│   │   │   │   └── hooks/
│   │   │   │       └── useAuth.ts
│   │   │   └── vite.config.ts
│   │   │
│   │   ├── calendar/         # Calendar MFE (Port 3002)
│   │   │   ├── src/
│   │   │   │   ├── Calendar.tsx
│   │   │   │   ├── components/
│   │   │   │   └── hooks/
│   │   │   │       └── useAuth.ts
│   │   │   └── vite.config.ts
│   │   │
│   │   └── ai-assistant/     # AI Assistant MFE (Port 3003)
│   │       ├── src/
│   │       │   ├── Assistant.tsx
│   │       │   ├── components/
│   │       │   └── hooks/
│   │       │       └── useAuth.ts
│   │       └── vite.config.ts
│   │
│   ├── web/                  # Main marketing website
│   └── docs/                 # Documentation site
│
├── packages/
│   ├── design-system/        # Core design system
│   │   ├── src/
│   │   │   ├── components/   # Base components
│   │   │   ├── tokens/       # Design tokens
│   │   │   └── themes/       # Theme configurations
│   │   └── package.json
│   │
│   ├── ui/                   # Shared UI components
│   │   ├── src/
│   │   │   ├── components/   # Higher-level components
│   │   │   │   ├── auth/     # Auth-related components
│   │   │   │   └── forms/    # Form components
│   │   │   └── hooks/        # UI-related hooks
│   │   └── package.json
│   │
│   ├── utils/               # Shared utilities
│   │   ├── src/
│   │   │   ├── supabase/    # Supabase client & hooks
│   │   │   │   ├── client.ts      # Supabase client instance
│   │   │   │   ├── types.ts       # Database types
│   │   │   │   ├── queries/       # Database queries
│   │   │   │   └── hooks/         # Supabase hooks
│   │   │   ├── api/         # API utilities
│   │   │   │   ├── tasks/        # Task-related API calls
│   │   │   │   │   ├── index.ts   # Export all task APIs
│   │   │   │   │   ├── create.ts  # Create task
│   │   │   │   │   ├── update.ts  # Update task
│   │   │   │   │   ├── delete.ts  # Delete task
│   │   │   │   │   └── get.ts     # Get tasks
│   │   │   │   ├── projects/     # Project-related API calls
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── create.ts
│   │   │   │   │   ├── update.ts
│   │   │   │   │   └── get.ts
│   │   │   │   ├── ai/          # AI-related API calls
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── suggest.ts
│   │   │   │   │   └── analyze.ts
│   │   │   │   └── types/       # API types
│   │   │   │       ├── tasks.ts
│   │   │   │       ├── projects.ts
│   │   │   │       └── responses.ts
│   │   │   ├── auth/        # Authentication utilities
│   │   │   │   ├── provider.tsx   # Auth context provider
│   │   │   │   ├── hooks.ts       # Auth hooks
│   │   │   │   ├── types.ts       # Auth types
│   │   │   │   └── utils.ts       # Auth helper functions
│   │   │   └── helpers/     # Common helper functions
│   │   └── package.json
│   │
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared TypeScript configuration
│
├── turbo.json               # Turborepo configuration
├── package.json             # Root package.json
└── pnpm-workspace.yaml      # PNPM workspace configuration
```

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

# Turbo with Tailwind v4

## Building Packages

Before running the host application, you need to build the shared packages in the correct order:

```bash
# Build utils first
pnpm build --filter @turbo-with-tailwind-v4/utils

# Then build design-system (which depends on utils)
pnpm build --filter @turbo-with-tailwind-v4/design-system

# Finally run the host app
pnpm dev --filter @turbo-with-tailwind-v4/host
```

This build order is important because:
1. The design-system package depends on utils
2. The host app needs the built CSS from design-system for Tailwind styles to work properly

Note: If you make changes to any shared package, you'll need to rebuild it for the changes to reflect in the host app.

## Micro-Frontend Monorepo Checklist

### 1. Federation Entry File Consistency
- Each remote app (e.g., Kanban) exposes a consistent entry file (e.g., `remoteEntry.js`) in its `vite.config.ts`:
  ```js
  federation({
    name: 'kanban',
    filename: 'remoteEntry.js',
    exposes: { /* ... */ }
  })
  ```

### 2. Vercel Output Directory
- Each app's `vercel.json` (or Vercel dashboard) is set to output the correct build directory (usually `dist` for Vite).

### 3. Remote URLs in Host
- In your host app's `vite.config.ts`, all remote URLs include the full path to the entry file:
  ```js
  remotes: {
    kanban: 'https://ai-taskwizard-kanban.vercel.app/remoteEntry.js',
    // ...other remotes
  }
  ```

### 4. Environment Variables for Remote URLs
- Use `.env` files for each environment (local, staging, prod) to store remote URLs:
  ```
  VITE_KANBAN_REMOTE=https://ai-taskwizard-kanban.vercel.app/remoteEntry.js
  ```
- In `vite.config.ts`, load these with `loadEnv`:
  ```js
  const kanbanRemote = env.VITE_KANBAN_REMOTE;
  remotes: { kanban: kanbanRemote }
  ```

### 5. Deployment Verification
- After deploying a remote, visit the remote entry URL (e.g., `https://ai-taskwizard-kanban.vercel.app/remoteEntry.js`) and confirm it returns JavaScript, not HTML.

### 6. README or Docs
- Maintain a `MONOREPO.md` or update your main `README.md` with:
  - The expected remote entry URLs for each app
  - How to update them for new environments
  - Any gotchas or common troubleshooting steps

---

## Remote Entry Automation

### Script to Check RemoteEntry URLs

Create a script at `scripts/check-remote-entries.js`:

```js
const fetch = require('node-fetch');

const remotes = [
  'https://ai-taskwizard-kanban.vercel.app/remoteEntry.js',
  // add more as needed
];

(async () => {
  for (const url of remotes) {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('javascript')) {
      console.warn(`⚠️  ${url} does not return JavaScript! Content-Type: ${contentType}`);
    } else {
      console.log(`✅  ${url} OK`);
    }
  }
})();
```

Add to your `package.json` scripts:
```json
"scripts": {
  "check:remotes": "node scripts/check-remote-entries.js"
}
```

### .env.example Template

```
VITE_KANBAN_REMOTE=https://ai-taskwizard-kanban.vercel.app/remoteEntry.js
VITE_DASHBOARD_REMOTE=https://ai-taskwizard-dashboard.vercel.app/remoteEntry.js
# etc.
```

---

## Troubleshooting
- If you get a MIME type error, check that the remoteEntry.js file is deployed and accessible at the expected URL.
- Make sure Vercel's output directory is set to `dist` for each app.
- Avoid rewrites/redirects that send all requests to index.html for JS files.
- Use environment variables to manage remote URLs for different environments.
