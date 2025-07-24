import { useState } from "react";
import { Button } from "@turbo-with-tailwind-v4/design-system/components/ui/button";
import { Input } from "@turbo-with-tailwind-v4/design-system/components/ui/input";
import { toast } from "react-hot-toast";
import { useAuth } from "./useAuth";
import { LogOut, Mail } from "lucide-react";
import { Card } from "@turbo-with-tailwind-v4/design-system/components/ui/card";

export function User() {
  const { user, session, loading, signInWithProvider, signOut, signIn } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      const result = await signInWithProvider("google");
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Signed in with Google");
      }
    } catch {
      toast.error("Failed to sign in with Google");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setIsSigningIn(true);
      const result = await signIn(email, password);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Signed in successfully");
        setShowLoginForm(false);
        setEmail("");
        setPassword("");
      }
    } catch {
      toast.error("Failed to sign in");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return <div>Loading user...</div>;
  }
  if (!user) {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-md mx-auto sticky top-0">
        <h2 className="text-xl font-semibold text-center">Sign In</h2>

        {!showLoginForm ? (
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Sign in with Google
            </Button>
            <Button
              onClick={() => setShowLoginForm(true)}
              variant="outline"
              disabled={isSigningIn}
            >
              Sign in with Email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSigningIn}
                className="flex items-center gap-2"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSigningIn}
                className="flex items-center gap-2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSigningIn}
                className="flex-1"
              >
                {isSigningIn ? "Signing in..." : "Sign In"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowLoginForm(false)}
                disabled={isSigningIn}
              >
                Back
              </Button>
            </div>
          </form>
        )}
      </div>
    );
  }

  const accessToken = session?.access_token || "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

    return (
    <Card className="flex gap-2 p-4 justify-between items-center">
      <div className="flex gap-2">
        <div>
          <div>User: {user.user_metadata?.full_name || user.email}</div>
          <div>Email: {user.email}</div>
        </div>
        <div>
          <p>User ID: {user.id.slice(0, 10)}...</p>
          <Button onClick={() => handleCopy(user.id)}>Copy User ID</Button>
        </div>
        {accessToken && (
          <div>
            <p>Access Token: {accessToken.slice(0, 10)}...</p>
            <Button onClick={() => handleCopy(accessToken)}>Copy Token</Button>
          </div>
        )}
      </div>
      <div>
        <Button
          onClick={() => {
            signOut();
            toast.success("Signed out successfully");
          }}
          variant="outline"
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </Card>
  );
}

export default User;