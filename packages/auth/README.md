# Auth Package Plan

This package provides shared authentication logic and utilities for all apps in the monorepo, using Supabase as the backend.

## Goals
- Centralize all authentication logic (login, logout, session, user context)
- Provide reusable hooks and providers for React apps
- Export a configured Supabase client for use in all apps
- Make it easy to update or extend authentication logic in one place

## Structure
```
/packages/auth/
  ├── src/
  │   ├── supabaseClient.ts      # Supabase client initialization
  │   ├── AuthProvider.tsx       # React context provider for auth state
  │   ├── useAuth.ts             # Custom hook for accessing auth state and actions
  │   └── ... (other hooks, utils)
  ├── package.json
  └── README.md
```

## Responsibilities
- Initialize and export the Supabase client
- Manage authentication state and provide it via React context
- Expose hooks for login, logout, signup, and session management
- Optionally, provide helpers for SSR/SSG if needed

## Usage in Apps
1. Install the package in any app (e.g., dashboard, calendar)
2. Wrap the app's root component with `<AuthProvider>` from this package
3. Use the `useAuth` hook to access user/session info and auth actions

## Example (in an app)
```tsx
import { AuthProvider, useAuth } from '@your-monorepo/auth';

function App() {
  return (
    <AuthProvider>
      <YourRoutes />
    </AuthProvider>
  );
}

function Profile() {
  const { user, login, logout } = useAuth();
  // ...
}
```

## Next Steps
- [ ] Set up Supabase client initialization
- [ ] Implement AuthProvider and context
- [ ] Create useAuth hook
- [ ] Add documentation and examples
