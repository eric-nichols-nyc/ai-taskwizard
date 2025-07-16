import { useEffect } from "react";
import { useUserStore } from "../store/uae-user";
import { Button } from "@turbo-with-tailwind-v4/ui/button";
import { toast } from "react-hot-toast";
export function User() {
  const user = useUserStore((state) => state.user);
  const session = useUserStore((state) => state.session);
  const fetchAndSetUser = useUserStore((state) => state.fetchAndSetUser);

  useEffect(() => {
    if (!user) {
      fetchAndSetUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  if (!user) {
    return <div>Loading user...</div>;
  }

  const accessToken = session?.access_token || "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex gap-2 p-4">
      <div>
        <div>User: {user.name || user.email}</div>
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
  );
}
