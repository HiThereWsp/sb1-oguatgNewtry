"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/client'

const TEACHING_LEVELS = [
  'Maternelle',
  'Élémentaire',
  'Collège',
  'Lycée',
  'Supérieur'
]

export function UserProfile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState<Tables['user_data'] | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('user_data')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setUserData(data)
      } catch (err) {
        setError('Erreur lors du chargement du profil')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !userData) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_data')
        .upsert({
          id: user.id,
          ...userData
        })

      if (error) throw error
    } catch (err) {
      setError('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (!user || !userData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Vous devez être connecté pour accéder à cette page</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Utilisateur</CardTitle>
        <CardDescription>Gérez vos informations personnelles</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
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
              value={user.email || ''}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Niveau d'enseignement</label>
            <select
              className="w-full p-2 border rounded-md"
              value={userData.teaching_level}
              onChange={(e) => setUserData({ ...userData, teaching_level: e.target.value })}
            >
              <option value="">Sélectionnez un niveau</option>
              {TEACHING_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Préférences</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={userData.is_beta_tester}
                  onChange={(e) => setUserData({ ...userData, is_beta_tester: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span>Participer au programme bêta</span>
              </label>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Enregistrer les modifications'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}