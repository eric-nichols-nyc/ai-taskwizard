import { useEffect } from "react"
import { useAuth } from "@turbo-with-tailwind-v4/supabase"
import { useRouter } from "@tanstack/react-router"

export default function AuthCallback() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('user:', user, 'loading:', loading)
    if (!loading && user) {
      router.navigate({ to: `${import.meta.env.VITE_HOST_URL}/dashboard`, })
    }
  }, [user, loading, router])

  return <div>Verifying your email...</div>
} 