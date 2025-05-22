"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { ICoupon, APISDK } from "@/libs/api"

interface EditCouponModalProps {
  coupon: ICoupon
  onClose: () => void
  onUpdated: () => Promise<void>
}

type DiscountType = "percentage" | "flat"

export function EditCouponModal({ coupon, onClose, onUpdated }: EditCouponModalProps) {
  const [couponCode, setCouponCode] = useState<string>("")
  const [oneTimeUse, setOneTimeUse] = useState<boolean>(true)
  const [totalUses, setTotalUses] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [discountType, setDiscountType] = useState<DiscountType>("percentage")
  const [discountAmount, setDiscountAmount] = useState<string>("")
  const [minimumCartValue, setMinimumCartValue] = useState<string>("")
  const [terms, setTerms] = useState<string[]>([])

  useEffect(() => {
    setCouponCode(coupon.code)
    setOneTimeUse(coupon.is_one_time)
    setTotalUses(coupon.no_of_uses === Number.MAX_SAFE_INTEGER ? "unlimited" : coupon.no_of_uses.toString())
    setExpiryDate(coupon.expires_on ? new Date(coupon.expires_on).toISOString().split("T")[0] : "")
    setDiscountType(coupon.meta_data.discountType as DiscountType)
    setDiscountAmount(coupon.meta_data.discountAmount || "")
    setMinimumCartValue(coupon.meta_data.minimumCartValue || "")
    try {
      setTerms(JSON.parse(coupon.meta_data.terms || "[]"))
    } catch {
      setTerms([])
    }
  }, [coupon])

  const handleTermChange = (index: number, value: string) => {
    setTerms(prev => prev.map((term, i) => (i === index ? value : term)))
  }

  const handleAddTerm = () => {
    setTerms(prev => [...prev, ""])
  }

  const handleRemoveTerm = (index: number) => {
    setTerms(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const couponData = {
      code: couponCode,
      is_one_time: oneTimeUse,
      expires_on: new Date(expiryDate),
      no_of_uses: totalUses === "unlimited" ? Number.MAX_SAFE_INTEGER : Number(totalUses),
      meta_data: {
        discountType,
        discountAmount,
        minimumCartValue,
        terms: JSON.stringify(terms)
      }
    }
    await APISDK.getInstance().updateCoupon(coupon.id, couponData)
    await onUpdated()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Edit Coupon</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">Coupon ID will be generated automatically</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-800">One Time Use Per User</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <div
                    className={`w-10 h-5 rounded-full ${oneTimeUse ? "bg-orange-500" : "bg-gray-200"}`}
                    onClick={() => setOneTimeUse(!oneTimeUse)}
                  >
                    <div
                      className={`absolute w-3.5 h-3.5 bg-white rounded-full top-[3px] transition-transform ${
                        oneTimeUse ? "translate-x-[22px]" : "translate-x-[3px]"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Total No. Of Uses</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={totalUses}
                      onChange={(e) => setTotalUses(e.target.value)}
                      placeholder="total number uses"
                      className="w-full border rounded-md px-3 py-2 text-gray-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiry</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-gray-800"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Discount Details</label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discountType"
                      checked={discountType === "percentage"}
                      onChange={() => setDiscountType("percentage")}
                      className="mr-2 text-orange-500"
                    />
                    <span className="text-gray-800">Percentage%</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="discountType"
                      checked={discountType === "flat"}
                      onChange={() => setDiscountType("flat")}
                      className="mr-2 text-orange-500"
                    />
                    <span className="text-gray-800">Flat Discount(₹)</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Flat Discount Amount(₹)</label>
                <input
                  type="text"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Minimum Cart Value</label>
                <input
                  type="text"
                  value={minimumCartValue}
                  onChange={(e) => setMinimumCartValue(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Terms & Conditions</label>
                <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                  <ol className="list-decimal pl-5 text-sm text-gray-800 space-y-2">
                    {terms.map((term, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={term}
                          onChange={e => handleTermChange(idx, e.target.value)}
                          className="flex-1 border rounded-md px-2 py-1 text-gray-800"
                        />
                        {terms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTerm(idx)}
                            className="text-red-500 hover:text-red-700 px-2"
                            aria-label="Remove term"
                          >
                            &times;
                          </button>
                        )}
                      </li>
                    ))}
                  </ol>
                  <button
                    type="button"
                    onClick={handleAddTerm}
                    className="mt-2 text-orange-500 hover:underline text-xs"
                  >
                    + Add Term
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full mt-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}