"use client"

import { useState } from "react"
import { Check, ChevronDown, ListTodo } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Progress } from "../ui/progress"
import { cn } from "../../lib/utils"

interface Task {
  id: string
  text: string
  completed: boolean
  priority: "Low" | "Medium" | "High"
  dueDate: string
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "move-in", completed: true, priority: "Medium", dueDate: "May 28" },
    { id: "2", text: "poop", completed: false, priority: "Medium", dueDate: "May 4" },
    { id: "3", text: "clean apartment", completed: false, priority: "Medium", dueDate: "May 10" },
  ])

  const [newTaskText, setNewTaskText] = useState("")
  const [newTaskPriority] = useState<"Low" | "Medium" | "High">("Medium")

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const addTask = () => {
    if (newTaskText.trim() === "") return

    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setDate(today.getDate() + 30)

    const day = Math.floor(Math.random() * 30) + 1
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
      Math.floor(Math.random() * 12)
    ]

    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false,
      priority: newTaskPriority,
      dueDate: `${month} ${day}`,
    }

    setTasks([...tasks, newTask])
    setNewTaskText("")
  }

  return (
    <div className="bg-[#0f1117] text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="flex items-center text-purple-500">
              <ChevronDown className="h-5 w-5 mr-2" />
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
            <Progress value={completionPercentage} className="h-2 bg-[#1a1d29]"  />
          </div>
        </div>

        <div className="bg-[#1a1d29] rounded-lg p-4">
          <div className="flex items-center mb-4 gap-2">
            <Button size="sm" variant="secondary" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
              <ListTodo className="h-4 w-4 mr-2" />
              Tasks
            </Button>
          </div>

          <div className="flex items-center mb-4">
            <Input
              placeholder="Add a new task..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1 bg-[#0f1117] border-none text-sm"
            />
            <div className="ml-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-[#0f1117] border-[#2a2d3a] text-white hover:bg-[#1a1d29]"
                onClick={() => addTask()}
              >
                {newTaskPriority}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    className={cn(
                      "w-5 h-5 rounded-full border mr-3 flex items-center justify-center",
                      task.completed ? "bg-green-500 border-green-500" : "border-gray-500 hover:border-white",
                    )}
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    {task.completed && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <span className={cn("text-sm", task.completed && "line-through text-gray-500")}>{task.text}</span>
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
                  <span className="text-xs text-gray-400">{task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
