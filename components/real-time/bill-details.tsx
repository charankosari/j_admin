"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { APISDK, IDineInTable } from "@/libs/api";
import { usePopup } from "@/context/popup-context";

interface BillItem {
  name: string;
  quantity: number;
  price: number;
}

interface Bill {
  tableId: string;
  items: BillItem[];
  subtotal: number;
  discount: { percentage: number; amount: number };
  gst: { percentage: number; amount: number };
  grandTotal: number;
  checkout_id: string | null;
  booking_id: string | null;
}

interface BillDetailsProps {
  bill?: Bill;
  onUpdateCapacityAction: (capacity: number) => void;
  table?: IDineInTable; // Add tableId as optional prop for when bill is not provided
}

export function BillDetails({ bill, onUpdateCapacityAction, table }: BillDetailsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTableDetails, setShowTableDetails] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tableDetailsRef = useRef<HTMLDivElement>(null);
  const { showPopup } = usePopup();
  const [isForcedCheckout, setIsForcedCheckout] = useState(false);
console.log('billname',bill, table);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle menu click outside
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }

      // Handle table details modal click outside
      if (
        tableDetailsRef.current &&
        !tableDetailsRef.current.contains(event.target as Node)
      ) {
        setShowTableDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleComplete = async (
    checkout_id: string,
    booking_id: string,
  ) => {
    setIsCompleting(true);
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsCompleting(false);
      return;
    }

    try {
      const api = APISDK.getInstance(token);

      await api.updateCheckout(checkout_id, {
        is_checked_out: true,
        payment_status: "Completed",
        payment_date: new Date(),
      });

      await api.markBookingAsCompleted(booking_id);
      showPopup("Payment completed successfully", { type: "success" });
    } catch (error) {
      console.error("Failed to complete payment:", error);
      showPopup("Failed to complete payment", { type: "error" });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleForcedCheckout = async () => {
    if (!bill?.booking_id) {
      console.error("No booking ID found");
      return;
    }

    setIsForcedCheckout(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }

      const api = APISDK.getInstance(token);
      await api.createUserEndCheckout(bill.booking_id);

      // Show success message
      showPopup("Forced checkout completed successfully", {
        type: "success",
      });
    } catch (error) {
      console.error("Failed to force checkout:", error);
      showPopup("Failed to complete forced checkout", {
        type: "error",
      });
    } finally {
      setIsForcedCheckout(false);
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleDeleteBooking = async () => {
    if (!bill?.booking_id) {
      showPopup("No booking found to delete", { type: "error" });
      return;
    }
  
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }
  
        const api = APISDK.getInstance(token);
        await api.deleteBooking(bill.booking_id);
        
        showPopup("Booking deleted successfully", { type: "success" });
        setShowMenu(false);
      } catch (error) {
        console.error("Failed to delete booking:", error);
        showPopup("Failed to delete booking", { type: "error" });
      }
    }
  };

  const handleTableDetails = () => {
    setShowMenu(false);
    setShowTableDetails(true);
  };

  const handleMarkAsCleaned = async (table_id: string) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    }

    const api = APISDK.getInstance(token);

    try {
      await api.markTableAsCleaned(table_id);
      showPopup("Table marked as cleaned", { type: "success" });
    } catch (error) {
      console.error("Error marking table as cleaned:", error);
      showPopup("Failed to mark table as cleaned", { type: "error" });
    }
  }

  const handleDeleteTable = async () => {
    if (!table?.id) {
      showPopup("Table ID not found", { type: "error" });
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        showPopup("Authentication required", { type: "error" });
        return;
      }

      const api = APISDK.getInstance(token);
      await api.deleteTable(table.id);

      setShowMenu(false);
      showPopup("Table deleted successfully", { type: "success" });

      // Optionally, you might want to trigger a refresh of the parent component
      // or navigate away from this component since the table no longer exists
    } catch (error) {
      showPopup(error instanceof Error ? error.message : "Failed to delete table", { type: "error" });
    }
  };

  const handleCapacityChange = (newCapacity: number) => {
    onUpdateCapacityAction(newCapacity);
    setShowTableDetails(false);

    showPopup(`Table capacity updated to ${newCapacity} seats`, { type: "success" });
  };

  if (!table) {
    return (
      <div className="bg-gray-100 border rounded-lg overflow-hidden relative">
        <div className="p-4">
          <p className="text-gray-500 text-center">No table selected</p>
        </div>
      </div>
    )
  }

  // Determine the table ID to display
  const displayTableId = bill?.tableId ?? table.table_number ?? "N/A";

  if (!bill) {
    return (
      <div className="bg-gray-100 border rounded-lg overflow-hidden relative">
        <div className="p-4">
          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Table - {displayTableId}</h3>
                <p className="text-sm text-gray-500">No active bill</p>
              </div>
            </div>
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={toggleMenu}
                className="p-2 rounded-xl cursor-pointer bg-gray-200 hover:bg-gray-300"
              >
                <MoreVertical size={20} className="text-black " />
              </button>

              {showMenu && (
                <div ref={menuRef} className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1 border rounded-md">
                    <button
                      onClick={handleTableDetails}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Table Details
                    </button>
                    {bill && (
                      <button
                        onClick={handleDeleteBooking}
                        className="flex items-center w-full px-4 py-2 text-sm text-orange-600 cursor-pointer hover:bg-gray-100"
                      >
                        <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Delete Booking
                      </button>
                    )}
                    <button
                      onClick={handleDeleteTable}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete Table
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center h-48 bg-white/60 rounded-xl">
            <p className="text-gray-500 text-center">No bill selected</p>
          </div>
        </div>

        {/* Table Details Modal */}
        {showTableDetails && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div ref={tableDetailsRef} className="bg-white rounded-lg w-full max-w-md mx-4">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-black font-medium">Table Details</h3>
                  <button onClick={() => setShowTableDetails(false)} className="text-gray-500 cursor-pointer">
                    <svg className="w-5 h-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Table Name</label>
                    <div className="mt-1 text-gray-400 flex items-center justify-between">
                      <span>{displayTableId}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Table Capacity</label>
                    <div className="mt-2">
                      <select
                        value={table.capacity}
                        onChange={(e) => handleCapacityChange(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1 Seat</option>
                        <option value={2}>2 Seats</option>
                        <option value={3}>3 Seats</option>
                        <option value={4}>4 Seats</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h4 className="block text-sm font-medium text-gray-700 mb-2">Table QR</h4>
                    <p className="text-xs text-gray-500 mb-2">QR where users can order items from their table</p>
                    <div className="flex justify-center mb-2">
                      <img src={table.meta_data.qr_code} alt="QR Code" className="border" />
                    </div>
                    <button className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <p className="cursor-pointer">Download QR</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 border rounded-lg overflow-hidden relative">
      <div className="p-4">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Table - {bill.tableId}</h3>
              <p className="text-sm text-gray-500">{bill.items.length} items @ Rs {bill.subtotal}</p>
            </div>
          </div>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="p-2 rounded-xl cursor-pointer bg-gray-200 hover:bg-gray-300"
            >
              <MoreVertical size={20} className="text-black " />
            </button>

            {showMenu && (
              <div ref={menuRef} className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1 border rounded-md">
                  <button
                    onClick={handleTableDetails}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Table Details
                  </button>
                  <button
                    onClick={handleDeleteTable}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 cursor-pointer hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Table
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-4 bg-white/60 rounded-xl p-4">
          {bill.items.map((item, index) => (
            <div key={index} className="flex justify-between ">
              <div className="flex items-center">
                <span className="text-gray-500">{item.name}</span>
                <span className="text-gray-500 text-sm ml-2">×{item.quantity}</span>
              </div>
              <span className="text-gray-700">₹ {item.price}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-2 p-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total</span>
            <span className="font-medium text-gray-700">{bill.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">
              Discount <span className="text-sm">{bill.discount.percentage}%</span>
            </span>
            <span className="text-gray-700">₹ {bill.discount.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">
              GST <span className="text-sm">{bill.gst.percentage}%</span>
            </span>
            <span className="text-gray-700">₹ {bill.gst.amount}</span>
          </div>
        </div>

        <div className="mt-4 bg-orange-500 text-white p-3 cursor-pointer rounded-md flex justify-between">
          <span className="font-medium">Grand Total</span>
          <span className="font-medium">₹ {bill.grandTotal}</span>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={handleForcedCheckout}
            disabled={isForcedCheckout || !bill?.booking_id}
            className={`py-3 w-full flex items-center justify-center rounded-md transition-colors duration-200 ${isForcedCheckout || !bill?.booking_id
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
              }`}
          >
            {isForcedCheckout ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Checkout...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Force Checkout
              </>
            )}
          </button>
          <button
            onClick={async () => {
              await handleComplete(bill.checkout_id!, bill.booking_id!);
            }}
            disabled={isCompleting}
            className={`py-3 w-full bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center justify-center transition-colors duration-200 ${isCompleting ? 'cursor-not-allowed opacity-70 bg-green-400' : 'cursor-pointer'
              }`}
          >
            {isCompleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark as completed
              </>
            )}
          </button>
          <button
            onClick={async () => {
              await handleMarkAsCleaned(table.id);
            }}
            className="py-3 w-full bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mark as Cleaned
          </button>
        </div>
      </div>

      {/* Table Details Modal */}
      {showTableDetails && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div ref={tableDetailsRef} className="bg-white rounded-lg w-full max-w-md mx-4">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg text-black font-medium">Table Details</h3>
                <button onClick={() => setShowTableDetails(false)} className="text-gray-500 cursor-pointer">
                  <svg className="w-5 h-5 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Table Name</label>
                  <div className="mt-1 text-gray-400 flex items-center justify-between">
                    <span>{bill.tableId}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Table Capacity</label>
                  <div className="mt-2">
                    <select
                      value={table.capacity}
                      onChange={(e) => handleCapacityChange(Number(e.target.value))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>1 Seat</option>
                      <option value={2}>2 Seats</option>
                      <option value={3}>3 Seats</option>
                      <option value={4}>4 Seats</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="block text-sm font-medium text-gray-700 mb-2">Table QR</h4>
                  <p className="text-xs text-gray-500 mb-2">QR where users can order items from their table</p>
                  <div className="flex justify-center mb-2">
                    <img src={table.meta_data.qr_code} alt="QR Code" className="border" />
                  </div>
                  <button className="w-full flex items-center justify-center py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <p className="cursor-pointer">Download QR</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
