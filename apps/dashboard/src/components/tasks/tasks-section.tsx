"use client"

import React, { useEffect, useState } from 'react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { CheckCircle, Circle, FileText } from "lucide-react"
import { cn } from "../../lib/utils"
import { Card } from "@turbo-with-tailwind-v4/ui/card"
import { useAuth } from '@turbo-with-tailwind-v4/supabase'

export function TasksSection() {
  const { session } = useAuth()
  const userToken = session?.access_token
  console.log('userToken', userToken)
  const API_URL = import.meta.env.VITE_API_URL; // Set this in your .env file

  const [activeTab, setActiveTab] = useState("tasks")
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const tabs = [
    { id: "tasks", label: "Tasks", icon: <FileText className="size-4" /> },
  ]

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch tasks')
        const data = await res.json()
        setTasks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (userToken) {
      fetchTasks()
    }
  }, [userToken])

  if (loading) return <div>Loading tasks...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card className="rounded-lg p-4">
      <div className="flex space-x-1 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={cn(
              "rounded-full flex items-center gap-1 px-4",
              activeTab === tab.id ? "bg-purple-600 hover:bg-purple-700" : "text-gray-400",
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Add a new task..."
          className="border-none placeholder:text-gray-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              setTasks([
                ...tasks,
                {
                  id: Date.now(),
                  text: e.currentTarget.value.trim(),
                  completed: false,
                  priority: "Medium",
                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }
              ]);
              e.currentTarget.value = '';
            }
          }}
        />
        <Button variant="outline" className="bg-[#232b3d] border-none text-gray-300">
          Medium
        </Button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3">
            {task.completed ? (
              <CheckCircle className="size-5 text-green-400 flex-shrink-0" />
            ) : (
              <Circle className="size-5 text-gray-400 flex-shrink-0" />
            )}
            <span className={task.completed ? "text-gray-500 line-through" : "text-gray-300"}>{task.text}</span>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs px-2 py-0.5 rounded bg-[#2d3748] text-orange-400">{task.priority}</span>
              {task.date && <span className="text-xs px-2 py-0.5 rounded bg-[#2d3748] text-gray-400">{task.date}</span>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
