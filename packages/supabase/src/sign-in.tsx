import React, { useState } from 'react';
import { Input } from '@turbo-with-tailwind-v4/design-system/components/ui/input';
import { Button } from '@turbo-with-tailwind-v4/design-system/components/ui/button';
import { Chrome } from 'lucide-react';
import { useAuth } from '.';
export const SignIn: React.FC = () => {
  const { signIn, signUp, signInWithProvider } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)
    setLoading(true)
    if (isSignUp) {
      const result = await signUp(email, password, { firstName, lastName })
      console.log('signUp result:', result)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("Check your email to verify your account.")
      }
      console.log('After signUp:', { error, success, loading })
    } else {
      const result = await signIn(email, password)
      console.log('signIn result:', result)
      if (result.error) {
        setError(result.error)
      } else {
        window.location.href = '/';
      }
      console.log('After signIn:', { error, success, loading })
    }
    setLoading(false)
    console.log('After setLoading(false):', { error, success, loading })
  }

  const handleGoogleSignIn = async () => {
    console.log("Sign in with Google")
    const result = await signInWithProvider("google")
    console.log('signInWithProvider result:', result)
    if (result.error) {
      setError(result.error)
    } else {
      console.log("Google sign in successful")
    }
  }

  return (
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
        {isSignUp && (
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12 text-base focus:border-blue-500 focus:ring-blue-500"
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-12 text-base focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
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
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (isSignUp ? "Signing Up..." : "Logging In...") : isSignUp ? "Sign Up" : "Login"}
        </Button>

        {error && (
          <div className="text-red-500 text-center mt-2">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-center mt-2">{success}</div>
        )}

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
          className="cursor-pointer w-full bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 hover:text-white font-medium h-12 text-base"
          onClick={handleGoogleSignIn}
        >
          <Chrome className="mr-2 h-5 w-5" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};
