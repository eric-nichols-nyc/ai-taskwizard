"use client";

import type React from "react";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@turbo-with-tailwind-v4/design-system/button";
import { Input } from "@turbo-with-tailwind-v4/design-system/input";
import { Label } from "@turbo-with-tailwind-v4/design-system/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@turbo-with-tailwind-v4/design-system/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@turbo-with-tailwind-v4/design-system/select";

type CreateTaskPayload = {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
};

interface AddTaskSheetProps {
  onAddTask: (task: CreateTaskPayload) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error?: string | null;
}

export function AddTaskSheet({
  onAddTask,
  open,
  onOpenChange,
  error: externalError,
}: AddTaskSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
      });
      setTitle("");
      setDescription("");
      setPriority("Medium");
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message?: string }).message || "Failed to add task");
      } else {
        setError("Failed to add task");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50vh] rounded-t-xl">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Add New Task
          </SheetTitle>
          <SheetDescription>
            Create a new task for today. Fill in the details below.
          </SheetDescription>
        </SheetHeader>

        {externalError && <div className="text-red-500 text-sm mb-2">{externalError}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col h-full p-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value: "Low" | "Medium" | "High") => setPriority(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <SheetFooter className="flex-shrink-0 gap-2 mt-4">
            <SheetClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </SheetClose>
            <Button type="submit" disabled={!title.trim() || isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Task"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
