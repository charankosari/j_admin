"use client"

import { useState, useEffect } from "react"
import { APISDK } from "@/libs/api"
import { Search, Pencil, Trash2, Plus } from "lucide-react"
import { NewSubCategoryModal } from "@/components/inventory/new-subcategory-model"
import { EditSubCategoryModal } from "@/components/subcategory/EditSubCategoryModal"

interface Category {
  id: string;
  name: string;
  count?: number;
}

// Update the SubCategory interface to match ISubCategory from API
interface SubCategory {
  id: string;
  name: string;
  image_url: string[]; // Changed from image_url to match API
  category_id: string;
}

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewModal, setShowNewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const fetchData = async () => {
    try {
        setIsLoading(true)
      const api = APISDK.getInstance()
      const [categoriesData, subCategoriesData] = await Promise.all([
        api.getAllCategories(),
        api.getAllSubCategories()
      ])

      // Transform the data to include category_name
      const enrichedSubCategories = subCategoriesData.map(sub => ({
        ...sub,
        image_url: sub.image_url || [], // Map image_urls to image_url
        category_name: categoriesData.find(cat => cat.id === sub.category_id)?.name || ''
      }))

      const categoriesWithCount = categoriesData.map(cat => ({
        ...cat,
        count: subCategoriesData.filter(sub => sub.category_id === cat.id).length
      }))

      setCategories(categoriesWithCount)
      setSubCategories(enrichedSubCategories)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
        setIsLoading(false)
      }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (subCategoryId: string) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        const api = APISDK.getInstance()
        await api.deleteSubCategory(subCategoryId)
        await fetchData()
      } catch (error) {
        console.error("Failed to delete subcategory:", error)
      }
    }
  }

  const handleEdit = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory)
    setShowEditModal(true)
  }

  const filteredSubCategories = subCategories.filter(subCategory => {
    const matchesSearch = subCategory.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeTab === "all" || subCategory.category_id === activeTab
    return matchesSearch && matchesCategory
  })
  const presentId = (id: string): string => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "Unknown category";
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Sub Categories</h1>
          <p className="text-gray-500 mt-1">Manage your product sub-categories</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition"
        >
          <Plus size={18} />
          Add Sub Category
        </button>
      </div>

      <div className="border-b mb-6">
        <div className="flex space-x-6 overflow-x-auto pb-2">
          <button
            key="all"
            className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${
              activeTab === "all"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-md">{subCategories.length}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${
                activeTab === category.id
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.name} <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-md">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition placeholder-gray-400 text-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredSubCategories.map((subCategory) => (
          <div
            key={subCategory.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="h-44 bg-white overflow-hidden flex justify-center items-center">
              <img
                src={subCategory.image_url[0] || "/placeholder.jpg"}
                alt={subCategory.name}
                className="w-auto h-full object-fit"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium text-gray-800">{subCategory.name}</h3>
                  <p className="text-sm text-gray-500">
                  {isLoading ? "Loading..." : presentId(subCategory.category_id)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(subCategory)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Edit subcategory"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(subCategory.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                    title="Delete subcategory"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredSubCategories.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 text-base">No subcategories found.</p>
          </div>
        )}
      </div>

      {showNewModal && (
        <NewSubCategoryModal
          onClose={() => setShowNewModal(false)}
          reload={fetchData}
        />
      )}

      {showEditModal && selectedSubCategory && (
        <EditSubCategoryModal
          onClose={() => {
            setShowEditModal(false)
            setSelectedSubCategory(null)
          }}
          reload={fetchData}
          subCategory={selectedSubCategory}
        />
      )}
    </div>
  )
}
