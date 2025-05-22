"use client"

import { useState } from "react"
import { Info, Edit, Trash2 } from "lucide-react"
import { CouponInfoPopup } from "./coupon-hover-card"
import { ICoupon, APISDK } from "@/libs/api"
import { EditCouponModal } from "./edit-coupon-modal"

export function CouponTable({ coupons, reload }: { coupons: ICoupon[]; reload: () => Promise<void> }) {
  const [hoveredCoupon, setHoveredCoupon] = useState<ICoupon | null>(null)
  const [selectedCoupon, setSelectedCoupon] = useState<ICoupon | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [editingCoupon, setEditingCoupon] = useState<ICoupon | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const couponsPerPage = 10;
  const totalPages = Math.ceil(coupons.length / couponsPerPage);

  const handlePrevPage = async () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
    }
  };


  const handleInfoMouseEnter = (e: React.MouseEvent, coupon: ICoupon) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHoverPosition({
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
    })
    setHoveredCoupon(coupon)
  }

  const handleInfoMouseLeave = () => {
    setHoveredCoupon(null)
  }

  const handleInfoClick = (coupon: ICoupon) => {
    setSelectedCoupon(coupon)
    setHoveredCoupon(null)
  }

  const onDeleteCoupon = async (couponId: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) {
      return;
    }
    try {
      await APISDK.getInstance().deleteCoupon(couponId)
      await reload()
    } catch (err) {
      // Optionally handle error (e.g., show a toast)
      console.error("Failed to delete coupon", err)
    }
  }

  return (
    <div className="bg-white border rounded-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
              Coupon ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
              Coupon Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
              Expiry Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {coupons
            .slice((currentPage - 1) * couponsPerPage, currentPage * couponsPerPage)
            .map((coupon, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <div className="flex items-center">
                  {coupon.id}
                  <button
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    onMouseEnter={(e) => handleInfoMouseEnter(e, coupon)}
                    onMouseLeave={handleInfoMouseLeave}
                    onClick={() => handleInfoClick(coupon)}
                  >
                    <Info size={16} />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{coupon.code}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {coupon.expires_on ? new Date(coupon.expires_on).toLocaleDateString() : ""}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {coupon.updated_at ? new Date(coupon.updated_at).toLocaleDateString() : ""}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                {coupon.created_at ? new Date(coupon.created_at).toLocaleDateString() : ""}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                <div className="flex space-x-2">
                  <button
                    className="text-gray-600 hover:text-gray-800 flex items-center"
                    onClick={() => setEditingCoupon(coupon)}
                  >
                    <Edit size={16} className="mr-1" />
                    Update
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDeleteCoupon(coupon.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-6 py-3 flex items-center justify-end border-t">
        <div className="text-sm text-gray-700">Page {currentPage} of {totalPages}</div>
        <div className="ml-4 flex">
          <button
            className="px-2 py-1 border rounded-l-md bg-gray-100 text-gray-600"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="px-2 py-1 border-t border-b border-r rounded-r-md bg-gray-100 text-gray-600"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {hoveredCoupon && !selectedCoupon && (
        <CouponInfoPopup 
          coupon={hoveredCoupon} 
          position={hoverPosition} 
          mode="hover" 
        />
      )}
      {selectedCoupon && (
        <CouponInfoPopup 
          coupon={selectedCoupon} 
          onClose={() => setSelectedCoupon(null)}
          mode="popup"
        />
      )}
      {editingCoupon && (
        <EditCouponModal
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onUpdated={reload}
        />
      )}
    </div>
  )
}
