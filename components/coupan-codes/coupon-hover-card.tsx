"use client"

import { CSSProperties, useState } from "react"

import { ICoupon } from "@/libs/api"

interface CouponInfoPopupProps {
  coupon: ICoupon
  mode: "hover" | "popup"
  position?: { x: number; y: number }
  onClose?: () => void
  onUpdate?: (updatedCoupon: ICoupon) => void
}

export function CouponInfoPopup({ coupon, mode, position, onClose, onUpdate }: CouponInfoPopupProps) {
  const [couponData, setCouponData] = useState<ICoupon>(coupon)

  const style: CSSProperties = mode === "hover" && position 
    ? {
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y + 24}px`, // Add some offset from the icon
        zIndex: 50,
        width: "300px",
      }
    : {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
        width: "300px",
      }
  
  // const toggleActive = () => {
  //   const updatedCoupon = { ...couponData, active: !couponData.active }
  //   setCouponData(updatedCoupon)
  //   if (onUpdate) {
  //     onUpdate(updatedCoupon)
  //   }
  // }

  const toggleOneTimeUse = () => {
    const updatedCoupon = { ...couponData, oneTimeUse: !couponData.is_one_time }
    setCouponData(updatedCoupon)
    if (onUpdate) {
      onUpdate(updatedCoupon)
    }
  }

  return (
    <>
      {mode === "popup" && (
        <div 
          className="fixed inset-0 bg-black/20 bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <div 
        className={`
          bg-white border rounded-md shadow-lg
          ${mode === "hover" ? "p-3" : "p-4"}
        `}
        style={style}
      >
        {mode === "popup" && (
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="font-medium text-gray-800">Coupon Details</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className={mode === "hover" ? "text-sm" : ""}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-gray-500">COUPON ID</div>
              <div className="font-medium text-gray-800">{couponData.id}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">CODE</div>
              <div className="font-medium text-gray-800">{couponData.code}</div>
            </div>
          
          </div>

          <div className="flex items-center justify-between mb-4">
          

          <div className="mb-4">
            <div className="text-xs text-gray-500">NO. OF USES REMAINING</div>
            <div className="font-medium text-gray-800">{couponData.no_of_uses}</div>
          </div>
       

        
        </div>
        <div className="flex items-center justify-between mb-4">
          

        <div>
              <div className="text-xs text-gray-500">DISCOUNT TYPE</div>
              <div className="font-medium text-gray-800">{couponData.meta_data.discountType}</div>
            </div>
        <div>
              <div className="text-xs text-gray-500">DISCOUNT VALUE</div>
              <div className="font-medium text-gray-800">{couponData.meta_data.discountAmount
              }</div>
            </div>
        
        </div>
        </div>
      </div>
    </>
  )
}