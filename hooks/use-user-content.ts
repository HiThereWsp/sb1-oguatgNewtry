"use client"

import { useState, useCallback } from 'react'
import { useSupabase } from '@/lib/supabase/context'
import type { Tables } from '@/lib/supabase/client'

type ContentType = keyof Pick<Tables, 'qcm' | 'sequences' | 'vocabulary_lists'>

export function useUserContent<T extends ContentType>(contentType: T) {
  const { getContent, createContent, updateContent, deleteContent } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const fetchContent = useCallback(async (query?: object) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await getContent<Tables[T]>(contentType, query)
      if (error) throw error
      return data
    } catch (err) {
      setError(err as Error)
      return []
    } finally {
      setLoading(false)
    }
  }, [contentType, getContent])

  const create = useCallback(async (data: Omit<Tables[T], 'id' | 'user_id' | 'created_at'>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await createContent<Tables[T]>(contentType, data as any)
      if (result.error) throw result.error
      return result.data
    } catch (err) {
      setError(err as Error)
      return null
    } finally {
      setLoading(false)
    }
  }, [contentType, createContent])

  const update = useCallback(async (id: string, data: Partial<Tables[T]>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await updateContent<Tables[T]>(contentType, id, data)
      if (result.error) throw result.error
      return result.data
    } catch (err) {
      setError(err as Error)
      return null
    } finally {
      setLoading(false)
    }
  }, [contentType, updateContent])

  const remove = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await deleteContent(contentType, id)
      if (result.error) throw result.error
      return true
    } catch (err) {
      setError(err as Error)
      return false
    } finally {
      setLoading(false)
    }
  }, [contentType, deleteContent])

  return {
    loading,
    error,
    clearError,
    fetchContent,
    create,
    update,
    remove
  }
}