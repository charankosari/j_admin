"use client"

import { useState, useEffect } from "react"
import { APISDK } from "@/libs/api"
import { Search, Pencil, Trash2, Plus } from "lucide-react"
import { NewCategoryModal } from "@/components/inventory/new-category-modal"
import { EditCategoryModal } from "@/components/category/edit-category-modal"

interface Category {
  id: string;
  name: string;
  image_url: string[];
}

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewModal, setShowNewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const fetchCategories = async () => {
    try {
      const api = APISDK.getInstance()
      const data = await api.getAllCategories()
      setCategories(data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const api = APISDK.getInstance()
        await api.deleteCategory(categoryId)
        await fetchCategories()
      } catch (error) {
        console.error("Failed to delete category:", error)
      }
    }
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Manage your product categories</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition placeholder-gray-400 text-gray-600"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="h-44 bg-white overflow-hidden flex justify-center items-center">
              <img
                src={category.image_url[0] || "/placeholder.jpg"}
                alt={category.name}
                className="w-auto h-full object-fit"
              />
            </div>
            <div className="p-4 flex justify-between items-start">
              <h3 className="text-base font-medium text-gray-800">{category.name}</h3>

              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                  title="Edit category"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                  title="Delete category"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 text-base">No categories found.</p>
          </div>
        )}
      </div>

      {/* New Category Modal */}
      {showNewModal && (
        <NewCategoryModal
          onClose={() => setShowNewModal(false)}
          reload={fetchCategories}
        />
      )}

      {/* Edit Category Modal */}
      {showEditModal && selectedCategory && (
        <EditCategoryModal
          onClose={() => {
            setShowEditModal(false)
            setSelectedCategory(null)
          }}
          reload={fetchCategories}
          category={selectedCategory}
        />
      )}
    </div>
  )
}
