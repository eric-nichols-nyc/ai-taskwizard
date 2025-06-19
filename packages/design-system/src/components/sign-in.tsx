"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@turbo-with-tailwind-v4/design-system/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@turbo-with-tailwind-v4/design-system/components/ui/card"
import { Input } from "@turbo-with-tailwind-v4/design-system/components/ui/input"
import { Label } from "@turbo-with-tailwind-v4/design-system/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@turbo-with-tailwind-v4/design-system/components/ui/tabs"

interface SignInProps {
  onSignIn?: (email: string, password: string) => Promise<void>;
  onSignUp?: (name: string, email: string, password: string) => Promise<void>;
}

export function SignIn({ onSignIn, onSignUp }: SignInProps) {
  console.log("SignInComponent");
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")

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

    try {
      const formData = new FormData(event.currentTarget)
      const name = formData.get("signup-name") as string
      const email = formData.get("signup-email") as string
      const password = formData.get("signup-password") as string

      await onSignUp?.(name, email, password)
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Card className={`${activeTab === "signin" ? "w-[448px]" : "w-[448px]"}`}>
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
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input id="signup-name" name="signup-name" type="text" placeholder="Enter your full name" required />
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
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    name="signup-confirm-password"
                    type="password"
                    placeholder="Confirm your password"
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
