import { useCallback, useRef, useState } from "react";

/**
 * useTimer - A custom React hook for managing a simple countdown timer (Pomodoro-style).
 *
 * Features:
 * - Starts, pauses, and resets a timer (default: 25 minutes).
 * - Exposes timer state (current time, running status, initial time).
 * - Handles timer interval and cleanup internally.
 *
 * Returns:
 *   {
 *     startTimer: () => void,   // Start the countdown
 *     pauseTimer: () => void,   // Pause the countdown
 *     resetTimer: () => void,   // Reset to initial time
 *     time: number,             // Current time in seconds
 *     isRunning: boolean,       // Whether the timer is running
 *     initialTime: number       // The initial timer value in seconds
 *   }
 *
 * Usage:
 *   const { startTimer, pauseTimer, resetTimer, time, isRunning, initialTime } = useTimer();
 */

export function useTimer() {
    const initialTime = 25 * 60
    const [time, setTime] = useState(initialTime)
    const [isRunning, setIsRunning] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)


  const startTimer = useCallback(() => {
    console.log("startTimer");
    if (!isRunning) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev > 0) return prev - 1
          clearInterval(intervalRef.current as NodeJS.Timeout)
          setIsRunning(false)
          return 0
        })
      }, 1000)
    }
  }, [isRunning])

  const pauseTimer = () => {
    console.log("pauseTimer");
    setIsRunning(false)
    // stop the timer
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const resetTimer = () => {
    console.log("resetTimer");
    setTime(initialTime)
    setIsRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  return { startTimer, pauseTimer, resetTimer, time, isRunning, initialTime };
}
