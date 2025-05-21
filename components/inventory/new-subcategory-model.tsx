"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { APISDK } from "@/libs/api" // Assuming APISDK is correctly imported

// Define the props interface for the component
interface NewSubCategoryModalProps {
  onClose: () => void;
  reload: () => void;
}

export function NewSubCategoryModal({ onClose, reload }: NewSubCategoryModalProps) {
  const [subCategoryName, setSubCategoryName] = useState<string>("")
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const api = APISDK.getInstance()
        const fetchedCategories = await api.getAllCategories()
        setCategories(fetchedCategories.map(category => category.name))
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [])

  const handleAddSubCategory = async () => {
    if (!subCategoryName || !selectedCategory) {
      alert("Please provide a subcategory name and select a category.")
      return
    }

    setLoading(true)
    try {
      const api = APISDK.getInstance()
      await api.createNewSubCategory(subCategoryName, selectedCategory)
      reload()
      alert("Subcategory added successfully!")
      onClose()
    } catch (error) {
      console.error("Failed to add subcategory:", error)
      alert("Failed to add subcategory.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">New Sub Category</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Category Name</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-gray-800"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Sub Category Name</label>
              <input
                type="text"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="Enter subcategory name"
                className="w-full border rounded-md px-3 py-2 text-gray-800"
              />
            </div>

            <div className="mt-8 flex space-x-3">
              <button
                className="flex-1 py-2 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-50"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                onClick={handleAddSubCategory}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Sub Category"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}