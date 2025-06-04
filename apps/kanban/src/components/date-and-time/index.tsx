"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@turbo-with-tailwind-v4/design-system/card"
import { Clock } from "lucide-react"

export function DateTimeDisplay() {
    const [date, setDate] = useState<Date>(new Date())
  
    useEffect(() => {
      // Update time every second
      const interval = setInterval(() => {
        setDate(new Date())
      }, 1000)
  
      // Clean up interval on unmount
      return () => clearInterval(interval)
    }, [])
  
    // Format date: Monday, January 1, 2023
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  
    // Format time: 12:34 PM (without seconds)
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  
    return (
      <Card className="w-full mx-auto p-2">
        <CardContent>
          <div className="grid gap-0">
           <div className="flex items-center gap-2">
             <Clock className="h-5 w-5 text-muted-foreground" />
             <p className="text-lg font-medium">{formattedDate}</p>
           </div>
            <p className="text-3xl font-bold">{formattedTime}</p>
          </div>
        </CardContent>
      </Card>
    )
  }
