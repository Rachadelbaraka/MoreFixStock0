import { AppShell } from "@/components/app-shell"
import { Dashboard } from "@/components/dashboard"
import { ProtectedRoute } from "@/components/protected-route"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Dashboard />
      </AppShell>
    </ProtectedRoute>
  )
}
