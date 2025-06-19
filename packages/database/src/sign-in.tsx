import { SignIn as SignInComponent } from "@turbo-with-tailwind-v4/design-system/sign-in"
import "./styles.css"
import { useAuth } from "./useAuth"

export function SignIn() {
  console.log("Database: SignIn Component");
  const { signIn, signUp } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await signIn(email, password);
      if (!result.error) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Failed to sign in:", error);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      const result = await signUp(email, password, { firstName: name });
      if (!result.error) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Failed to sign up:", error);
    }
  };

  return <SignInComponent onSignIn={handleSignIn} onSignUp={handleSignUp} />;
}