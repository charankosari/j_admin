"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { useEffect, useState } from "react";
import { APISDK, IDineInTableBooking } from "@/libs/api";

export default function TableReservationsPage() {
  const [bookings, setBookings] = useState<IDineInTableBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("today");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const fetchData = async () => {
      try {
        const api = APISDK.getInstance(token);
        const bookingsRes = await api.getBookings();

        // Normalize data
        const normalized = bookingsRes.data.map((b: any) => ({
          ...b,
          table_id: b.table_id === "undefined" ? undefined : b.table_id,
          booking_date: new Date(b.booking_date),
          from_time: new Date(b.from_time),
        }));

        setBookings(normalized);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500" />
      </div>
    );
  }

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isPast = (date: Date) => date < new Date() && !isToday(date);
  const isFuture = (date: Date) => date > new Date() && !isToday(date);

  const unassignedBookings = bookings.filter(
    (booking) => !booking.table_id || booking.table_id === ""
  );

  const pastBookings = unassignedBookings.filter((b) => isPast(b.booking_date));
  const todayBookings = unassignedBookings.filter((b) =>
    isToday(b.booking_date)
  );
  const futureBookings = unassignedBookings.filter((b) =>
    isFuture(b.booking_date)
  );

  const tabs = [
    { key: "today", label: "Today" },
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
  ];

  const filteredBookings = () => {
    let data: IDineInTableBooking[] = [];
    if (selectedTab === "today") data = todayBookings;
    else if (selectedTab === "upcoming") data = futureBookings;
    else if (selectedTab === "past") data = pastBookings;

    if (searchQuery.trim() !== "") {
      data = data.filter(
        (b) =>
          b.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.phone?.includes(searchQuery)
      );
    }

    return data;
  };

  const BookingCard = ({ booking }: { booking: IDineInTableBooking }) => (
    <div className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition duration-200 space-y-1">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-gray-900 font-semibold">
          Booking ID: {booking.id}
        </h4>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            booking.is_confirmed
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {booking.is_confirmed ? "Confirmed" : "Pending"}
        </span>
      </div>
      <p className="text-gray-800">
        <strong>Name:</strong> {booking.name || "N/A"}
      </p>
      <p className="text-gray-800">
        <strong>Phone:</strong> {booking.phone || "N/A"}
      </p>
      <div className="flex gap-4 text-gray-800">
        <p>
          <strong>Date:</strong>{" "}
          {booking.booking_date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      </div>
      <p className="text-gray-800">
        <strong>Time:</strong> {booking.from_time.toLocaleTimeString()}
      </p>
      <p className="text-gray-800">
        <strong>People:</strong> {booking.number_of_people}
      </p>
    </div>
  );

  return (
    <>
      <Breadcrumb items={["Cafe", "Table Reservations"]} />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl text-gray-900 font-bold mb-6">
          Table Reservations
        </h2>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-full border font-medium ${
                selectedTab === tab.key
                  ? "bg-gray-900 text-white"
                  : "border-gray-300 text-gray-700"
              }`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border text-gray-900 border-gray-300 placeholder-gray-600 rounded-md shadow-sm focus:ring-gray-800 focus:border-gray-800 outline-none"
          />
        </div>

        {/* Bookings */}
        {filteredBookings().length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredBookings().map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 text-lg mt-16">
            No {selectedTab} bookings found.
          </div>
        )}
      </main>
    </>
  );
}
