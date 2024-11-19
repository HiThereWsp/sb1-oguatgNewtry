"use client"

import { useEffect, useState } from 'react'
import { useMetrics } from '@/hooks/use-metrics'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, BarChart2, Users, Activity } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface DateRange {
  start: string;
  end: string;
}

export function MetricsDisplay() {
  const { metrics, tools, totalUses, uniqueUsers, loading, error, fetchMetrics } = useMetrics()
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchMetrics(dateRange)
  }, [dateRange, fetchMetrics])

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
        {error.message}
      </div>
    )
  }

  const chartData = metrics.map(metric => ({
    date: new Date(metric.date).toLocaleDateString(),
    utilisations: metric.uses_count,
    utilisateurs: metric.unique_users
  }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisations Totales
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs Uniques
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outils Actifs
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tools.filter(t => t.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolution de l'utilisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="utilisations" 
                  stroke="#8884d8" 
                  name="Utilisations"
                />
                <Line 
                  type="monotone" 
                  dataKey="utilisateurs" 
                  stroke="#82ca9d" 
                  name="Utilisateurs"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Détails par outil</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {tools.map(tool => {
                const toolMetrics = metrics.filter(m => m.tool_id === tool.id)
                const totalUses = toolMetrics.reduce((sum, m) => sum + m.uses_count, 0)
                
                return (
                  <div 
                    key={tool.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-sm text-gray-500">{tool.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{totalUses}</div>
                      <div className="text-sm text-gray-500">utilisations</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}