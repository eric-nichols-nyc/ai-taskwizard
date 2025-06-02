import { Outlet, } from '@tanstack/react-router';
import { AuthProvider } from '@turbo-with-tailwind-v4/supabase';
import { supabase } from './supabaseClient';

export const Root = () => {
  // const { user } = useAuth()
  // console.log('user', user)
  return (
    <div className="flex h-screen w-screen p-0 m-0">
      <AuthProvider isHost={true} supabase={supabase}>
          <Outlet />
      </AuthProvider>
    </div>
  );
}; 