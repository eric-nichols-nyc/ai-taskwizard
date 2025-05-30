/// <reference types="vite/client" />

import { ClerkProvider } from '@clerk/clerk-react';
import React from 'react';

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
  publishableKey?: string;
}

export const ClerkProviderWrapper: React.FC<ClerkProviderWrapperProps> = ({ children, publishableKey }) => {
  const key = publishableKey || import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';
  if (!key) {
    throw new Error('Clerk publishable key is required');
  }
  return <ClerkProvider publishableKey={key}>{children}</ClerkProvider>;
}; 