"use client"

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'

interface AuthFormProps {
  mode?: 'login' | 'signup'
  onSuccess?: () => void
  className?: string
}

export function AuthForm({ mode = 'login', onSuccess, className = '' }: AuthFormProps) {
  const { signIn, signUp, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      onSuccess?.()
    } catch (err) {
      setError(authError?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Connexion' : 'Inscription'}</CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? 'Connectez-vous pour accéder à vos ressources'
            : 'Créez votre compte pour commencer'
          }
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mot de passe</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Connexion...' : 'Inscription...'}
              </>
            ) : (
              mode === 'login' ? 'Se connecter' : 'S\'inscrire'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}