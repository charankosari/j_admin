"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { APISDK } from "@/libs/api"

interface PeakHourData {
  name: string;
  hour: number;
  orders: number;
}

interface PeakHoursChartProps {
  selectedTimeRange: string;
}

interface ApiPeakHourData {
  [date: string]: {
    [hour: string]: number;
  };
}

interface ApiResponse {
  sevenDays: ApiPeakHourData;
  thirtyDays: ApiPeakHourData;
  ninetyDays: ApiPeakHourData;
}

export default function PeakHoursChart({ selectedTimeRange }: PeakHoursChartProps) {
  const [mounted, setMounted] = useState(false)
  const [allData, setAllData] = useState<{
    sevenDays: PeakHourData[];
    thirtyDays: PeakHourData[];
    ninetyDays: PeakHourData[];
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
    fetchPeakHourData()
  }, []) // Keep this effect for initial load

  // Add new effect to handle time range changes
  useEffect(() => {
    if (mounted && selectedTimeRange) {
      fetchPeakHourData()
    }
  }, [selectedTimeRange, mounted])

  const fetchPeakHourData = async () => {
    try {
      const api = APISDK.getInstance()
      const response = await api.getAllStats()
      
      const transformData = (data: ApiPeakHourData) => {
        return Object.entries(data)
          .map(([date, hours]) => {
            const hourlyOrders = Object.entries(hours)
              .map(([hour, count]) => ({
                hour: parseInt(hour),
                orders: count
              }))

            const peakHour = hourlyOrders.reduce((max, current) => 
              current.orders > max.orders ? current : max
            , hourlyOrders[0])

            return {
              name: date,
              hour: peakHour.hour,
              orders: peakHour.orders
            }
          })
      }

      setAllData({
        sevenDays: transformData(response.data.peakHours.sevenDays),
        thirtyDays: transformData(response.data.peakHours.thirtyDays),
        ninetyDays: transformData(response.data.peakHours.ninetyDays)
      })
    } catch (error) {
      console.error('Failed to fetch peak hour data:', error)
    }
  }

  const transformData = (data: Record<string, Record<string, number>>) => {
    return Object.entries(data)
      .map(([date, hours]) => {
        const hourlyOrders = Object.entries(hours)
          .map(([hour, count]) => ({
            hour: parseInt(hour),
            orders: count
          }))

        const peakHour = hourlyOrders.reduce((max, current) => 
          current.orders > max.orders ? current : max
        , hourlyOrders[0])

        return {
          name: date,
          hour: peakHour.hour,
          orders: peakHour.orders
        }
      })
  }

  const currentData = allData[timeRangeMap[selectedTimeRange as keyof typeof timeRangeMap]] || []

  const formatHour = (hour: number): string => {
    if (hour === 12) return "12 PM"
    if (hour === 0 || hour === 24) return "12 AM"
    if (hour > 12) return `${hour - 12} PM`
    return `${hour} AM`
  }

  if (!mounted || currentData.length === 0) {
    return <div className="h-64 w-full flex items-center justify-center">Loading chart...</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={currentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            dataKey="name"
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            domain={[0, 24]}
            ticks={[0, 6, 12, 18, 24]}
            tickFormatter={formatHour}
          />
          <Tooltip
            formatter={(value: number) => [formatHour(value), "Peak Hour"]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{ 
              backgroundColor: 'white',
              borderRadius: "8px", 
              border: "1px solid #e2e8f0",
              padding: "8px"
            }}
          />
          <Line
            type="monotone"
            dataKey="hour"
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