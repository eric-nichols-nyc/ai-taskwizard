"use client"

export function Notes() {
  return (
    <main className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-4 text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-[-1] bg-gradient-animated" />
      <div className="w-full max-w-md text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Coming Soon</h1>
        <p className="mb-8 text-lg text-gray-200">We're working hard to bring you something amazing.</p>
      </div>
    </main>
  )
}
