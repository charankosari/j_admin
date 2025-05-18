import { Users, ShoppingBag, IndianRupee } from "lucide-react"
import { useEffect, useState } from "react"
import { APISDK } from "@/libs/api"

export function MetricCards() {
  const [userCount, setUserCount] = useState<number>(0);
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    totalItems: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const api = APISDK.getInstance(token);
        const [usersResponse, statsResponse] = await Promise.all([
          api.getAdminUsers(),
          api.getAllStats()
        ]);

        // Set user count
        setUserCount(usersResponse.data.total);

        // Calculate total items sold
        const totalItems = statsResponse.data.salesOfAllProducts.reduce((acc, category) => {
          return acc + category.dishes.reduce((sum, dish) => sum + dish.count, 0);
        }, 0);

        // Get today's date in the format DD-M-YYYY
        const today = new Date();
        const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

        // Get today's revenue from dailyProfits
        const todayRevenue = statsResponse.data.dailyProfits[formattedDate] || 0;

        setMetrics({
          todayRevenue: todayRevenue,
          totalItems: totalItems,
          totalRevenue: statsResponse.data.totalProfit
        });

      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `${(amount / 10000000).toFixed(2)}Cr INR`;
    } else if (amount >= 100000) {
      return `${(amount / 100000).toFixed(2)}L INR`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K INR`;
    }
    return `${amount} INR`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Today Revenue"
        value={formatCurrency(metrics.todayRevenue)}
        change={12}
        icon={<IndianRupee className="h-5 w-5 text-gray-400" />}
      />
      <MetricCard 
        title="Total Customers" 
        value={userCount} 
        change={19} 
        icon={<Users className="h-5 w-5 text-gray-400" />} 
      />
      <MetricCard
        title="Total Items Ordered"
        value={metrics.totalItems.toString()}
        change={14}
        icon={<ShoppingBag className="h-5 w-5 text-gray-400" />}
      />
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(metrics.totalRevenue)}
        change={12}
        icon={<IndianRupee className="h-5 w-5 text-gray-400" />}
      />
    </div>
  )
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-white  border rounded-lg p-4">
      <div className="flex items-center text-gray-400  mb-2">
        {icon}
        <span className="text-sm text-gray-400  ml-2">{title}</span>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl text-black  font-bold">{value}</h3>
        {title === "Today Revenue" && (
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
