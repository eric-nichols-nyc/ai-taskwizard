import { PomodoroTimer } from "../../../pomodoro/pomodoro-timer";
import { TimersList } from "../timers/timers-list";
import { useState } from "react";
import { Timer } from "../../../../types";
export function PomodoroSection() {
  const [timers, setTimers] = useState<Timer[]>([]);
  return (
    <div className="flex flex-col gap-4">
      <PomodoroTimer setTimer={(timer) => setTimers(prev => [...prev, timer])} />
      <TimersList timers={timers} />
    </div>
  );
}