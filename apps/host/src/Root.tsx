import { Outlet, } from '@tanstack/react-router';
import { AuthProvider, useAuth } from '@turbo-with-tailwind-v4/supabase';
import { supabase } from './supabaseClient';

export const Root = () => {
  const { user, signIn, signOut } = useAuth()
  console.log('user', user)
  return (
    <div className="flex h-screen bg-[#0A0A0B]">
      <AuthProvider isHost={true} supabase={supabase}>
          <Outlet />
      </AuthProvider>
    </div>
  );
}; 