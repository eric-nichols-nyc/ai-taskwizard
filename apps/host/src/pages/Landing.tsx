import { Navigate, useRouter } from '@tanstack/react-router';
import { Button } from '@turbo-with-tailwind-v4/ui/button';
import { useAuth } from '@turbo-with-tailwind-v4/supabase'

export const Landing = () => {
  const { user } = useAuth();
  const router = useRouter();

  console.log('landing app', user);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = () => {
    router.navigate({ to: '/login' });
  };

  return (
    <div>
      <p>Please login</p>
      <Button onClick={handleLogin}>Go to Login</Button>
    </div>
  );
};