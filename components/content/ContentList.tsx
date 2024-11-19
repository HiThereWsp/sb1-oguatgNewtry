"use client"

import { useState, useEffect } from 'react'
import { useUserContent } from '@/hooks/use-user-content'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Trash2, Edit, Eye } from 'lucide-react'
import type { Tables } from '@/lib/supabase/client'

type ContentType = keyof Pick<Tables, 'qcm' | 'sequences' | 'vocabulary_lists'>

interface ContentListProps {
  type: ContentType
  onEdit?: (item: Tables[ContentType]) => void
  onView?: (item: Tables[ContentType]) => void
  onDelete?: (id: string) => void
  className?: string
}

export function ContentList({
  type,
  onEdit,
  onView,
  onDelete,
  className = ''
}: ContentListProps) {
  const { fetchContent, remove, loading, error } = useUserContent(type)
  const [items, setItems] = useState<Tables[ContentType][]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchContent()
        setItems(data)
      } catch (err) {
        console.error('Error loading content:', err)
      }
    }

    loadContent()
  }, [fetchContent])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return

    setDeleting(id)
    try {
      await remove(id)
      setItems(items.filter(item => item.id !== id))
      onDelete?.(id)
    } catch (err) {
      console.error('Error deleting item:', err)
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Une erreur est survenue lors du chargement du contenu
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {type === 'qcm' && 'Mes QCM'}
          {type === 'sequences' && 'Mes Séquences'}
          {type === 'vocabulary_lists' && 'Mes Listes de Vocabulaire'}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      Créé le {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                    >
                      {deleting === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                Aucun contenu trouvé
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}