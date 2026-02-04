"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { state } = useAuth()

  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push("/login")
    }
  }, [state.isAuthenticated, state.isLoading, router])

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!state.isAuthenticated) {
    return null
  }

  return <>{children}</>
}
