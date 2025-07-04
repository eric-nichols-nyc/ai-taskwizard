"use client"

import { useState, useEffect } from "react"
import { cn } from "../lib/utils"

interface AnimatedProgressBarProps {
  value: number
  max?: number
  className?: string
  showPercentage?: boolean
  height?: "sm" | "md" | "lg"
  animationDuration?: number
}

export function AnimatedProgressBar({
  value,
  max = 100,
  className,
  showPercentage = true,
  height = "md",
  animationDuration = 1000,
}: AnimatedProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(percentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [percentage])

  const heightClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  }

  return (
    <div className={cn("w-full", className)}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Progress</span>
          <span className="text-sm font-medium text-gray-300">{Math.round(displayValue)}%</span>
        </div>
      )}
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-gray-800 border border-gray-700",
          heightClasses[height],
        )}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 via-cyan-400 to-purple-600 bg-[length:200%_100%] animate-gradient-x opacity-20" />

        {/* Progress fill with animated gradient */}
        <div
          className="relative h-full bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-400 to-purple-500 bg-[length:200%_100%] animate-gradient-x rounded-full transition-all duration-1000 ease-out shadow-lg"
          style={{
            width: `${displayValue}%`,
            transitionDuration: `${animationDuration}ms`,
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>

        {/* Glow effect */}
        <div
          className="absolute top-0 h-full bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-400 to-purple-500 bg-[length:200%_100%] animate-gradient-x rounded-full blur-sm opacity-50 transition-all duration-1000 ease-out"
          style={{
            width: `${displayValue}%`,
            transitionDuration: `${animationDuration}ms`,
          }}
        />
      </div>
    </div>
  )
}
