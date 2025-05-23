"use client"

import { useState,useEffect } from "react"
import { X, Upload, ChevronDown, ChevronUp } from "lucide-react"
import { APISDK } from "@/libs/api" 
import { IProduct } from "@/libs/api"
// Define interface for component props
// Update the type definition for meta_data
interface MetaData {
  "3d_image_urls": string[];
  variants: string[];
  colors: { colorName: string; colorCode: string; }[];
  slashed_price: string;
  discount: string;
  long_description: string;
}
// Update the NewProductModalProps to include the new MetaData type
interface NewProductModalProps {
  onClose: () => void;
  categories: Category[];  // Changed from string[] to Category[]
  subCategories: SubCategory[];  // Changed from string[] to SubCategory[]
  meta_data?: MetaData; // Optional if needed
  reload:()=>void;
  editProduct?: IProduct | null;
}

// Define interface for product variant
interface ProductVariant {
  name: string;
  color: string;
}
interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
}
import { XCircle } from "lucide-react"; // Import the delete icon

export function NewProductModal({ onClose, categories, subCategories,reload,editProduct }: NewProductModalProps) {
  const [productName, setProductName] = useState<string>(editProduct?.name || "")
  const [productDescription, setProductDescription] = useState<string>(editProduct?.description || "")
  const [productPrice, setProductPrice] = useState<string>(editProduct?.price ? editProduct.price.toString() : "")
  const [slashedPrice, setSlashedPrice] = useState<string>(
    editProduct?.meta_data?.slashed_price || ""
  )
  const [stockQty, setStockQty] = useState<string>(
    editProduct?.availability_count !== undefined ? editProduct.availability_count.toString() : ""
  )
  const [productCategory, setProductCategory] = useState<string>(editProduct?.category_id || "")
  const [subCategory, setSubCategory] = useState<string>(editProduct?.subcategory_id || "")
  const [productVisibility, setProductVisibility] = useState<boolean>(
    editProduct?.is_active ?? true
  )
  const [imageUrls, setImageUrls] = useState<string[]>(editProduct?.image_url || [])
  const [showImages, setShowImages] = useState<boolean>((editProduct?.image_url?.length ?? 0) > 0)
  const [threeDImageUrls, setThreeDImageUrls] = useState<string[]>(
    editProduct?.meta_data?.["3d_image_urls"]
      ? JSON.parse(editProduct.meta_data["3d_image_urls"])
      : []
  )
  const [longDescription, setLongDescription] = useState<string>(
    editProduct?.meta_data?.long_description || ""
  );
  const [variantNames, setVariantNames] = useState<string[]>(
    editProduct?.meta_data?.variants
      ? JSON.parse(editProduct.meta_data.variants)
      : []
  )
  const [variantColors, setVariantColors] = useState<string[]>(
    editProduct?.meta_data?.colors
      ? JSON.parse(editProduct.meta_data.colors).map((c: any) => Object.values(c)[0])
      : []
  )
  const [colorNames, setColorNames] = useState<string[]>(
    editProduct?.meta_data?.colors
      ? JSON.parse(editProduct.meta_data.colors).map((c: any) => Object.keys(c)[0])
      : []
  )
  const [discount, setDiscount] = useState<string>(
    editProduct?.meta_data?.discount || ""
  )
  const [dimensions, setDimensions] = useState({
    height: editProduct?.meta_data?.dimensions ? JSON.parse(editProduct.meta_data.dimensions).height : "",
    weight: editProduct?.meta_data?.dimensions ? JSON.parse(editProduct.meta_data.dimensions).weight : "",
    length: editProduct?.meta_data?.dimensions ? JSON.parse(editProduct.meta_data.dimensions).length : "",
    breadth: editProduct?.meta_data?.dimensions ? JSON.parse(editProduct.meta_data.dimensions).breadth : ""
  });

  useEffect(() => {
    if (productPrice && slashedPrice) {
      const price = parseFloat(productPrice.replace(/,/g, ''))
      const slashed = parseFloat(slashedPrice.replace(/,/g, ''))
      if (!isNaN(price) && !isNaN(slashed) && price > 0 && slashed > price) {
        const discountPercent = Math.round(((slashed - price) / slashed) * 100)
        setDiscount(discountPercent.toString())
      } else {
        setDiscount("")
      }
    } else {
      setDiscount("")
    }
  }, [productPrice, slashedPrice])

useEffect(() => {
  if (editProduct) {
    setProductName(editProduct.name || "")
    setProductDescription(editProduct.description || "")
    setProductPrice(editProduct.price ? editProduct.price.toString() : "")
    setSlashedPrice(editProduct.meta_data?.slashed_price || "")
    setStockQty(editProduct.availability_count !== undefined ? editProduct.availability_count.toString() : "")
    setProductCategory(editProduct.category_id || "")
    setSubCategory(editProduct.subcategory_id || "")
    setProductVisibility(editProduct.is_active ?? true)
    setImageUrls(editProduct.image_url || [])
    setShowImages((editProduct.image_url?.length ?? 0) > 0)
    setThreeDImageUrls(
      editProduct.meta_data?.["3d_image_urls"]
        ? JSON.parse(editProduct.meta_data["3d_image_urls"])
        : []
    )
    setVariantNames(
      editProduct.meta_data?.variants
        ? JSON.parse(editProduct.meta_data.variants)
        : []
    )
    setVariantColors(
      editProduct.meta_data?.colors
        ? JSON.parse(editProduct.meta_data.colors).map((c: any) => Object.values(c)[0])
        : []
    )
    setColorNames(
      editProduct.meta_data?.colors
        ? JSON.parse(editProduct.meta_data.colors).map((c: any) => Object.keys(c)[0])
        : []
    )
    setDiscount(editProduct.meta_data?.discount || "")
    setLongDescription(editProduct.meta_data?.long_description || "");
    if (editProduct.meta_data?.dimensions) {
      const dims = JSON.parse(editProduct.meta_data.dimensions);
      setDimensions(dims);
    }
  }
}, [editProduct])


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const api = APISDK.getInstance();
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const response = await api.uploadFile(file); // Use the upload function from APISDK
          return response.url; // Assuming the response contains the URL
        })
      );
      setImageUrls([...imageUrls, ...uploadedUrls]);
      setShowImages(true);
    }
  };
  const formattedColors = variantColors.map((color, index) => ({
    [colorNames[index] || `Color ${index + 1}`]: color
  }));
  const metaData = {
    "3d_image_urls": JSON.stringify(threeDImageUrls),
    variants: JSON.stringify(variantNames),
        colors: JSON.stringify(variantColors.map((color, index) => ({
          [colorNames[index] || `Color ${index + 1}`]: color
        }))),
    slashed_price: slashedPrice,
    discount: discount,
    long_description: longDescription,
    dimensions: JSON.stringify(dimensions),
  };
  const handleAddProduct = async () => {
    try {
      const api = APISDK.getInstance();
   
      
      const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice.replace(/,/g, '')),
        image_url: imageUrls,
        category_id: productCategory,
        subcategory_id: subCategory,
        meta_data: metaData, 
        is_active: productVisibility,
        availability_count: parseInt(stockQty, 10),
      };
      console.log('Product Data:', productData);
      await api.createProduct(productData);
      reload();
      alert("Product added successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product.");
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImageUrls);
  };

  const handleDimensionChange = (dimension: keyof typeof dimensions, value: string) => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: value
    }));
  };

  const handleAddVariantName = () => {
    setVariantNames([...variantNames, ""]);
  };

  const handleAddVariantColor = () => {
    setVariantColors([...variantColors, "#000000"]); // Default color
  };

  const handleVariantNameChange = (index: number, value: string) => {
    const newVariantNames = [...variantNames];
    newVariantNames[index] = value;
    setVariantNames(newVariantNames);
  };

  const handleVariantColorChange = (index: number, value: string, type: 'color' | 'name') => {
    const newVariantColors = [...variantColors];
    if (type === 'color') {
      newVariantColors[index] = value;
      setVariantColors(newVariantColors);
    } else {
      const newColorNames = [...colorNames];
      newColorNames[index] = value;
      setColorNames(newColorNames);
    }
  };
  
  const handleAddOrUpdateProduct = async () => {
    try {
      const api = APISDK.getInstance();
      const productData = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice.replace(/,/g, '')),
        image_url: imageUrls,
        category_id: productCategory,
        subcategory_id: subCategory,
        meta_data: metaData,
        is_active: productVisibility,
        availability_count: parseInt(stockQty, 10),
      };
      if (editProduct) {
        await api.updateProduct(editProduct.id, productData);
        alert("Product updated successfully!");
      } else {
        await api.createProduct(productData);
        alert("Product added successfully!");
      }
      reload();
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Product Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Product Description</label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-gray-800 min-h-[100px]"
              />
            </div>

            <div>
      <label className="block text-sm text-gray-600 mb-1">Long Description (Detailed)</label>
      <textarea
        value={longDescription}
        onChange={(e) => setLongDescription(e.target.value)}
        className="w-full border rounded-md px-3 py-2 text-gray-800 min-h-[200px]"
        placeholder="Enter detailed product description, features, specifications, etc."
      />
    </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Product Images</h3>

              <div className="border-2 border-dashed rounded-md p-8 mb-4 flex flex-col items-center justify-center">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="productImageInput"
                />
                <label htmlFor="productImageInput" className="cursor-pointer flex flex-col items-center justify-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag and Drop the Images here or <span className="text-blue-500">Select file</span>
                  </p>
                  <p className="text-xs text-gray-500">Formats Supported: PNG, JPG, JPEG, MP4 and MOV</p>
                </label>
              </div>

              {showImages && (
                <div className="flex space-x-2 mb-1">
                  {imageUrls.map((image, index) => (
                    <div key={index} className="relative w-16 h-16 border rounded-md overflow-hidden">
                      <img
                        src={image || "https://i.pinimg.com/474x/15/20/b2/1520b25e509ef0c742551f7aa06a6356.jpg"}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-white rounded-full"
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">First Image will be the cover</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select the Product Category</label>
                <div className="relative">
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-gray-800 appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select the Sub-Category</label>
                <div className="relative">
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-gray-800 appearance-none"
                  >
                    <option value="">Select Sub-Category</option>
                    {subCategories.map((subCat) => (
                      <option key={subCat.id} value={subCat.id}>
                        {subCat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">Product Dimensions</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Height (cm)</label>
          <input
            type="text"
            value={dimensions.height}
            onChange={(e) => handleDimensionChange('height', e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-800"
            placeholder="Enter height"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Weight (kg)</label>
          <input
            type="text"
            value={dimensions.weight}
            onChange={(e) => handleDimensionChange('weight', e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-800"
            placeholder="Enter weight"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Length (cm)</label>
          <input
            type="text"
            value={dimensions.length}
            onChange={(e) => handleDimensionChange('length', e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-800"
            placeholder="Enter length"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Breadth (cm)</label>
          <input
            type="text"
            value={dimensions.breadth}
            onChange={(e) => handleDimensionChange('breadth', e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-800"
            placeholder="Enter breadth"
          />
        </div>
      </div>
    </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Enter the Stock Qty.</label>
                <input
                  type="text"
                  value={stockQty}
                  onChange={(e) => setStockQty(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                />
              </div>
              <div className="flex items-center">
                <label className="block text-sm text-gray-600 mr-4">Product Visibility</label>
                <div className="relative inline-flex items-center cursor-pointer">
                  <div className={`w-10 h-5 rounded-full ${productVisibility ? "bg-orange-500" : "bg-gray-200"}`}>
                    <div
                      className={`absolute w-3.5 h-3.5 bg-white rounded-full top-[3px] transition-transform ${
                        productVisibility ? "translate-x-[22px]" : "translate-x-[3px]"
                      }`}
                      onClick={() => setProductVisibility(!productVisibility)}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
      <label className="block text-sm text-gray-600 mb-1">Price</label>
      <input
        type="text"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
        className="w-full border rounded-md px-3 py-2 text-gray-800"
      />
    </div>
    <div>
      <label className="block text-sm text-gray-600 mb-1">Slashed Price</label>
      <input
        type="text"
        value={slashedPrice}
        onChange={(e) => setSlashedPrice(e.target.value)}
        className="w-full border rounded-md px-3 py-2 text-gray-800"
      />
    </div>
    <div>
      <label className="block text-sm text-gray-600 mb-1">Discount (%)</label>
      <input
        type="text"
        value={discount}
        readOnly
        className="w-full border rounded-md px-3 py-2 text-gray-800 bg-gray-100"
      />
    </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Product Variants (optional)</h3>
              <div className="flex flex-wrap space-x-4">
                {variantNames.map((name, index) => (
                  <div key={index} className="flex flex-col items-center mb-4">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleVariantNameChange(index, e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-gray-800"
                      placeholder={`Variant Name ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              <button onClick={handleAddVariantName} className="text-blue-500 mt-2">
                Add Variant
              </button>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Colors (optional)</h3>
              <div className="flex flex-wrap space-x-4">
                {variantColors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center mb-4">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => handleVariantColorChange(index, e.target.value, 'color')}
                      className="w-16 h-16 border rounded-md"
                    />
                    <input
                      type="text"
                      value={colorNames[index] || ''}
                      onChange={(e) => handleVariantColorChange(index, e.target.value, 'name')}
                      placeholder={`Color Description ${index + 1}`}
                      className="mt-2 text-center border rounded-md px-2 py-1 text-gray-800"
                    />
                  </div>
                ))}
              </div>
              <button onClick={handleAddVariantColor} className="text-blue-500 mt-2">
                Add Color
              </button>
            </div>
          </div>

<div className="mt-8">
  <button
    className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600"
    onClick={editProduct ? handleAddOrUpdateProduct : handleAddProduct}
  >
    {editProduct ? "Update Product" : "Add Product"}
  </button>
</div>
        </div>
      </div>
    </div>
  )
}
