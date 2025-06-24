"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@turbo-with-tailwind-v4/design-system/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@turbo-with-tailwind-v4/design-system/components/ui/card"
import { Input } from "@turbo-with-tailwind-v4/design-system/components/ui/input"
import { Label } from "@turbo-with-tailwind-v4/design-system/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@turbo-with-tailwind-v4/design-system/components/ui/tabs"
import { z } from "zod"

interface SignInProps {
  onSignIn?: (email: string, password: string) => Promise<void>;
  onSignUp?: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  error?: string | null;
}

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignIn({ onSignIn, onSignUp, error }: SignInProps) {
  console.log("SignInComponent");
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const [signUpErrors, setSignUpErrors] = useState<string[]>([])

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const email = formData.get("signin-email") as string
      const password = formData.get("signin-password") as string

      await onSignIn?.(email, password)
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setSignUpErrors([])

    try {
      const formData = new FormData(event.currentTarget)
      const firstName = formData.get("signup-first-name") as string
      const lastName = formData.get("signup-last-name") as string
      const email = formData.get("signup-email") as string
      const password = formData.get("signup-password") as string

      const result = signUpSchema.safeParse({ firstName, lastName, email, password });
      if (!result.success) {
        setSignUpErrors(result.error.errors.map(e => e.message));
        setIsLoading(false);
        return;
      }

      await onSignUp?.(firstName, lastName, email, password)
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome to Task Wizard</CardTitle>
          <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-4">
              {error && (
                <div className="text-red-500 text-center text-sm mb-2">
                  {error}
                </div>
              )}
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="signin-email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    name="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="text-center">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Forgot your password?
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account yet?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-medium text-primary"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign up
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              {signUpErrors.length > 0 && (
                <div className="text-red-500 text-center text-sm mb-2">
                  {signUpErrors.map((err, idx) => (
                    <div key={idx}>{err}</div>
                  ))}
                </div>
              )}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-first-name">First Name</Label>
                  <Input id="signup-first-name" name="signup-first-name" type="text" placeholder="Enter your first name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-last-name">Last Name</Label>
                  <Input id="signup-last-name" name="signup-last-name" type="text" placeholder="Enter your last name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="signup-email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="signup-password"
                    type="password"
                    placeholder="Create a password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
              <div className="text-center text-sm text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Button variant="link" className="p-0 h-auto text-sm">
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button variant="link" className="p-0 h-auto text-sm">
                  Privacy Policy
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm font-medium text-primary"
                  onClick={() => setActiveTab("signin")}
                >
                  Sign in
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
