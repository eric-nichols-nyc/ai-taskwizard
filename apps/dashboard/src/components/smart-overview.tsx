import { Sparkles } from "lucide-react"

export function SmartOverview() {
  return (
    <div className="bg-[#1a2235] rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-[#4d9fff]">Smart Overview</h2>
        </div>
        <div>
          <p className="text-sm text-gray-400">
            Smart Overview is a Pro/Premium feature.{" "}
            <a href="#" className="text-[#4d9fff] hover:underline">
              Upgrade now
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
