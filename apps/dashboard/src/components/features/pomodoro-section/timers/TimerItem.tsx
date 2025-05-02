"use client";

import { Button } from "../../../ui/button";
import { Play, RotateCcw, Pause } from "lucide-react";
import { useTimer } from "../../../../hooks/use-timer";
import { formatTime } from "../../../../lib/utils";

type Timer = {
  id: number;
  name: string;
  time: string;
};

export function TimerItem({ timer }: { timer: Timer }) {
  console.log(timer);
  const { startTimer, pauseTimer, resetTimer, time, isRunning } = useTimer();

  return (
    <div className="flex items-center justify-between bg-[#232b3d] rounded-lg p-3">
      <div>
        <div className="text-sm text-gray-400">{timer.name}</div>
        <div className="text-xl font-bold text-purple-400">{formatTime(time)}</div>
      </div>
      <div className="flex gap-1">
        {isRunning ? (
          <Button
            size="icon"
            className="size-8 rounded-full bg-green-500 hover:bg-green-600"
            onClick={pauseTimer}
          >
            <Pause className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            className="size-8 rounded-full bg-green-500 hover:bg-green-600"
            onClick={startTimer}
          >
            <Play className="size-4" />
          </Button>
        )}
        <Button
          size="icon"
          className="size-8 rounded-full bg-gray-500 hover:bg-gray-600"
          onClick={resetTimer}
        >
          <RotateCcw className="size-4" />
        </Button>
        {/* <Button
          size="icon"
          variant="ghost"
          className="size-8 rounded-full text-gray-400"
        >
          <Edit className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 rounded-full text-gray-400"
        >
          <Trash2 className="size-4" />
        </Button> */}
      </div>
    </div>
  );
}
