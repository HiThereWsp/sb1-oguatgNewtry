"use client"

import { useCallback } from 'react'
import { useSupabase } from '@/lib/supabase/context'

export function useAuth() {
  const { user, loading, error, signIn, signUp, signOut, clearError } = useSupabase()

  const handleSignIn = useCallback(async (email: string, password: string) => {
    const result = await signIn(email, password)
    return { success: !result.error, error: result.error }
  }, [signIn])

  const handleSignUp = useCallback(async (email: string, password: string) => {
    const result = await signUp(email, password)
    return { success: !result.error, error: result.error }
  }, [signUp])

  const handleSignOut = useCallback(async () => {
    const result = await signOut()
    return { success: !result.error, error: result.error }
  }, [signOut])

  return {
    user,
    loading,
    error,
    clearError,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    isAuthenticated: !!user
  }
}