import { Users, ShoppingBag, IndianRupee, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { APISDK } from "@/libs/api"

export function MetricCards() {
  const [userCount, setUserCount] = useState<number>(0);
  const [metrics, setMetrics] = useState({
    todayRevenue: 0,
    totalItems: 0,
    totalRevenue: 0,
    profitPercentage: 0
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
          totalRevenue: statsResponse.data.totalProfit,
          profitPercentage: parseFloat(statsResponse.data.profitPercentage)
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
        change={metrics.profitPercentage}
        icon={<IndianRupee className="h-5 w-5 text-gray-400" />}
      />
      <MetricCard 
        title="Total Customers" 
        value={userCount} 
        icon={<Users className="h-5 w-5 text-gray-400" />} 
      />
      <MetricCard
        title="Total Items Ordered"
        value={metrics.totalItems.toString()}
        icon={<ShoppingBag className="h-5 w-5 text-gray-400" />}
      />
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(metrics.totalRevenue)}
        icon={<IndianRupee className="h-5 w-5 text-gray-400" />}
      />
    </div>
  )
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center text-gray-400 mb-2">
        {icon}
        <span className="text-sm text-gray-400 ml-2">{title}</span>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="text-2xl text-black font-bold">{value}</h3>
        {title === "Today Revenue" && change !== undefined && (
          <div className={`flex items-center text-sm ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
