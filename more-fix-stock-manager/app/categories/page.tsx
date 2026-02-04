import { AppShell } from "@/components/app-shell"
import { CategoriesList } from "@/components/categories-list"
import { ProtectedRoute } from "@/components/protected-route"

export default function CategoriesPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <CategoriesList />
      </AppShell>
    </ProtectedRoute>
  )
}
