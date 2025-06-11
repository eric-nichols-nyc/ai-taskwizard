import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format time from seconds to MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// Format date to a readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

// Get time of day from a localtime string (format: 'YYYY-MM-DD HH:mm')
export function getTimeOfDay(localtime?: string | null): string {
  if (!localtime) return "day";
  const [, time] = localtime.split(' ');
  const [h, minutes] = time.split(':').map(Number);
  const localMinutes = h * 60 + minutes;
  if (localMinutes < 6 * 60) return "night";
  if (localMinutes < 12 * 60) return "morning";
  if (localMinutes < 18 * 60) return "afternoon";
  return "evening";
}