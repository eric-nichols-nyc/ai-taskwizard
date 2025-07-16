import { useEffect } from 'react';
import { useUserStore } from '../store/uae-user';

export function User() {
  const user = useUserStore((state) => state.user);
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

  return (
    <div>
      <div>User: {user.name || user.email}</div>
      <div>Email: {user.email}</div>
    </div>
  );
}