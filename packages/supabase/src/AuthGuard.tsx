'use client'

import React from 'react'
import { useAuth } from './useAuth'
import { AuthGuardProps } from './types'

export function AuthGuard({ children, fallback, redirectTo }: AuthGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    if (redirectTo && typeof window !== 'undefined') {
      window.location.href = redirectTo
      return null
    }

    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p>Please sign in to access this page.</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}