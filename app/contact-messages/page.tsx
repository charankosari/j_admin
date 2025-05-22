"use client"

import { useState, useEffect } from "react"
import { Breadcrumb } from "@/components/breadcrumb"
import { APISDK } from "@/libs/api"
import { Search, Trash2 } from "lucide-react"
import { usePopup } from "@/context/popup-context"

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
  updated_at?: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { showPopup, showConfirm } = usePopup()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("No access token found")
      }
      const api = APISDK.getInstance(token)
      const response = await api.getContactMessages()
      console.log("Response from API:", response)
      
      const mappedMessages: ContactMessage[] = response.rows.map(msg => ({
        id: msg.id,
        name: msg.name || 'Anonymous',
        email: msg.email,
        message: msg.message,
        created_at: new Date(msg.created_at).toISOString(),
        is_read: msg.is_read,
        updated_at: msg.updated_at ? new Date(msg.updated_at).toISOString() : undefined
      }))
      
      setMessages(mappedMessages)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      showPopup("Failed to fetch messages", { type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("No access token found")
      }
      const api = APISDK.getInstance(token)
      await api.updateContactMessageStatus(messageId, true)
      showPopup("Message marked as read", { type: "success" })
      fetchMessages() // Refresh the list
    } catch (error) {
      console.error("Failed to mark message as read:", error)
      showPopup("Failed to mark message as read", { type: "error" })
    }
  }

  const deleteMessage = async (messageId: string) => {
    showConfirm(
      "Are you sure you want to delete this message?",
      async () => {
        try {
          const token = localStorage.getItem("access_token")
          if (!token) {
            throw new Error("No access token found")
          }
          const api = APISDK.getInstance(token)
          await api.deleteContactMessage(messageId)
          showPopup("Message deleted successfully", { type: "success" })
          fetchMessages() // Refresh the list
        } catch (error) {
          console.error("Failed to delete message:", error)
          showPopup("Failed to delete message", { type: "error" })
        }
      }
    )
  }

  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6">
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Contact Messages</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No messages found</div>
      ) : (
        <div className="space-y-4">
          {messages
            .filter(message => 
              message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
              message.message.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((message) => (
              <div
                key={message.id}
                className={`bg-white p-4 rounded-lg border ${
                  !message.is_read ? 'border-orange-500' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{message.name}</h3>
                    <p className="text-sm text-gray-500">{message.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                    {!message.is_read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="text-sm text-orange-500 hover:text-orange-600"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}