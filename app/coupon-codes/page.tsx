"use client"

import { Breadcrumb } from "@/components/breadcrumb"
import { MetricCards } from "@/components/coupan-codes/metric-cards"
import { CouponTabs } from "@/components/coupan-codes/coupon-tabs"
import { CouponTable } from "@/components/coupan-codes/coupon-table"
import { PlusCircle } from "lucide-react"
import { NewCouponModal } from "@/components/coupan-codes/new-coupon-modal"
import { useEffect, useState, useMemo } from "react"
import { APISDK, ICoupon } from "@/libs/api"

export default function CouponCodesPage() {
  const [showNewCouponModal, setShowNewCouponModal] = useState(false)
  const [coupons, setCoupons] = useState<ICoupon[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all")

  // Fetch all coupons on mount
  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const api = APISDK.getInstance()
      const data = await api.getCoupons()
      setCoupons(data)
    } finally {
      setLoading(false)
    }
  }




  // Filtering logic for tabs and search
  const filteredCoupons = useMemo(() => {
    let filtered = coupons
    if (activeTab === "active") {
      filtered = filtered.filter(c => c.no_of_uses > 0 && (!c.expires_on || new Date(c.expires_on) > new Date()))
    } else if (activeTab === "inactive") {
      filtered = filtered.filter(c => c.no_of_uses === 0 || (c.expires_on && new Date(c.expires_on) <= new Date()))
    }
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.meta_data?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }, [coupons, activeTab, searchTerm])

  // Stats for MetricCards
  const totalCoupons = coupons.length
  const totalUses = coupons.reduce((acc, c) => acc + (c.no_of_uses || 0), 0)
  // You can add more stats as needed

  return (
    <>
      <Breadcrumb items={["Marketing", "Coupon Codes"]} />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium text-gray-800">Coupon Codes</h1>
          <button
            onClick={() => setShowNewCouponModal(true)}
            className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors text-gray-800"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Coupon Code
          </button>
        </div>

        <MetricCards totalCoupons={totalCoupons} totalUses={totalUses} loading={loading} />

        <div className="mt-8">
          <div className="mb-2">
            <h2 className="text-lg font-medium text-gray-800">All Coupons</h2>
            <p className="text-sm text-gray-600">Manage all your coupon codes here</p>
          </div>
          <CouponTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            totalCoupons={totalCoupons}
            activeCoupons={coupons.filter(c => c.no_of_uses > 0 && (!c.expires_on || new Date(c.expires_on) > new Date())).length}
            inactiveCoupons={coupons.filter(c => c.no_of_uses === 0 || (c.expires_on && new Date(c.expires_on) <= new Date())).length}
          />
          <CouponTable
            coupons={filteredCoupons}
            reload={fetchCoupons}
          />
        </div>
      </main>
      {showNewCouponModal && (
        <NewCouponModal
          onClose={() => {{fetchCoupons(),setShowNewCouponModal(false)}}}
        />
      )}
    </>
  )
}
