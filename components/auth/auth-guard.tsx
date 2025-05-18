"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { usePopup } from "@/context/popup-context"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, refreshAuth } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { showPopup } = usePopup()
  const [redirectInProgress, setRedirectInProgress] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  
  useEffect(() => {
    if (refreshAuth && !initialLoadComplete) {
      refreshAuth()
      setInitialLoadComplete(true)
    }
  }, [refreshAuth, initialLoadComplete])
  
  useEffect(() => {
    if (pathname === "/login") {
      return
    }

    if (redirectInProgress) {
      return
    }

    if (!isLoading) {
      const isFirstLoad = sessionStorage.getItem('sessionChecked') !== 'true'
      
      if (!isAuthenticated) {
        if (isFirstLoad) {
          showPopup("Your session has expired. Please login again.", { 
            type: "warning",
            title: "Authentication Required" 
          })
          sessionStorage.setItem('sessionChecked', 'true')
        }
        
        setRedirectInProgress(true)
        router.push("/login")
      } else {
        sessionStorage.setItem('sessionChecked', 'true')
      }
    }
  }, [isAuthenticated, isLoading, router, pathname, showPopup, redirectInProgress])

  // Show loading state while checking authentication, but only on protected routes
  if ((isLoading || !initialLoadComplete) && pathname !== "/login") {
    console.log('Showing loading state for protected route')
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 border-4 border-gray-200 border-t-4 border-t-orange-500 rounded-full animate-spin mx-auto mb-4">
          </div>
          <h2 className="text-xl font-medium text-gray-700 mb-1">Loading</h2>
          <p className="text-sm text-gray-500">Verifying your session...</p>
        </div>
      </div>
    )
  }

  // On login page, always render children
  if (pathname === "/login") {
    return <>{children}</>
  }

  // For other routes, only render children if authenticated
  return isAuthenticated ? <>{children}</> : null
}