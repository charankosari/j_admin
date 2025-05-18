"use client"

import { useEffect, useState } from "react"
import { APISDK, IDish } from "@/libs/api"

interface ProductData {
  name: string;
  units: number;
  image: string;
  id: string;
  category: string;
}

interface ProductCardsProps {
  selectedCategory: string;
}

export function ProductCards({ selectedCategory }: ProductCardsProps) {
  const [products, setProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory]) // Refetch when category changes

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const api = APISDK.getInstance()
      const [statsResponse, dishesResponse] = await Promise.all([
        api.getAllStats(),
        api.getDishes()
      ])

      // Create a map of dish IDs to their pictures and categories
      const dishDetails = new Map(
        dishesResponse.map(dish => [
          dish.id, 
          { 
            picture: dish.picture,
            category: dish.dish_category_id
          }
        ])
      )

      // Transform and combine the data
      const productData = statsResponse.data.salesOfAllProducts
        .flatMap(category =>
          category.dishes.map(dish => {
            const details = dishDetails.get(dish.id)
            return {
              id: dish.id,
              name: dish.name,
              units: dish.count,
              image: details?.picture || "/placeholder.svg",
              category: details?.category || ""
            }
          })
        )
        .filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase())
        .sort((a, b) => b.units - a.units)

      setProducts(productData)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-32">Loading...</div>
  }

  if (products.length === 0) {
    return <div className="flex justify-center items-center h-32">No products found for this category</div>
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {products.map((product) => (
        <div key={product.id} className="flex-shrink-0 border rounded-lg p-3 flex items-center gap-3 min-w-[200px]">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-md object-cover"
          />
          <div>
            <h4 className="font-medium text-orange-500">{product.name}</h4>
            <p className="text-sm text-black">{product.units} Units sold</p>
          </div>
        </div>
      ))}
    </div>
  )
}