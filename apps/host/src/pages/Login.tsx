import { AuthLayout } from "../layouts/auth-layout";
import { SignIn } from "@turbo-with-tailwind-v4/supabase";

export const Login = () => {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
};
