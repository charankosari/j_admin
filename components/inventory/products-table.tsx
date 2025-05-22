"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, PlusCircle, StarIcon } from "lucide-react"
import { NewProductModal } from "./new-product-modal"
import { NewSubCategoryModal } from "./new-subcategory-model"
import { NewCategoryModal } from "./new-category-modal"
import { APISDK } from "@/libs/api" // Assuming APISDK is correctly imported
import { IProduct } from "@/libs/api"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
// Define interfaces for category and subcategory
interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
}

export function ProductsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [showNewProductModal, setShowNewProductModal] = useState(false)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [showNewSubCategoryModal, setShowNewSubCategoryModal] = useState(false)
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };
  // Fetch categories and subcategories
  const fetchCategories = async () => {
    try {
      const api = APISDK.getInstance()
      const fetchedCategories = await api.getAllCategories()
      setCategories(fetchedCategories.map(category => ({ id: category.id, name: category.name })));
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchSubCategories = async () => {
    try {
      const api = APISDK.getInstance()
      const fetchedSubCategories = await api.getAllSubCategories()
      setSubCategories(fetchedSubCategories.map(subCategory => ({ id: subCategory.id, name: subCategory.name })));
    } catch (error) {
      console.error("Failed to fetch subcategories:", error)
    }
  }
  
  // Fetch products
  const fetchProducts = async () => {
    try {
      const api = APISDK.getInstance();
      let allProducts: IProduct[] = [];
      
      // First fetch all categories if not already loaded
      if (categories.length === 0) {
        await fetchCategories();
      }
      
      // Fetch products for each category
      for (const category of categories) {
        const categoryProducts = await api.getProductByCategoryId(category.id);
        if (categoryProducts && Array.isArray(categoryProducts)) {
          allProducts = [...allProducts, ...categoryProducts];
        } else if (categoryProducts) {
          allProducts.push(categoryProducts);
        }
      }
      
      setProducts(allProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }
  const handleVisibilityToggle = async (productId: string) => {
    try {
      const api = APISDK.getInstance();
      const product = products.find(p => p.id === productId);
      setProducts(currentProducts =>
        currentProducts.map(product =>
          product.id === productId
            ? { ...product, is_active: !product.is_active }
            : product
        )
      );
      if (product) {
        // Make the API call to update the product
        await api.updateProduct(productId, {
          is_active: !product.is_active
        });

        // Update local state after successful API call
      
      }
    } catch (error) {
      console.error("Failed to update product visibility:", error);
      // Optionally add error handling UI feedback here
    }
  }
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);
  useEffect(() => {
    if (categories.length > 0 && subCategories.length > 0) {
      fetchProducts();
    }
  }, [categories, subCategories]);

  // Helper functions to get category and subcategory names by ID
  const getCategoryNameById = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  }
  
  const getSubCategoryNameById = (subCategoryId: string): string => {
    const subCategory = subCategories.find(subCat => subCat.id === subCategoryId);
    return subCategory ? subCategory.name : "Unknown Subcategory";
  }

  const tabs = [
    { id: "All", label: "All", count: products.length },
    ...categories.map(category => ({
      id: category.id,
      label: category.name,
      count: products.filter(product => product.category_id === category.id).length
    }))
  ]

  const filteredProducts = activeTab === "All"
    ? products
    : products.filter(product => product.category_id === activeTab)

  const [activeProduct, setActiveProduct] = useState<string | null>(null);

    // Add new state for edit mode
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    
    // Update the handleEditProduct function
    const handleEditProduct = (product: IProduct) => {
      setEditingProduct(product);
      setShowNewProductModal(true);
      setActiveProduct(null);
    };

    const handleViewProduct = (product: IProduct) => {
      // Implement view functionality
      console.log('View product:', product);
      setActiveProduct(null);
    };

    const handleDeleteProduct = async (productId: string) => {
      if (window.confirm('Are you sure you want to delete this product?')) {
        try {
          const api = APISDK.getInstance();
          await api.deleteProduct(productId);
          await fetchProducts(); // Refresh the products list
          setActiveProduct(null);
        } catch (error) {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product');
        }
      }
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-800">All Products</h2>
          <p className="text-sm text-gray-500">Manage your inventory products</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowNewProductModal(true)}
            className="px-4 py-2 border rounded-md text-gray-800 flex gap-2 hover:bg-gray-50"
          >
            <PlusCircle />
            New Product
          </button>
          <button
            onClick={() => setShowNewCategoryModal(true)}
            className="px-4 py-2 border rounded-md text-gray-800 flex gap-2 hover:bg-gray-50"
          >
            <PlusCircle />
            New Category
          </button>
          <button
            onClick={() => setShowNewSubCategoryModal(true)}
            className="px-4 py-2 border rounded-md text-gray-800 flex gap-2 hover:bg-gray-50"
          >
            <PlusCircle />
            New sub category
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a Product name"
            className="pl-10 text-gray-700 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="border-b mb-4">
        <div className="flex space-x-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pb-2 px-1 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-md">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-md ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {getPaginatedProducts().map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={product.image_url?.[0] || "https://i.pinimg.com/474x/15/20/b2/1520b25e509ef0c742551f7aa06a6356.jpg"}
                        alt={product.name}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">#{product.id.substring(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">₹ {product.price.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.availability_count} Uts.</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getCategoryNameById(product.category_id)}</div>
                  <div className="text-sm text-gray-500">{getSubCategoryNameById(product.subcategory_id)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center">
                    <div className="mr-4 flex items-center">
                      <span className="mr-2 text-sm text-gray-500">Visibility</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={product.is_active}
                          onChange={() => handleVisibilityToggle(product.id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                          peer-focus:ring-orange-300 rounded-full peer 
                          peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500">
                        </div>
                      </label>
                    </div>
                    <div className="relative">
                    <Menu as="div" className="relative Z-100" >
                      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">   
                        <MoreVertical className="h-5 w-5" />
                      </MenuButton>
                      
                      <MenuItems
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                      >
                        <div className="py-1">
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => handleEditProduct(product)}
                                className={`${
                                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                } block w-full px-4 py-2 text-left text-sm`}
                              >
                                Edit Product
                              </button>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ active }) => (
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className={`${
                                  active ? 'bg-gray-100 text-red-600' : 'text-red-600'
                                } block w-full px-4 py-2 text-left text-sm`}
                              >
                                Delete Product
                              </button>
                            )}
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                      
                 
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-3 flex items-center justify-between border-t">
          <div className="text-sm text-gray-700">Showing {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-3"> Page {currentPage} of {Math.ceil(filteredProducts.length / itemsPerPage)}</span>
            <div className="flex">
              <button className="px-2 py-1 border rounded-l-md bg-gray-100 text-gray-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="px-2 py-1 border-t border-b border-r rounded-r-md bg-gray-100 text-gray-600"  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProducts.length / itemsPerPage), prev + 1))}
          disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showNewProductModal && <NewProductModal onClose={() =>{ setEditingProduct(null), setShowNewProductModal(false)}} categories={categories} subCategories={subCategories} reload={fetchProducts} editProduct={editingProduct}/>}
      {showNewCategoryModal && <NewCategoryModal onClose={() => setShowNewCategoryModal(false)} reload={fetchCategories}/>}
      {showNewSubCategoryModal && <NewSubCategoryModal onClose={() => setShowNewSubCategoryModal(false)} reload={fetchSubCategories}/>}
    </div>
  )
}
