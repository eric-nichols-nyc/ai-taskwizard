import { SignIn } from '@clerk/clerk-react'
import { AuthLayout } from '../layouts/auth-layout';

export const Login = () => {

  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
};