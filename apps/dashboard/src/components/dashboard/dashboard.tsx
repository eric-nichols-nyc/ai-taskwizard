import { useEffect, useState } from "react";
import {
  supabase,
  useAuth,
} from "@turbo-with-tailwind-v4/database";
import {Greeting} from "../greeting/greeting";
import type { Session } from '@supabase/supabase-js';
import { Tasks } from '../tasks';
import { useGetTasks } from '../../hooks/use-tasks';
//import { Dashboard } from './Dashboard'

const IS_ISOLATED = window.location.href.includes(
  import.meta.env.VITE_ISOLATED_HOST
);

// async function devSignIn() {
//   if (import.meta.env.MODE === 'development') {
//     const { error } = await supabaseDev.auth.signInWithPassword({
//       email: import.meta.env.VITE_DEV_EMAIL,
//       password: import.meta.env.VITE_DEV_PASSWORD,
//     });
//     if (error) {
//       console.error('Dev sign-in failed:', error.message);
//     }
//   }
// }

export function Dashboard() {
  const { user: hostUser } = useAuth();
  const [user, setUser] = useState(hostUser);
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks();

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
      <div className="w-full dark">
        {/* <Dashboard /> */}
        <div>
          {loadingSession ? (
            "Loading..."
          ) : user ? (
            <div>
              <div>
              <h1>Dashboard User: {IS_ISOLATED ? "Isolated" : "Host"}</h1>
              <p>User ID: {user.id}</p>
              <p>Email: {user.email}</p>
              </div>
              <div>
                <Greeting />
              </div>
              <div>
                {isLoadingTasks ? (
                    <p>Loading tasks...</p>
                ) : (
                    <Tasks>
                        <Tasks.Input />
                        <Tasks.List tasks={tasks || []}>
                            {(task) => <Tasks.Item key={task.id} task={task} />}
                        </Tasks.List>
                    </Tasks>
                )}
              </div>
            </div>
          ) : (
            "No user found"
          )}
        </div>
      </div>
  );
}