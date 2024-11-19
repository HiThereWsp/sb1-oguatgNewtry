"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthPromptProps {
  className?: string
}

export default function AuthPrompt({ className = '' }: AuthPromptProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        // Force refresh the page after successful login
        window.location.href = '/'
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setIsLogin(true)
        setError('Vérifiez votre email pour confirmer votre inscription.')
        setEmail('')
        setPassword('')
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>{isLogin ? 'Connexion' : 'Inscription'}</CardTitle>
        <CardDescription>
          {isLogin 
            ? 'Connectez-vous pour accéder à tous les outils'
            : 'Créez un compte pour commencer'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <Alert variant={error.includes('Vérifiez') ? 'default' : 'destructive'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Connexion...' : 'Inscription...'}
                </>
              ) : (
                isLogin ? 'Se connecter' : 'S\'inscrire'
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
            >
              {isLogin 
                ? 'Pas encore de compte ? S\'inscrire'
                : 'Déjà un compte ? Se connecter'
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}