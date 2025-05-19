"use client"

import { Breadcrumb } from "@/components/breadcrumb"
import TableGridSystem from "@/components/real-time/table-grid"
import { OrderPanel } from "@/components/real-time/order-panel"
import { DashboardHeader } from "@/components/dashboard-header"
import { APISDK, IDineInOrder, IDineInTable, IDineInTableBooking, IDish } from "@/libs/api"
import { useEffect, useState } from "react"

export default function RealTimePage() {
  const [tables, setTables] = useState<IDineInTable[]>([])
  const [orders, setOrders] = useState<IDineInOrder[]>([])
  const [bookings, setBookings] = useState<IDineInTableBooking[]>([])
  const [dishes, setDishes] = useState<IDish[]>([])
  const [tableStates, setTableStates] = useState<IDineInTableStats[]>([])

  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async (token: string) => {
    try {
      const api = APISDK.getInstance(token);
      const [
        tables,
        orders,
        bookings,
        dishes,
        tableStats
      ] = await Promise.all([
        api.getTables(),
        api.getOrders(),
        api.getBookings(),
        api.getDishes(),
        api.getTableStats()
      ]);


      setTables(tables.data);
      setOrders(orders.data);
      setBookings(bookings.data);
      setDishes(dishes);

      const updatedTableStats = tableStats.data.map((tableStat: IDineInTableStats) => {
        const matchingBooking = bookings.data.find((booking: IDineInTableBooking) => 
            booking.id === tableStat.booking_id
        );

        if (matchingBooking && matchingBooking.is_ready_to_bill) {
            console.log("Changed TableStat:", { ...tableStat, status: "Ready to Bill" });
            return {
                ...tableStat,
                status: "Ready to Bill"
            };
        }

        // Check if the table needs to be marked as "To be Cleaned"
        const table = tables.data.find((t: IDineInTable) => t.id === tableStat.table_number);
        if (table && table.meta_data.status === 'Untouched' && table.meta_data.to_be_cleaned === true) {
          console.log("Changed TableStat:", { ...tableStat, status: "To be Cleaned" });
          return {
              ...tableStat,
              status: "To be Cleaned"
          };
      }
  

        console.log("Unchanged TableStat:", tableStat);
        return tableStat;
    });

    setTableStates(updatedTableStats);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchData(token);
    }
  }, []);

  // refetch the data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("access_token");
      if (token) {
        fetchData(token);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      console.log("Updated Table States:", tableStates);
    }
  }, [tableStates, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-between ">
      <Breadcrumb items={["Cafe", "Real-Time view"]} /><DashboardHeader />
      </div>
      <main className="flex-1 p-6">
        <h2 className="text-lg text-gray-800 font-medium mb-4">Table Management</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 xl:w-7/12">
            <div className="bg-white border rounded-lg p-4">
              <TableGridSystem tables={tables} setTables={setTables} tableStates={tableStates} />
            </div>
          </div>

          {/* Right side - Orders and Bill */}
          <div className="lg:w-1/2 xl:w-5/12 flex flex-col gap-6">
            <OrderPanel orders={orders} tables={tables} dishes={dishes} bookings={bookings} />
          </div>
        </div>
      </main>
    </>
  )
}

