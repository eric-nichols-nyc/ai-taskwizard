import { useEffect, useRef } from "react";
import { Button } from "@turbo-with-tailwind-v4/design-system/components/ui/button";
import { toast } from "react-hot-toast";
import { useAuth } from "./useAuth";
import { LogOut } from "lucide-react";

export function User() {
  const { user, session, loading, signInWithProvider, signOut } = useAuth();
  const attemptedSignIn = useRef(false);

  useEffect(() => {
    if (!user && !loading && !attemptedSignIn.current) {
      attemptedSignIn.current = true;
      signInWithProvider("google");
    }
  }, [user, loading, signInWithProvider]);

  if (loading) {
    return <div>Loading user...</div>;
  }
  if (!user) {
    return <div>Not signed in</div>;
  }

  const accessToken = session?.access_token || "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

    return (
    <div className="flex gap-2 p-4 justify-between items-center">
      <div className="flex gap-2">
        <div>
          <div>User: {user.user_metadata?.full_name || user.email}</div>
          <div>Email: {user.email}</div>
        </div>
        <div>
          <Button onClick={() => handleCopy(user.id)}>Copy User ID</Button>
        </div>
        {accessToken && (
          <div>
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
    </div>
  );
}

export default User;