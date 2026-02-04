"use client"

import { useStore } from "@/lib/store-context"
import { StatCard } from "./stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  FolderOpen,
  Truck,
  AlertTriangle,
  TrendingUp,
  DollarSign,
} from "lucide-react"

export function Dashboard() {
  const { state, getCategoryById, getLowStockProducts, getOutOfStockProducts } = useStore()

  const totalProducts = state.products.length
  const totalCategories = state.categories.length
  const totalSuppliers = state.suppliers.length
  const lowStockProducts = getLowStockProducts()
  const outOfStockProducts = getOutOfStockProducts()
  const totalStockValue = state.products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  )
  const totalItems = state.products.reduce((acc, p) => acc + p.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Vue globale de votre inventaire MoreFix
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Produits"
          value={totalProducts}
          description={`${totalItems} articles en stock`}
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Catégories"
          value={totalCategories}
          description="Catégories actives"
          icon={FolderOpen}
          variant="default"
        />
        <StatCard
          title="Fournisseurs"
          value={totalSuppliers}
          description="Partenaires actifs"
          icon={Truck}
          variant="default"
        />
        <StatCard
          title="Valeur du Stock"
          value={`${totalStockValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`}
          description="Valeur totale estimée"
          icon={DollarSign}
          variant="success"
        />
      </div>

      {/* Alerts Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Stock Faible"
          value={lowStockProducts.length}
          description="Produits avec moins de 5 unités"
          icon={TrendingUp}
          variant="warning"
        />
        <StatCard
          title="Rupture de Stock"
          value={outOfStockProducts.length}
          description="Produits à réapprovisionner"
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Low Stock & Out of Stock Lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Out of Stock Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Produits en Rupture
            </CardTitle>
          </CardHeader>
          <CardContent>
            {outOfStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun produit en rupture de stock
              </p>
            ) : (
              <div className="space-y-3">
                {outOfStockProducts.map((product) => {
                  const category = getCategoryById(product.categoryId)
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {category?.name} - SKU: {product.sku}
                        </p>
                      </div>
                      <Badge variant="destructive">Rupture</Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-warning" />
              Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun produit en stock faible
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => {
                  const category = getCategoryById(product.categoryId)
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border border-warning/20 bg-warning/5 p-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {category?.name} - SKU: {product.sku}
                        </p>
                      </div>
                      <Badge className="bg-warning text-warning-foreground">
                        {product.quantity} unités
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aperçu des Produits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Produit</th>
                  <th className="pb-3 font-medium">Catégorie</th>
                  <th className="pb-3 font-medium">Prix</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {state.products.slice(0, 8).map((product) => {
                  const category = getCategoryById(product.categoryId)
                  const status =
                    product.quantity === 0
                      ? "rupture"
                      : product.quantity <= 5
                        ? "faible"
                        : "ok"
                  return (
                    <tr key={product.id} className="text-sm">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {category?.name || "-"}
                      </td>
                      <td className="py-3 text-foreground">
                        {product.price.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </td>
                      <td className="py-3 text-foreground">{product.quantity}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            status === "rupture"
                              ? "destructive"
                              : status === "faible"
                                ? "secondary"
                                : "default"
                          }
                          className={
                            status === "faible"
                              ? "bg-warning text-warning-foreground"
                              : status === "ok"
                                ? "bg-success text-success-foreground"
                                : ""
                          }
                        >
                          {status === "rupture"
                            ? "Rupture"
                            : status === "faible"
                              ? "Faible"
                              : "En stock"}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
