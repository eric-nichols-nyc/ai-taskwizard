import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { Task } from "@turbo-with-tailwind-v4/supabase/types";

export function useRealtimeTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    // Initial fetch
    supabase.from("tasks").select("*").then(({ data }) => {
      if (!ignore && data) setTasks(data as Task[]);
      setLoading(false);
    });

    // Subscribe to realtime changes
    const channel = supabase
      .channel("public:tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          setTasks((prev) => {
            if (payload.eventType === "INSERT") {
              return [...prev, payload.new as Task];
            }
            if (payload.eventType === "UPDATE") {
              return prev.map((t) =>
                t.id === payload.new.id ? (payload.new as Task) : t
              );
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((t) => t.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { tasks, loading };
}
