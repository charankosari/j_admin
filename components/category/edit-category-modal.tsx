"use client"

import { useState } from "react"
import { X, Upload, Trash2 } from "lucide-react"
import { APISDK } from "@/libs/api"

interface EditCategoryModalProps {
  onClose: () => void;
  reload: () => void;
  category: {
    id: string;
    name: string;
    image_url: string[];
  };
}

export function EditCategoryModal({ onClose, reload, category }: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState<string>(category.name)
  const [previewImage, setPreviewImage] = useState<string>("")
  const [categoryImage, setCategoryImage] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [existingImages, setExistingImages] = useState<string[]>(category.image_url)

  const handleUpdateCategory = async () => {
    if (!categoryName) {
      alert("Please provide a category name.")
      return
    }

    setLoading(true)
    try {
      const api = APISDK.getInstance()
      let finalImageUrls = [...existingImages]

      if (categoryImage) {
        const uploadResponse = await api.uploadFile(categoryImage)
        finalImageUrls.push(uploadResponse.url)
      }

      await api.updateCategory(category.id, categoryName, finalImageUrls)
      reload()
      alert("Category updated successfully!")
      onClose()
    } catch (error) {
      console.error("Failed to update category:", error)
      alert("Failed to update category.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setExistingImages(existingImages.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Edit Category</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Category Name</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="w-full border rounded-md px-3 py-2 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Existing Images</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Category ${index + 1}`} className="h-24 w-24 object-cover rounded-md" />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Add New Image</label>
              <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCategoryImage(file);
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                  className="hidden"
                  id="categoryImageInput"
                />
                <label htmlFor="categoryImageInput" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="h-30 w-auto mb-2" />
                    ) : (
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    )}
                    <p className="text-sm text-gray-600 mb-1">
                      Drag and Drop an image here or <span className="text-blue-500">Select file</span>
                    </p>
                    <p className="text-xs text-gray-500">Formats Supported: PNG, JPG, JPEG</p>
                  </div>
                </label>
              </div>
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
                onClick={handleUpdateCategory}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Category"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}