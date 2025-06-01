import { AuthLayout } from "../layouts/auth-layout";
import { supabase } from "../supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export const Login = () => {
  return (
    <AuthLayout>
      <Auth 
        supabaseClient={supabase} 
        view="sign_up" 
        providers={['google']}
        appearance={{ theme: ThemeSupa }}
      />
    </AuthLayout>
  );
};
