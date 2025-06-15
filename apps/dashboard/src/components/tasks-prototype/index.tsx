"use client"

import { useState } from "react"
import { Check, TrendingUp, ListTodo, Plus, Calendar as CalendarIcon, Flag as FlagIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Progress } from "../ui/progress"
import { cn } from "../../lib/utils"
import { Card } from "@turbo-with-tailwind-v4/ui/card"
import { Task } from "@turbo-with-tailwind-v4/supabase/types"
import { useTaskService } from "../../hooks/use-task-service"
import { useTasksQuery } from "../../hooks/use-tasks-query"
import { Badge } from "@turbo-with-tailwind-v4/design-system"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useUpdateTaskMutation } from '../../hooks/use-update-task-mutation'
//import { useAuth } from '@turbo-with-tailwind-v4/supabase'
// get user token from session

function formatDateMMMdd(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
}

function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export default function TodoList() {
  const { data: tasks = [], isLoading } = useTasksQuery()
  const queryClient = useQueryClient()
  const {  createTask } = useTaskService()
  //const { session } = useAuth()
  const [newTaskText, setNewTaskText] = useState("")
  const updateTaskMutation = useUpdateTaskMutation()

  // Filter for today's tasks with status 'todo'
  const todayString = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
  const allTasks = tasks.filter(
    (task) => task.due_date === todayString
  );

  const todaysTasks = allTasks.filter(
    (task) =>
       task.status === 'todo'
  );

  const completedTasks = allTasks.filter((task) => task.status === "done").length
  const totalTasks = allTasks.length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0


  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return
    updateTaskMutation.mutate({
      id,
      updates: { status: 'done' }
    })
  }

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['calendar'] }) // if needed
    },
  })

  const handleCreateTask = () => {
    if (newTaskText.trim() === "") return
    createTaskMutation.mutate({ title: newTaskText.trim() })
    setNewTaskText("")
  }

  if (isLoading) return <div>Loading...</div>;


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
                        "text-xs px-2 py-1 rounded flex items-center gap-1",
                        task.priority === "High"
                          ? "bg-red-900 text-red-300"
                          : task.priority === "Medium"
                            ? "bg-orange-900 text-orange-300"
                            : "bg-blue-900 text-blue-300",
                      )}
                    >
                      <FlagIcon className="h-3 w-3 mr-1" />
                      {task.priority}
                    </span>
                    {/* Show due date badge */}
                    {task.due_date && (
                      <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {formatDateMMMdd(parseLocalDate(task.due_date))}
                      </Badge>
                    )}
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
