# @turbo-with-tailwind-v4/supabase

A React authentication package for Supabase, designed for seamless integration in monorepos and micro-frontends (Module Federation). It provides context, hooks, and guards for managing authentication state, with special support for host/child app auth state sharing.

## Features
- **AuthProvider**: Context provider for Supabase auth state and actions
- **useAuth**: Hook to access auth state and methods
- **AuthGuard**: Component to protect routes/pages
- **useHostAuth**: Hook for child apps to sync auth state from a host (Module Federation)
- **TypeScript**: Fully typed API
- **Module Federation Ready**: Broadcasts auth state between host and child apps via `postMessage`

## Installation

```bash
npm install @turbo-with-tailwind-v4/supabase @supabase/supabase-js react
```

## Environment Setup

Set your Supabase credentials in your environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` or `VITE_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `VITE_SUPABASE_ANON_KEY`

## Usage

### 1. Create a Supabase Client

```ts
// supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

### 2. Wrap Your App with `AuthProvider`

```tsx
import { AuthProvider } from '@turbo-with-tailwind-v4/supabase';
import { supabase } from './supabaseClient';

export const Root = () => (
  <AuthProvider isHost={true} supabase={supabase}>
    {/* your app components */}
  </AuthProvider>
);
```
- `isHost={true}`: Set to `true` in the host app (for Module Federation scenarios).
- `supabase`: Pass your Supabase client instance.

### 3. Access Auth State and Actions with `useAuth`

```tsx
import { useAuth } from '@turbo-with-tailwind-v4/database';

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <button onClick={() => signIn('email', 'password')}>Sign In</button>;
  return <button onClick={signOut}>Sign Out ({user.email})</button>;
}
```

#### Real Example (from host app):
```tsx
import { useAuth } from '@turbo-with-tailwind-v4/database';

export function Landing() {
  const { user } = useAuth();
  // ...
}
```

### 4. Protect Routes with `AuthGuard`

```tsx
import { AuthGuard } from '@turbo-with-tailwind-v4/supabase';

function ProtectedPage() {
  return (
    <AuthGuard fallback={<div>Please sign in</div>} redirectTo="/login">
      <div>Secret content</div>
    </AuthGuard>
  );
}
```

### 5. Child App Auth Sync with `useHostAuth` (Module Federation)

For child apps loaded via Module Federation, use `useHostAuth` to sync auth state from the host:

```tsx
import { useHostAuth } from '@turbo-with-tailwind-v4/supabase/dist/client/useHostAuth';

function ChildApp() {
  const { user, session, loading } = useHostAuth();
  // ...
}
```

## API Reference

### `<AuthProvider>`
Props:
- `supabase`: Supabase client instance (required)
- `isHost`: boolean (default: false) — set to true in the host app
- `children`: ReactNode

### `useAuth()`
Returns:
- `user`: Supabase user or null
- `session`: Supabase session or null
- `loading`: boolean
- `signIn(email, password)`
- `signUp(email, password)`
- `signOut()`
- `signInWithProvider(provider)`
- `resetPassword(email)`
- `updateProfile(updates)`

### `<AuthGuard>`
Props:
- `children`: ReactNode
- `fallback`: ReactNode (optional)
- `redirectTo`: string (optional)

### `useHostAuth()`
Returns:
- `user`: Supabase user or null
- `session`: Supabase session or null
- `loading`: boolean

## Module Federation Support
- When `isHost` is true, `AuthProvider` broadcasts auth state to child apps via `postMessage`.
- Child apps use `useHostAuth` to receive and sync auth state from the host.

## Types
See `src/types.ts` for full type definitions.

## License
MIT
