"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Loader2 } from "lucide-react"
import { APISDK } from "@/libs/api"
import { IAssistance } from "@/libs/api"

export function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [assistances, setAssistances] = useState<IAssistance[]>([])
  const [clearingIds, setClearingIds] = useState<string[]>([])
  const notificationRef = useRef<HTMLDivElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element for notification
    audioRef.current = new Audio("/sound.mp3")
    
    // Request permission and play a silent audio to enable sound
    const enableAudio = async () => {
      try {
        await audioRef.current?.play()
        // Immediately pause it
        audioRef.current?.pause()
        audioRef.current!.currentTime = 0
      } catch (err) {
        console.error("Failed to enable audio:", err)
      }
    }

    // Enable audio on first user interaction
    const handleInteraction = () => {
      enableAudio()
      // Remove the event listeners after first interaction
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }

    document.addEventListener('click', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)

    // Cleanup
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [])

  // Fetch assistance data with polling
  useEffect(() => {
    async function fetchAssistances() {
      try {
        const response = await APISDK.getInstance().getAllAssistance()
        // Check for new assistances and play sound
        if (assistances.length < response.data.length) {
          audioRef.current?.play()
        }
        setAssistances(response.data)
      } catch (error) {
        console.error("Failed to fetch assistance data:", error)
      }
    }

    fetchAssistances() // Initial fetch
    const interval = setInterval(fetchAssistances, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [assistances.length])

  // Handle clearing assistance
  const handleClearAssistance = async (id: string) => {
    try {
      setClearingIds((prev) => [...prev, id])
      await APISDK.getInstance().deleteAssistance(id)
      setAssistances((prev) => prev.filter((assistance) => assistance.id !== id))
    } catch (error) {
      console.error("Failed to delete assistance:", error)
    } finally {
      setClearingIds((prev) => prev.filter((clearId) => clearId !== id))
    }
  }

  return (
    <header className="h-16 border-b flex items-center justify-end px-6">
      <div className="flex justify-end items-center">
        <div className="relative" ref={notificationRef}>
          <button
            className="p-2 rounded-full hover:bg-indigo-50 relative transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} className="text-indigo-600" />
            {assistances.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-indigo-100 rounded-lg shadow-lg z-50">
              <div className="p-3 space-y-2">
                {assistances.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No assistance requests
                  </div>
                ) : (
                  assistances.map((assistance) => (
                    <div 
                      key={assistance.id} 
                      className="border border-indigo-100 rounded-lg p-3 bg-white hover:bg-indigo-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-indigo-900">
                          Table No: {assistance.table_number}
                        </span>
                        <button
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors
                            ${clearingIds.includes(assistance.id)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                          onClick={() => handleClearAssistance(assistance.id)}
                          disabled={clearingIds.includes(assistance.id)}
                        >
                          {clearingIds.includes(assistance.id) ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            'Clear'
                          )}
                        </button>
                      </div>
                      <div className="text-indigo-600 text-sm mt-1">Requested Assistance</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
