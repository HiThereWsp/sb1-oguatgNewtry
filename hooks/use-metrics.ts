"use client"

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './use-auth'
import type { DailyMetric, Tool } from '@/lib/supabase/types'

interface MetricsData {
  metrics: DailyMetric[];
  tools: Tool[];
  totalUses: number;
  uniqueUsers: number;
}

interface DateRange {
  start: string;
  end: string;
}

export function useMetrics() {
  const { user } = useAuth()
  const [data, setData] = useState<MetricsData>({
    metrics: [],
    tools: [],
    totalUses: 0,
    uniqueUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMetrics = useCallback(async (dateRange?: DateRange) => {
    if (!user?.id) return

    try {
      // Vérifier si l'utilisateur est beta testeur
      const { data: userData, error: userError } = await supabase
        .from('user_data')
        .select('is_beta_tester')
        .eq('id', user.id)
        .single()

      if (userError) throw userError
      if (!userData.is_beta_tester) {
        throw new Error('Accès non autorisé aux métriques')
      }

      // Récupérer les outils
      const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('*')
        .order('name')

      if (toolsError) throw toolsError

      // Récupérer les métriques
      let query = supabase
        .from('daily_metrics')
        .select('*')

      if (dateRange) {
        query = query
          .gte('date', dateRange.start)
          .lte('date', dateRange.end)
      }

      const { data: metrics, error: metricsError } = await query
        .order('date', { ascending: false })

      if (metricsError) throw metricsError

      // Calculer les totaux
      const totalUses = metrics.reduce((sum, m) => sum + m.uses_count, 0)
      const uniqueUsers = metrics.reduce((sum, m) => sum + m.unique_users, 0)

      setData({
        metrics,
        tools,
        totalUses,
        uniqueUsers
      })
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [user])

  const trackToolUsage = useCallback(async (toolSlug: string) => {
    if (!user?.id) return

    try {
      const { data: tool } = await supabase
        .from('tools')
        .select('id')
        .eq('slug', toolSlug)
        .single()

      if (!tool) throw new Error('Outil non trouvé')

      const today = new Date().toISOString().split('T')[0]

      await supabase.rpc('update_tool_metrics', {
        p_tool_id: tool.id,
        p_date: today
      })

      // Rafraîchir les métriques si l'utilisateur est beta testeur
      const { data: userData } = await supabase
        .from('user_data')
        .select('is_beta_tester')
        .eq('id', user.id)
        .single()

      if (userData?.is_beta_tester) {
        await fetchMetrics()
      }
    } catch (err) {
      console.error('Erreur lors du tracking:', err)
    }
  }, [user, fetchMetrics])

  useEffect(() => {
    if (user?.id) {
      fetchMetrics()
    }
  }, [user, fetchMetrics])

  return {
    ...data,
    loading,
    error,
    fetchMetrics,
    trackToolUsage
  }
}