"use client"

import { useState } from "react"
import { Check, TrendingUp, ListTodo, Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Progress } from "../ui/progress"
import { cn } from "../../lib/utils"
import { Card } from "@turbo-with-tailwind-v4/ui/card"
import { Task } from "@turbo-with-tailwind-v4/supabase/types"
import { useTaskService } from "../../hooks/use-task-service"
import { useRealtimeTasks } from "../../hooks/use-realtime-tasks"
//import { useAuth } from '@turbo-with-tailwind-v4/supabase'
// get user token from session

function formatDateYYYYMMDD(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function TodoList() {
  const { tasks } = useRealtimeTasks()
  const {  createTask, refreshTasks } = useTaskService()
  //const { session } = useAuth()
  const [newTaskText, setNewTaskText] = useState("")
 

  // Filter for today's tasks
  const todayString = formatDateYYYYMMDD(new Date());
  const todaysTasks = tasks.filter(
    (task) => task.due_date && formatDateYYYYMMDD(new Date(task.due_date)) === todayString
  );

  const completedTasks = todaysTasks.filter((task) => task.status === "done").length
  const totalTasks = todaysTasks.length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0


  const toggleTaskCompletion = (id: string) => {
    console.log('toggleTaskCompletion', id)
  }


  const handleCreateTask = async () => {
    if (newTaskText.trim() === "") return;
    console.log('handleCreateTask', newTaskText)
    const taskData = {
      title: newTaskText.trim()
    };
    try {
      await createTask(taskData);
      await refreshTasks();
      console.log('task created', taskData)
      // setNewTaskText("");
      // setSelectedDate(null); // Clear selected date after adding task
    } catch (error) {
      console.error('Failed to create task:', error);
      // TODO: Show user-facing error feedback
    }
  };


  return (
    <Card className="p-6">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex items-center text-accent">
              <TrendingUp className="h-5 w-5 mr-2" />
              <h1 className="text-xl font-medium">Productivity</h1>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Tasks</span>
              <span className="text-sm text-green-500">
                {completedTasks}/{totalTasks} ({completionPercentage}%)
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2 "  />
          </div>
        </div>

        <div className=" rounded-lg p-4">
          <div className="hidden items-center mb-4 gap-2">
            <Button size="sm" variant="secondary" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
              <ListTodo className="h-4 w-4 mr-2" />
              Tasks
            </Button>
          </div>

          <div className="flex items-center mb-4 bg-gray-800 p-2 rounded-lg">
            <Input
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateTask()}
              className="flex-1 border-none text-sm bg-transparent"
            />
            <div className="ml-2 flex items-center gap-2">
              {/* <Button
                variant="outline"
                size="sm"
                className="border-[#2a2d3a] hover:bg-[#1a1d29]"
                onClick={() => handleCreateTask()}
              >
                {newTaskPriority}
              </Button> */}
              <Button
                size="icon"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full ml-1"
                onClick={handleCreateTask}
                aria-label="Add Task"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {todaysTasks.length === 0 ? (
              <div className="text-center text-gray-400 italic py-4">No tasks yet, add one now.</div>
            ) : (
              todaysTasks.map((task: Task) => (
                <div key={task.id} className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                  <div className="flex items-center">
                    <button
                      className={cn(
                        "w-5 h-5 rounded-full border mr-3 flex items-center justify-center",
                        task.status === "done" ? "bg-green-500 border-green-500" : "border-gray-500 hover:border-white",
                      )}
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      {task.status === "done" && <Check className="h-3 w-3 text-white" />}
                    </button>
                    <span className={cn("text-sm", task.status === "done" && "line-through text-gray-500")}>{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded",
                        task.priority === "High"
                          ? "bg-red-900 text-red-300"
                          : task.priority === "Medium"
                            ? "bg-orange-900 text-orange-300"
                            : "bg-blue-900 text-blue-300",
                      )}
                    >
                      {task.priority}
                    </span>
                    <span className="hidden text-xs text-gray-400">{task.due_date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
