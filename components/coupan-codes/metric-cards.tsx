import { FileText, Users, DollarSign } from "lucide-react"
import React from "react"

interface MetricCardProps {
  title: string;
  value: string;
  change?: number; 
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center mb-2">
        {icon}
        <span className="text-sm text-gray-800 ml-2">{title}</span>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {change !== undefined && (
          <div className={`flex items-center text-sm ${change > 0 ? "text-green-500" : "text-red-500"}`}>
            <span>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <svg
              className={`h-4 w-4 ml-1 ${change > 0 ? "" : "transform rotate-180"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}

interface MetricCardsProps {
  totalCoupons: number;
  totalUses: number;
  loading?: boolean;
}
export function MetricCards({ totalCoupons, totalUses, loading }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard title="Total Coupons" value={loading ? "..." : totalCoupons.toString()} icon={<FileText className="h-5 w-5 text-gray-500" />} />
      <MetricCard title="Total Uses Remaining" value={loading ? "..." : totalUses.toString()} icon={<Users className="h-5 w-5 text-gray-500" />} />
      {/* Add more cards as needed */}
    </div>
  )
}