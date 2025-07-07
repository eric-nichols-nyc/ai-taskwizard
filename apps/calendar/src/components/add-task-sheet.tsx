"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, Tag } from "lucide-react"
import { Button } from "@turbo-with-tailwind-v4/design-system/button"
import { Input } from "@turbo-with-tailwind-v4/design-system/input"
import { Label } from "@turbo-with-tailwind-v4/design-system/label"
import { Textarea } from "@turbo-with-tailwind-v4/design-system/textarea"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@turbo-with-tailwind-v4/design-system/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@turbo-with-tailwind-v4/design-system/select"

interface Task {
  id: string
  title: string
  description: string
  time: string
  priority: "low" | "medium" | "high"
  category: string
}

interface AddTaskSheetProps {
  onAddTask: (task: Omit<Task, "id">) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddTaskSheet({ onAddTask, open, onOpenChange }: AddTaskSheetProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      time: time || "09:00",
      priority,
      category: category || "General",
    })

    // Reset form
    setTitle("")
    setDescription("")
    setTime("")
    setPriority("medium")
    setCategory("")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Add New Task
          </SheetTitle>
          <SheetDescription>Create a new task for today. Fill in the details below.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                id="task-description"
                placeholder="Add more details about your task..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </Label>
                <Input id="task-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-category" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Category
              </Label>
              <Input
                id="task-category"
                placeholder="Work, Personal, Health, etc."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <SheetFooter className="flex-shrink-0 gap-2">
            <SheetClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={!title.trim()}>
              Add Task
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
