"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabase } from './client'

interface SupabaseContextType {
  user: User | null
  loading: boolean
  error: AuthError | null
  clearError: () => void
  signUp: (email: string, password: string) => Promise<{ error?: AuthError }>
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>
  signOut: () => Promise<{ error?: AuthError }>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (event === 'SIGNED_IN') {
        // Créer l'entrée user_data si elle n'existe pas
        const { error } = await supabase
          .from('user_data')
          .upsert({ 
            id: session!.user.id,
            email: session!.user.email
          })
        
        if (error) console.error('Error creating user_data:', error)
        router.refresh()
      }
      
      if (event === 'SIGNED_OUT') {
        router.refresh()
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const clearError = () => setError(null)

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) setError(error)
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) setError(error)
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) setError(error)
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  const value = {
    user,
    loading,
    error,
    clearError,
    signUp,
    signIn,
    signOut
  }

  return (
    <SupabaseContext.Provider value={value}>
      {!loading && children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}