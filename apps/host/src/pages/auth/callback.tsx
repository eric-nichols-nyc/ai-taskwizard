import { useEffect } from "react"
import { useAuth } from "@turbo-with-tailwind-v4/database"
import { LoadingSpinner } from "../../components/loading-spinner"

export default function AuthCallback() {
  const { user, loading } = useAuth()

  useEffect(() => {
    console.log('user:', user, 'loading:', loading)
    if (!loading && user) {
      window.location.href = `${import.meta.env.VITE_HOST_URL}/dashboard`
    }
  }, [user, loading])

  return <LoadingSpinner />
} 