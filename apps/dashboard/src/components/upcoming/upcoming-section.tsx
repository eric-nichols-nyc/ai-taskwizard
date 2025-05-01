import { Calendar, CheckCircle } from "lucide-react"

export function UpcomingSection() {
  return (
    <div className="bg-[#1a2235] rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="size-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-blue-400">Upcoming</h2>
      </div>

      <div className="flex items-center gap-2 text-gray-300">
        <CheckCircle className="size-5 text-green-400" />
        <p>All caught up! No upcoming deadlines.</p>
      </div>
    </div>
  )
}
