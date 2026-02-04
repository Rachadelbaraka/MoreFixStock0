"use client"

import type { ReactNode } from "react"
import { StoreProvider } from "@/lib/store-context"
import { Sidebar } from "./sidebar"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="min-h-screen p-4 pt-20 lg:p-8 lg:pt-8">
            {children}
          </div>
        </main>
      </div>
    </StoreProvider>
  )
}
