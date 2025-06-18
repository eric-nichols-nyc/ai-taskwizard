import { AuthLayout } from "../layouts/auth-layout";
import { SignIn } from "@turbo-with-tailwind-v4/database";

export const Login = () => {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
};
