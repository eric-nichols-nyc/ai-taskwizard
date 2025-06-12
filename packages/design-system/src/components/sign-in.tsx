"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Chrome } from "lucide-react"

export function SignIn() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleGoogleSignIn = () => {
    console.log("Sign in with Google")
    // Here you would integrate with Supabase Google OAuth
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-8">Supabase Authentication</h1>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <span
            className={`text-lg font-medium cursor-pointer transition-colors ${
              !isSignUp ? "text-white" : "text-gray-400"
            }`}
            onClick={() => setIsSignUp(false)}
          >
            Login
          </span>

          <div
            className="relative w-12 h-6 bg-gray-600 rounded-full cursor-pointer transition-colors"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                isSignUp ? "translate-x-6 bg-green-500" : "translate-x-0.5"
              }`}
            />
            {isSignUp && <div className="absolute inset-0 bg-blue-500 rounded-full" />}
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full transition-transform duration-200 ease-in-out z-10 ${
                isSignUp ? "translate-x-6 bg-white" : "translate-x-0.5 bg-white"
              }`}
            />
          </div>

          <span
            className={`text-lg font-medium cursor-pointer transition-colors ${
              isSignUp ? "text-white" : "text-gray-400"
            }`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </span>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12 text-base focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12 text-base focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium h-12 text-base mt-6"
            onClick={() => {
              console.log(isSignUp ? "Sign up" : "Login", { email, password })
            }}
          >
            {isSignUp ? "Sign Up" : "Login"}
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            variant="outline"
            className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 font-medium h-12 text-base"
            onClick={handleGoogleSignIn}
          >
            <Chrome className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
