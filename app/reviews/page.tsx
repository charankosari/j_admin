"use client"

import { useEffect, useState } from "react";
import { APISDK } from "@/libs/api";
import { Search } from "lucide-react";
import { ICategory, IProduct, IReview } from "@/libs/api";

export default function ReviewsPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  // Fetch categories and products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const api = APISDK.getInstance();
      const cats = await api.getAllCategories();
      setCategories(cats);

      // Fetch all products for all categories
      let allProducts: IProduct[] = [];
      for (const cat of cats) {
        const prods = await api.getProductByCategoryId(cat.id);
        allProducts = allProducts.concat(prods || []);
      }
      setProducts(allProducts);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fetch reviews when product changes
  useEffect(() => {
    if (!selectedProduct) return;
    const fetchReviewsAndAverage = async () => {
      setLoading(true);
      const api = APISDK.getInstance();
      const revs = await api.getReviewsByProductId(selectedProduct.id);
      setReviews(revs);

      // Fetch average rating
      try {
        const avgRes = await api.averageRatingsByProductId(selectedProduct.id);
        // The API returns { average_rating: number } or similar
        setAverageRating(avgRes ?? null);
      } catch {
        setAverageRating(null);
      }

      setLoading(false);
    };
    fetchReviewsAndAverage();
  }, [selectedProduct]);

  // Filter products and reviews by search term
  useEffect(() => {
    // Filter products by name or category name
    let filteredProds = products;
    if (searchTerm) {
      filteredProds = products.filter((product) => {
        const category = categories.find((cat) => cat.id === product.category_id);
        const categoryName = category ? category.name : "";
        return (
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    setFilteredProducts(filteredProds);

    // If a product is selected, filter its reviews by comment or rating
    if (searchTerm && selectedProduct) {
      setFilteredReviews(
        reviews.filter(
          (r) =>
            r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.rating?.toString().includes(searchTerm)
        )
      );
    } else {
      setFilteredReviews(reviews);
    }
  }, [searchTerm, products, categories, reviews, selectedProduct]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    const api = APISDK.getInstance();
    await api.deleteReviewById(reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  // If the selected product is not in the filtered list, deselect it
  useEffect(() => {
    if (selectedProduct && !filteredProducts.some((p) => p.id === selectedProduct.id)) {
      setSelectedProduct(undefined);
      setReviews([]);
      setFilteredReviews([]);
    }
  }, [filteredProducts, selectedProduct]);

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a Product name, Category"
            className="pl-10 text-black pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 w-full bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      {/* Product selector */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex space-x-6 overflow-x-auto pb-2">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              className={`flex flex-col items-center min-w-[120px] pb-2 px-1 font-medium text-sm whitespace-nowrap transition-colors ${
                selectedProduct?.id === product.id
                  ? "text-black border-b-2 border-black"
                  : "text-gray-500 hover:text-black"
              }`}
              style={{ borderRadius: "0.5rem", background: selectedProduct?.id === product.id ? "#f5f5f5" : "transparent" }}
              onClick={() => setSelectedProduct(product)}
            >
              <img
                src={product.image_url?.[0] || "https://i.pinimg.com/474x/15/20/b2/1520b25e509ef0c742551f7aa06a6356.jpg"}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-full border border-gray-200 mb-1"
              />
              <span className="truncate">{product.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product details */}
      {selectedProduct && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center space-x-4 mb-2">
            <img
              src={selectedProduct.image_url?.[0] || "https://i.pinimg.com/474x/15/20/b2/1520b25e509ef0c742551f7aa06a6356.jpg"}
              alt={selectedProduct.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
            <div>
              <div className="text-xl font-bold text-black">{selectedProduct.name}</div>
              <div className="text-gray-600 mt-1">{selectedProduct.description}</div>
              <div className="text-black font-semibold mt-2 text-base">
                ₹ {selectedProduct.price?.toLocaleString()}
              </div>
              {averageRating !== null && (
                <div className="mt-2 text-sm text-black">
                  Average Rating: <span className="font-bold">{averageRating.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-black">Reviews</h3>
        {loading && <div className="text-gray-500">Loading...</div>}
        {!loading && filteredReviews.length === 0 && (
          <div className="text-gray-400 italic">No reviews found.</div>
        )}
        <ul className="space-y-4">
          {filteredReviews.map((review) => (
            <li
              key={review.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white"
            >
              <div>
                <div className="font-semibold text-black flex items-center gap-2">
                  <span>Rating:</span>
                  <span className="bg-gray-100 text-black px-2 py-0.5 rounded font-bold">{review.rating}</span>
                </div>
                <div className="text-gray-800 mt-1">{review.comment}</div>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(review.created_at).toLocaleString()}
                </div>
              </div>
              <button
                className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-3 py-1 rounded transition-colors"
                onClick={() => handleDeleteReview(review.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}