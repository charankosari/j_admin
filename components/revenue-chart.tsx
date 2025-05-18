"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { APISDK } from "@/libs/api"

interface RevenueData {
  name: string;
  value: number;
}

interface RevenueChartProps {
  selectedTimeRange: string;
}

export function RevenueChart({ selectedTimeRange }: RevenueChartProps) {
  const [mounted, setMounted] = useState(false)
  const [allData, setAllData] = useState<{
    sevenDays: RevenueData[];
    thirtyDays: RevenueData[];
    ninetyDays: RevenueData[];
  }>({
    sevenDays: [],
    thirtyDays: [],
    ninetyDays: []
  })

  const timeRangeMap = {
    '7d': 'sevenDays',
    '30d': 'thirtyDays',
    '90d': 'ninetyDays'
  } as const

  useEffect(() => {
    setMounted(true)
    fetchRevenueData()
  }, []) // Keep this effect for initial load

  // Add new effect to handle time range changes
  useEffect(() => {
    if (mounted && selectedTimeRange) {
      fetchRevenueData()
    }
  }, [selectedTimeRange, mounted])

  const fetchRevenueData = async () => {
    try {
      const api = APISDK.getInstance()
      const response = await api.getAllStats()
      
      // Direct access to revenueHistory data
      const revenueData = response.data.revenueHistory
      
      setAllData({
        sevenDays: Object.entries(revenueData.sevenDays || {})
          .map(([date, value]) => ({ name: date, value })),
        thirtyDays: Object.entries(revenueData.thirtyDays || {})
          .map(([date, value]) => ({ name: date, value })),
        ninetyDays: Object.entries(revenueData.ninetyDays || {})
          .map(([date, value]) => ({ name: date, value }))
      })
    } catch (error) {
      console.error('Failed to fetch revenue data:', error)
    }
  }

  // Get current time range data
  const currentData = allData[timeRangeMap[selectedTimeRange as keyof typeof timeRangeMap]] || []

  const formatIndianNumber = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)}Cr`
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  if (!mounted || currentData.length === 0) {
    return <div className="h-64 flex items-center justify-center">Loading chart...</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={currentData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={formatIndianNumber}
          />
          <Tooltip
            formatter={(value: number) => [`₹${formatIndianNumber(value)}`, "Revenue"]}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#F97316"
            strokeWidth={2}
            dot={{ r: 4, fill: "#F97316", strokeWidth: 2, stroke: "#FFF" }}
            activeDot={{ r: 6, fill: "#F97316", strokeWidth: 2, stroke: "#FFF" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
