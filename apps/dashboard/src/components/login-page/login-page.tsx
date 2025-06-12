"use client"

import { SignIn } from "@turbo-with-tailwind-v4/supabase"

export function LoginPage() {



  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <SignIn />
    </div>
  )
}
