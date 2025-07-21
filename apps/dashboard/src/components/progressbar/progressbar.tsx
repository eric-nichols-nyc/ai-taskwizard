import { useMemo } from "react";
import {
  Card,
  CardContent,
} from "@turbo-with-tailwind-v4/design-system/card";
import { AnimatedProgressBar } from "@turbo-with-tailwind-v4/design-system/animated-progress-bar";
import { useGetTasks } from "../../hooks/use-tasks";

export const ProgressBar = () => {
  // Get today's date in YYYY-MM-DD format
  // Fetch today's tasks for the current user
  const { data: tasks, isLoading } =useGetTasks();

  // Calculate progress: done/(done+todo)
  const { percent, doneCount, totalCount } = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      return { percent: 0, doneCount: 0, totalCount: 0 };
    }
    // Only count tasks with status 'done' or 'todo' in the denominator
    const relevantTasks = tasks.filter(
      (t) => t.status === "done" || t.status === "todo"
    );
    const doneCount = relevantTasks.filter((t) => t.status === "done").length;
    const totalCount = relevantTasks.length;
    const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
    return { percent, doneCount, totalCount };
  }, [tasks]);

  return (
    <Card className="bg-gray-900 border-gray-800 w-full">
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Today's Progress</span>
            <span className="text-sm text-gray-400">
              {isLoading
                ? "Loading..."
                : `${doneCount}/${totalCount} done`}
            </span>
          </div>
          <AnimatedProgressBar value={isLoading ? 0 : percent} />
          <div className="text-xs text-gray-500 text-right">
            {isLoading ? "" : `${percent}%`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
