"use client"

import { useEffect, useState } from "react"
import { APISDK } from "@/libs/api"

interface SoldItem {
  product: string;
  units: number;
}

interface MostSoldItemsProps {
  selectedCategory: string;
}

export function MostSoldItems({ selectedCategory }: MostSoldItemsProps) {
  const [items, setItems] = useState<SoldItem[]>([])

  useEffect(() => {
    fetchSoldItems()
  }, [selectedCategory]) // Only re-fetch when category changes

  const fetchSoldItems = async () => {
    try {
      const api = APISDK.getInstance()
      const response = await api.getAllStats()
      
      // Transform and filter the data based on selected category
      const soldItems = response.data.salesOfAllProducts
        .filter(category => category.category.id === selectedCategory)
        .flatMap(category => 
          category.dishes.map(dish => ({
            product: dish.name,
            units: dish.count
          }))
        )
        .sort((a, b) => b.units - a.units)

      setItems(soldItems)
    } catch (error) {
      console.error('Failed to fetch sold items:', error)
      setItems([])
    }
  }

  if (items.length === 0) {
    return (
      <div className="mb-4 text-center text-gray-500 py-4">
        No items found for this category
      </div>
    )
  }

  return (
    <div className="mb-4">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-black">
            <th className="pb-2 font-medium">Product</th>
            <th className="pb-2 font-medium">Units Sold</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="text-gray-700 text-sm">
              <td className="py-2">{item.product}</td>
              <td className="py-2">{item.units}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}