"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Tool } from '@/lib/supabase/types'

interface UseToolsOptions {
  activeOnly?: boolean;
}

export function useTools(options: UseToolsOptions = { activeOnly: true }) {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchTools = async () => {
      try {
        let query = supabase
          .from('tools')
          .select('*')

        if (options.activeOnly) {
          query = query.eq('is_active', true)
        }

        const { data, error } = await query.order('name')

        if (error) throw error
        setTools(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchTools()
  }, [options.activeOnly])

  const getToolBySlug = (slug: string) => {
    return tools.find(tool => tool.slug === slug)
  }

  return { 
    tools, 
    loading, 
    error,
    getToolBySlug
  }
}