import { KanbanBoard } from "./components/kanban-prototype/kanban-board";
import { signInWithEmail } from '@turbo-with-tailwind-v4/database';
import { useEffect, useState } from "react";
export const Kanban = () => {
  const[userId, setUserId] = useState<string | undefined>(undefined);


  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      async function maybeSignIn() {
        try {
          const sessionData = await signInWithEmail();
          setUserId(sessionData?.user?.id);
          console.log('Dev sign-in successful, user from session data:', sessionData?.user?.id);
        } catch (error) {
          console.error('Error during dev sign-in:', error);
        }
      }
      maybeSignIn();
    }
  }, []);
  console.log('Kanban - userId',userId);
  return <KanbanBoard />;
};