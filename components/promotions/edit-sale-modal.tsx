import React, { useState, useEffect } from "react";
import { ISale } from "@/libs/api/types";
import { APISDK } from "@/libs/api";
import { Upload, XCircle } from "lucide-react";

interface EditSaleModalProps {
  sale: ISale;
  onClose: () => void;
  onSave: () => void;
}

type ISaleForm = Omit<ISale, "start_date" | "end_date" | "created_at" | "updated_at"> & {
  start_date: string;
  end_date: string;
};

export function EditSaleModal({ sale, onClose, onSave }: EditSaleModalProps) {
  const [formData, setFormData] = useState<ISaleForm>({
    ...sale,
    start_date: new Date(sale.start_date).toISOString().split("T")[0],
    end_date: new Date(sale.end_date).toISOString().split("T")[0],
  });

  const [imageUrls, setImageUrls] = useState<string[]>(sale.image_url || []);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const api = APISDK.getInstance();
        const [categoriesData, subCategoriesData] = await Promise.all([
          api.getAllCategories(),
          api.getAllSubCategories(),
        ]);
        setCategories(categoriesData);
        setSubCategories(subCategoriesData);

        const categoryIds = categoriesData.map((c: any) => c.id);
        const productsData = await Promise.all(
          categoryIds.map((id: string) => api.getProductByCategoryId(id))
        );
        setProducts(productsData.flat());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const api = APISDK.getInstance();
      const uploadedUrls = await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          const res = await api.uploadFile(file);
          return res.url;
        })
      );
      setImageUrls([...imageUrls, ...uploadedUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData({ ...formData, [name]: values });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const salePayload: ISale = {
        ...formData,
        start_date: new Date(formData.start_date),
        end_date: new Date(formData.end_date),
        image_url: imageUrls,
        product_ids: formData.product_ids,
        category_ids: formData.category_ids,
        subcategory_ids: formData.subcategory_ids,
        meta_data: JSON.parse(formData.meta_data as unknown as string),
        created_at: sale.created_at,
        updated_at: new Date(),
      };

      if (salePayload.id) {
        await APISDK.getInstance().updateSale(salePayload.id, salePayload);
      } else {
        await APISDK.getInstance().createSale(salePayload);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save sale:", err);
      alert("Invalid Meta Data JSON.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-y-auto flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-lg rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{formData.id ? "Edit Sale" : "Create Sale"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Description */}
          {["name", "description"].map((name) => (
            <input
              key={name}
              type="text"
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
              className="w-full p-2 border rounded-md"
              required={name === "name"}
            />
          ))}

          {/* Discount */}
          <input
            type="number"
            name="discount_percentage"
            value={formData.discount_percentage}
            onChange={handleChange}
            placeholder="Discount (%)"
            className="w-full p-2 border rounded-md"
            required
          />

          {/* Date Pickers */}
          {["start_date", "end_date"].map((name) => (
            <input
              key={name}
              type="date"
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          ))}

          {/* Sale Type */}
          <select
            name="sale_type"
            value={formData.sale_type}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="product">Product</option>
            <option value="category">Category</option>
            <option value="subcategory">Subcategory</option>
          </select>

          {/* Multi-Select Dropdowns */}
          {[
            { label: "Categories", name: "category_ids", data: categories },
            { label: "Products", name: "product_ids", data: products },
            { label: "Subcategories", name: "subcategory_ids", data: subCategories },
          ].map(({ label, name, data }) => (
            <div key={name}>
              <label className="block font-medium mb-1">{label}</label>
              <select
                multiple
                value={(formData as any)[name]}
                onChange={(e) =>
                  handleMultiSelectChange(
                    name,
                    Array.from(e.target.selectedOptions, (opt) => opt.value)
                  )
                }
                className="w-full p-2 border rounded-md"
              >
                {data.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Meta Data */}
          <textarea
            name="meta_data"
            value={JSON.stringify(formData.meta_data, null, 2)}
            onChange={handleChange}
            rows={5}
            className="w-full p-2 border rounded-md font-mono"
          />

          {/* Image Upload */}
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label htmlFor="imageUpload" className="cursor-pointer text-gray-600 flex flex-col items-center">
              <Upload className="h-8 w-8 mb-1" />
              <span>Select images</span>
            </label>
          </div>

          {/* Uploaded Images */}
          <div className="flex flex-wrap gap-2">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative w-16 h-16 border rounded overflow-hidden">
                <img src={url} className="w-full h-full object-cover" alt="Sale" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-0 right-0 bg-white rounded-full"
                >
                  <XCircle className="h-4 w-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md">
              Save
            </button>
            <button type="button" onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-md">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
