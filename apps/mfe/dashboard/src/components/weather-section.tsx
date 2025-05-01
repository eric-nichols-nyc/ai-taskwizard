import { Sun, Cloud } from "lucide-react"

export function WeatherSection() {
  return (
    <div className="bg-[#1a2235] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sun className="size-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Weather</h2>
          <span className="text-gray-400">/ Edgewater</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sun className="size-10 text-yellow-400" />
          <div>
            <div className="flex items-end">
              <span className="text-4xl font-bold">54°F</span>
              <span className="text-gray-400 ml-2">(Sunny)</span>
            </div>
            <div className="text-gray-400 text-sm">Feels like 52.8°F</div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="text-blue-400">5 mph</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-blue-400">45%</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            <span className="text-yellow-400">UV: 0.3</span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3">
          <Cloud className="size-5 text-gray-400" />
          <span className="text-sm w-10">Thu</span>
          <div className="flex-1 h-2 bg-[#232b3d] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400"></div>
          </div>
          <span className="text-sm text-right">79° / 52°</span>
        </div>

        <div className="flex items-center gap-3">
          <Cloud className="size-5 text-gray-400" />
          <span className="text-sm w-10">Fri</span>
          <div className="flex-1 h-2 bg-[#232b3d] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-red-400"></div>
          </div>
          <span className="text-sm text-right">87° / 58°</span>
        </div>
      </div>
    </div>
  )
}
