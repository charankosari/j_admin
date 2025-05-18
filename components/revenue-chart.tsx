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
  const [data, setData] = useState<RevenueData[]>([])
  const timeRangeMap = {
    '7d': 'sevenDays',
    '30d': 'thirtyDays',
    '90d': 'ninetyDays'
  } as const

  useEffect(() => {
    setMounted(true)
    fetchRevenueData()
  }, [selectedTimeRange])

  const fetchRevenueData = async () => {
    try {
      const api = APISDK.getInstance()
      const response = await api.getAllStats()
      const apiTimeRange = timeRangeMap[selectedTimeRange as keyof typeof timeRangeMap]
      
      const revenueData = Object.entries(response.data.revenueHistory[apiTimeRange])
        .map(([date, value]) => ({
          name: date,
          value: value
        }))

      setData(revenueData)
    } catch (error) {
      console.error('Failed to fetch revenue data:', error)
      setData([{ name: "Today", value: 0 }])
    }
  }

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

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center">Loading chart...</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
