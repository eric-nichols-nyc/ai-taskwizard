import { SignIn as SignInComponent } from "@turbo-with-tailwind-v4/design-system/components/sign-in"
import { useAuth } from "./useAuth"
import { useState } from "react"

export function SignIn() {
  console.log("Database: SignIn Component");
  const { signIn, signUp, signInWithProvider } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await signIn(email, password);
      if (!result.error) {
        window.location.href = "/";
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to sign in. Please try again.");
      console.error("Failed to sign in:", error);
    }
  };

  const handleSignUp = async (firstName: string, lastName: string, email: string, password: string) => {
    setError(null);
    try {
      const result = await signUp(email, password, { firstName, lastName });
      if (!result.error) {
        window.location.href = "/";
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to sign up. Please try again.");
      console.error("Failed to sign up:", error);
    }
  };

  const handleSignInWithProvider = async (provider: 'google') => {
    setError(null);
    try {
      const result = await signInWithProvider(provider);
      console.log("result", result);
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Failed to sign in with Google:", error);
    }
  }

  return <SignInComponent onSignIn={handleSignIn} onSignUp={handleSignUp} error={error} onSignInWithProvider={handleSignInWithProvider} />;
}