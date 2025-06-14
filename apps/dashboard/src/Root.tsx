import { Outlet, } from '@tanstack/react-router';

export const Root = () => {
  // const { user } = useAuth()
  // console.log('user', user)
  return (
    <div className="flex h-screen w-screen p-0 m-0">
          <Outlet />
    </div>
  );
}; 