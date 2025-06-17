import React, { useState } from 'react';
import { Input } from '@turbo-with-tailwind-v4/design-system/components/ui/input';
import { Button } from '@turbo-with-tailwind-v4/design-system/components/ui/button';
import { Chrome } from 'lucide-react';
import { useAuth } from './useAuth';
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
        window.location.href = '/dashboard';
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
      </div>
    </div>
  );
};
