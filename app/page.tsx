"use client";

import { useState, useEffect } from "react" // Add useEffect import
import { Breadcrumb } from "@/components/breadcrumb"
import { MetricCards } from "@/components/metric-cards"
import { RevenueChart } from "@/components/revenue-chart"
import { SalesDonutChart } from "@/components/sales-donut-chart"
import PeakHoursChart from "@/components/peak-hour-chart"
import { MostSoldItems } from "@/components/most-sold-items"
import { ProductCards } from "@/components/product-cards"
import { useAuth } from "@/hooks/useAuth"
import { CustomSelect } from "@/components/ui/select"
import { APISDK } from "@/libs/api" // Add APISDK import

const timeRangeOptions = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
]

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([])
  const [revenueTimeRange, setRevenueTimeRange] = useState("7d")
  const [peakHoursTimeRange, setPeakHoursTimeRange] = useState("7d")

  useEffect(() => {
    fetchCategoriesAndSetDefault()
  }, [])

  const fetchCategoriesAndSetDefault = async () => {
    try {
      const api = APISDK.getInstance()
      const [categories, statsResponse] = await Promise.all([
        api.getDishCategories(),
        api.getAllStats()
      ])
      
      const options = categories.map(category => ({
        label: category.name,
        value: category.id
      }))

      setCategoryOptions(options)

      // Find the category with most sales
      const categorySales = statsResponse.data.salesOfAllProducts
        .map(category => ({
          id: category.category.id,
          totalSales: category.dishes.reduce((sum, dish) => sum + dish.count, 0)
        }))
        .sort((a, b) => b.totalSales - a.totalSales)

      // Set the most sold category as default
      if (categorySales.length > 0) {
        setSelectedCategory(categorySales[0].id)
      } else if (options.length > 0) {
        setSelectedCategory(options[0].value)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      setCategoryOptions([])
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>You dont have access to this page</div>;
  }

  return (
    <>
      <Breadcrumb items={["Cafe", "Overview"]} />
      <main className="flex-1 p-6">
        <MetricCards />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm text-gray-500">Over the days</h3>
              <CustomSelect 
                options={timeRangeOptions} 
                value={revenueTimeRange}
                onValueChange={setRevenueTimeRange}
              />
            </div>
            <RevenueChart selectedTimeRange={revenueTimeRange} />
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm text-gray-500">Sales by Category or Products</h3>
            </div>
            <SalesDonutChart />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm text-gray-500">Peak Operating Hours</h3>
              <CustomSelect 
                options={timeRangeOptions} 
                value={peakHoursTimeRange}
                onValueChange={setPeakHoursTimeRange}
              />
            </div>
            <PeakHoursChart selectedTimeRange={peakHoursTimeRange} />
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm text-gray-500">Most sold items by Category</h3>
              <CustomSelect 
                options={categoryOptions} 
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              />
            </div>
            <MostSoldItems selectedCategory={selectedCategory} />
            <ProductCards selectedCategory={selectedCategory} />
          </div>
        </div>
      </main>
    </>
  )
}