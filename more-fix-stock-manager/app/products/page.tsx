import { AppShell } from "@/components/app-shell"
import { ProductsList } from "@/components/products-list"
import { ProtectedRoute } from "@/components/protected-route"

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <ProductsList />
      </AppShell>
    </ProtectedRoute>
  )
}
