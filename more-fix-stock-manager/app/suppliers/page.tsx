import { AppShell } from "@/components/app-shell"
import { SuppliersList } from "@/components/suppliers-list"
import { ProtectedRoute } from "@/components/protected-route"

export default function SuppliersPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <SuppliersList />
      </AppShell>
    </ProtectedRoute>
  )
}
