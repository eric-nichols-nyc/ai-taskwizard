import { Outlet, useRouter } from '@tanstack/react-router';
import { useCurrentUser } from '@turbo-with-tailwind-v4/auth';

export const Root = () => {
  const { user, isLoaded } = useCurrentUser();
  const router = useRouter();

  console.log('Root component rendered', { user, isLoaded });
  if (isLoaded && !user) {
    router.navigate({ to: '/login', replace: true });
  }else{
    console.log('user is logged in', user);
  }


  return (
    <div className="flex h-screen bg-[#0A0A0B]">
        <Outlet />
    </div>
  );
}; 