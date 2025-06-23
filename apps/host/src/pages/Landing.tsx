"use client"
import { useAuth } from '@turbo-with-tailwind-v4/database'
import { useEffect } from "react"
import { Hero } from '../components/features/landing/hero';

export function Landing() {

  const { user } = useAuth();

  useEffect(() => {
    console.log('User changed:', user);
  }, [user]);


  return (
      <div className="w-full min-h-screen bg-background text-white overflow-hidden">
        <Hero />
      </div>
  )
}
