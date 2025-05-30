import { useUser } from '@clerk/clerk-react';
import type { UserResource } from '@clerk/types';

export function useCurrentUser() {
  const { user, isSignedIn, isLoaded } = useUser();
  return { user: isSignedIn && isLoaded ? user : null, isLoaded, isSignedIn };
} 