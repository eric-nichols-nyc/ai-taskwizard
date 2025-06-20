import { Outlet, } from '@tanstack/react-router';
import { AuthProvider } from '@turbo-with-tailwind-v4/database';


export const Root = () => {
  return (
    <div className="flex h-screen w-screen p-0 m-0">
      <AuthProvider isHost={true}>
          <Outlet />
      </AuthProvider>
    </div>
  );
}; 