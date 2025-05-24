"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { APISDK } from "@/libs/api/index";
import { EcomAdminStatsResponse } from "@/libs/api/types";

const COLORS = ["#6366f1", "#10b981", "#facc15", "#f87171", "#fb923c"];

export default function Page() {
  const [stats, setStats] = useState<EcomAdminStatsResponse["data"] | null>(
    null
  );
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  useEffect(() => {
    async function fetchStats() {
      const api = APISDK.getInstance();
      const res = await api.getEcomStats();
      setStats(res.data);
    }
    fetchStats();
  }, []);

  if (!stats) return <div className="p-6 text-lg">Loading stats…</div>;

  // Prepare Revenue Data
  const revenueData = Object.entries(
    selectedTimeRange === "7d"
      ? stats.revenueHistory.sevenDays
      : selectedTimeRange === "30d"
      ? stats.revenueHistory.thirtyDays
      : stats.revenueHistory.ninetyDays
  ).map(([date, value]: any) => ({ date, revenue: value }));

  // Prepare Category Sales Data
  const categorySales = stats.salesOfCategories.map((item: any) => ({
    name: item.category.name,
    value: item.count,
  }));

  // Prepare Product Sales Data
  const productSales = stats.salesOfProducts.map((item: any) => ({
    name: item.product.name,
    count: item.count,
  }));

  // Prepare SubCategory Sales Data (if needed)
  const subCategorySales = stats.salesOfSubCategories.map((item: any) => ({
    name: item.subcategory.name,
    value: item.count,
  }));

  return (
    <div className="p-6 space-y-10">
      {/* Revenue Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Revenue (₹) — {selectedTimeRange}
        </h2>
        <div className="flex space-x-2 mb-4">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 rounded ${
                selectedTimeRange === range
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Sales Donut */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Sales by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categorySales}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={60}
              label
            >
              {categorySales.map((_: any, index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Product Sales Bar Chart */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Product Sales Count</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productSales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SubCategory Sales Donut */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Sales by SubCategory</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={subCategorySales}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={60}
              label
            >
              {subCategorySales.map((_: any, index: any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
