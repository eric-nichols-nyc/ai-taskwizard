import { Outlet, useRouter } from '@tanstack/react-router';
import { useCurrentUser } from '@turbo-with-tailwind-v4/auth';
import { useEffect } from 'react';

export const Root = () => {
  const { user, isLoaded } = useCurrentUser();
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  useEffect(() => {
    if (!isLoaded) return; // loading
    if (!user && currentPath !== '/login') {
      router.navigate({ to: '/login', replace: true });
    }
    console.log(user, isLoaded);
  }, [user, currentPath]);

  return (
    <div className="flex h-screen bg-[#0A0A0B]">
        <Outlet />
    </div>
  );
}; 