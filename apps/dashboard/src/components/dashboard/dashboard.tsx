import { useEffect, useState } from "react";
import {
  supabase,
  useAuth,
} from "@turbo-with-tailwind-v4/database";
import {Greeting} from "../greeting/greeting";
import type { Session } from '@supabase/supabase-js';
import { Tasks } from '../tasks';
import { useGetTasks } from '../../hooks/use-tasks';
import { Card } from "@turbo-with-tailwind-v4/design-system/card";

const IS_ISOLATED = window.location.href.includes(
  import.meta.env.VITE_ISOLATED_HOST
);

export function Dashboard() {
  const { user: hostUser } = useAuth();
  const [user, setUser] = useState(hostUser);
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks();

  console.log('All tasks from hook:', tasks);

  const filteredTasks = tasks?.filter(task => {
    if (task.status !== 'todo') {
      return false;
    }
    if (!task.due_date) {
      return false;
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    return task.due_date === todayString;
  });

  console.log('Filtered tasks (due today and todo):', filteredTasks);

  // Update local user if hostUser changes and is present
  useEffect(() => {
    if (hostUser) {
      setUser(hostUser);
      console.log("DashboardApp - user is from host:", hostUser);
    }

    console.log("DashboardApp - session:", session);
  }, [hostUser, session]);

  useEffect(() => {
    async function maybeSignInWithGoogle() {
      if (IS_ISOLATED) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("Dashboard app - Isolated Session:", session);
        if (session) {
          // If no hostUser, but session user exists, set local user from session
          if (!hostUser && session.user) {
            setUser(session.user);
          }
        } else {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: window.location.origin,
            },
          });
          if (error) {
            console.error("Google sign-in failed:", error.message);
          }
        }
      }
    }
    maybeSignInWithGoogle();
    // Add hostUser as a dependency so we can set user if session is found after hostUser is null
  }, [hostUser]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoadingSession(false);
    });
  }, []);

  if (loadingSession) {
    return <div>Loading...</div>;
  }

  return (
      <div className="dark flex flex-col items-center justify-center gap-4 w-[600px] mx-auto">
          {loadingSession ? (
            "Loading..."
          ) : user ? (
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              <div>
              <h1>Dashboard User: {IS_ISOLATED ? "Isolated" : "Host"}</h1>
              <p>User ID: {user.id}</p>
              <p>Email: {user.email}</p>
              </div>
              <div className="w-full">
                <Greeting />
              </div>
              <Card className="w-full min-h-[300px]">
                {isLoadingTasks ? (
                    <p>Loading tasks...</p>
                ) : (
                    <Tasks>
                        <Tasks.Input />
                        {filteredTasks && filteredTasks.length > 0 ? (
                            <Tasks.List tasks={filteredTasks}>
                                {(task) => <Tasks.Item key={task.id} task={task} />}
                            </Tasks.List>
                        ) : (
                            <p className="text-center text-slate-500 mt-4">No tasks here yet... Add one above!</p>
                        )}
                    </Tasks>
                )}
              </Card>
            </div>
          ) : (
            "No user found"
          )}
      </div>
  );
}