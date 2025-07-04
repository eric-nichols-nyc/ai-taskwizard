// Dashboard.tsx
//
// This component renders the main dashboard view, including user authentication, greeting, clock, weather, progress bar, and today's tasks.
// It handles user session management, task filtering, and conditional rendering based on authentication state.

import { useEffect, useState } from "react";
import { supabase, useAuth } from "@turbo-with-tailwind-v4/database";
import { Greeting } from "../greeting/greeting";
import type { Session } from "@supabase/supabase-js";
import { Tasks } from "../tasks";
import { useGetTasks } from "../../hooks/use-tasks";
import { Card } from "@turbo-with-tailwind-v4/design-system/card";
import { Clock } from "../clock";
import { Weather } from "../weather";
import { ProgressBar } from "../progressbar/progressbar";

// Check if the app is running in isolated mode (for local development/testing)
const IS_ISOLATED = window.location.href.includes(
  import.meta.env.VITE_ISOLATED_HOST
);

/**
 * Dashboard component
 *
 * Renders the main dashboard UI, including user authentication, greeting, clock, weather, progress bar, and today's tasks.
 * Handles session management and task filtering for tasks due today.
 */
export function Dashboard() {
  // Get the authenticated user from the host (if available)
  const { user: hostUser } = useAuth();
  // Fetch all tasks using a custom hook
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks();
  // Local state for user and session
  const [user, setUser] = useState(hostUser);
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Log all tasks for debugging
  console.log("All tasks from hook:", tasks);

  // Filter tasks to only those that are 'todo' and due today
  const filteredTasks = tasks?.filter((task) => {
    if (task.status !== "todo") {
      return false;
    }
    if (!task.due_date) {
      return false;
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    return task.due_date === todayString;
  });

  console.log("Filtered tasks (due today and todo):", filteredTasks);

  // Update local user if hostUser changes and is present
  useEffect(() => {
    if (hostUser) {
      setUser(hostUser);
      console.log("DashboardApp - user is from host:", hostUser);
    }

    console.log("DashboardApp - session:", session);
  }, [hostUser, session]);

  // Handle sign-in with Google if running in isolated mode
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

  // On mount, get the current session and set user/session state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoadingSession(false);
    });
  }, []);

  // Main dashboard UI rendering
  return (
    <div className="dark flex flex-col items-center justify-center gap-4 w-full mx-auto p-3">
      {loadingSession ? (
         <div>Loading...</div>
      ) : user ? (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          <div className="w-full flex flex-col gap-4">
            {/* Greeting, Clock, and Weather widgets */}
            <Greeting />
            <div className="flex sm:flex-col md:flex-row w-full gap-4 items-stretch min-h-[100px]">
              <div className="w-full sm:w-full md:w-1/2">
                <Clock />
              </div>
              <div className="w-full sm:w-full md:w-1/2">
                <Weather />
              </div>
            </div>
          </div>
          {/* Progress bar widget */}
          <ProgressBar />
          {/* Task list card */}
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
                  <p className="text-center text-slate-500 mt-4">
                    No tasks here yet... Add one above!
                  </p>
                )}
              </Tasks>
            )}
          </Card>
        </div>
      ) : (
        <div>No user found</div>
      )}
    </div>
  );
}
