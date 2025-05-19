"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { APISDK } from "@/libs/api"

// Define color palette for categories
const COLORS = [
  "#4ADE80",  // Green
  "#A855F7",  // Purple
  "#F97316",  // Orange
  "#EAB308",  // Yellow
  "#3B82F6",  // Blue
  "#EC4899",  // Pink
  "#14B8A6",  // Teal
  "#8B5CF6",  // Indigo
  "#F43F5E",  // Rose
  "#06B6D4"   // Cyan
]

interface SalesData {
  name: string;
  value: number;
  color: string;
}

export function SalesDonutChart() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<SalesData[]>([])

  useEffect(() => {
    setMounted(true)
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      const api = APISDK.getInstance()
      const response = await api.getAllStats()
      
      // Transform and sort the data by value to make it more readable
      const salesData = response.data.salesOfProducts
        .filter(item => item.count > 0) // Only show items with sales
        .sort((a, b) => b.count - a.count) // Sort by count in descending order
        .map((item, index) => ({
          name: item.name,
          value: Number(item.count), // Ensure count is a number
          color: COLORS[index % COLORS.length]
        }));

      setData(salesData)
    } catch (error) {
      console.error('Failed to fetch sales data:', error)
      setData([])
    }
  }

  if (!mounted) {
    return <div className="h-64 flex items-center justify-center">Loading chart...</div>
  }

  return (
    <div className="h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={data} 
            cx="50%" 
            cy="50%" 
            innerRadius={60} 
            outerRadius={90} 
            paddingAngle={2} 
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-x-4 gap-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center">
            <span 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-black">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}