"use client"

import { useState } from "react"
import { Search } from "lucide-react"

interface CouponTabsProps {
  activeTab: "all" | "active" | "inactive";
  setActiveTab: React.Dispatch<React.SetStateAction<"all" | "active" | "inactive">>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  totalCoupons: number;
  activeCoupons: number;
  inactiveCoupons: number;
}
export function CouponTabs({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  totalCoupons,
  activeCoupons,
  inactiveCoupons,
}: CouponTabsProps) {
  const tabs = [
    { id: "all", label: "All Coupons", count: totalCoupons },
    { id: "active", label: "Active Coupons", count: activeCoupons },
    { id: "inactive", label: "Inactive Coupons", count: inactiveCoupons },
  ]

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div className="border-b mb-4 md:mb-0">
        <div className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pb-2 px-1 font-medium text-sm ${
                activeTab === tab.id
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-800 hover:text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.id as "all" | "active" | "inactive")}
            >
              {tab.label}
              {tab.count !== null && (
                <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">{tab.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search for Code, Title, Validity"
          className="pl-10 pr-4 py-2 text-gray-800 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
    </div>
  )
}
