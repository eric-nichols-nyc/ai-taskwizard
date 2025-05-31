import { PomodoroTimer } from "../../../pomodoro/pomodoro-timer";
import { TimersList } from "../timers/timers-list";
import { useState } from "react";
import { Timer } from "../../../../types";
import { Card, CardContent } from "@turbo-with-tailwind-v4/ui/card";
export function PomodoroSection() {
  const [timers, setTimers] = useState<Timer[]>([]);
  return (
    <Card>
      <CardContent>
        <PomodoroTimer setTimer={(timer) => setTimers(prev => [...prev, timer])} />
        <TimersList timers={timers} />
      </CardContent>
    </Card>
  );
}