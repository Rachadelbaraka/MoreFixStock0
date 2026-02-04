"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProductForm } from "./product-form"
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
  Search,
} from "lucide-react"
import type { Product } from "@/lib/types"

export function ProductsList() {
  const {
    state,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategoryById,
    getSupplierById,
  } = useStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  const filteredProducts = state.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || product.categoryId === categoryFilter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "out" && product.quantity === 0) ||
      (stockFilter === "low" && product.quantity > 0 && product.quantity <= 5) ||
      (stockFilter === "ok" && product.quantity > 5)
    return matchesSearch && matchesCategory && matchesStock
  })

  const handleCreate = (data: Omit<Product, "id" | "createdAt">) => {
    addProduct(data)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const handleUpdate = (data: Omit<Product, "id" | "createdAt">) => {
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...data })
      setEditingProduct(null)
    }
  }

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id)
      setProductToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleFormClose = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setEditingProduct(null)
    }
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: "Rupture", variant: "destructive" as const }
    if (quantity <= 5) return { label: "Faible", variant: "warning" as const }
    return { label: "En stock", variant: "success" as const }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produits</h1>
          <p className="mt-1 text-muted-foreground">
            {state.products.length} produit{state.products.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Produit
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {state.categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="ok">En stock</SelectItem>
                <SelectItem value="low">Stock faible</SelectItem>
                <SelectItem value="out">Rupture</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Produit</th>
                  <th className="p-4 font-medium">Catégorie</th>
                  <th className="p-4 font-medium">Fournisseur</th>
                  <th className="p-4 font-medium">Prix</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Statut</th>
                  <th className="p-4 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => {
                  const category = getCategoryById(product.categoryId)
                  const supplier = getSupplierById(product.supplierId)
                  const status = getStockStatus(product.quantity)
                  return (
                    <tr key={product.id} className="text-sm hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {category?.name || "-"}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {supplier?.name || "-"}
                      </td>
                      <td className="p-4 text-foreground">
                        {product.price.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </td>
                      <td className="p-4 text-foreground">{product.quantity}</td>
                      <td className="p-4">
                        <Badge
                          className={
                            status.variant === "warning"
                              ? "bg-warning text-warning-foreground"
                              : status.variant === "success"
                                ? "bg-success text-success-foreground"
                                : ""
                          }
                          variant={status.variant === "destructive" ? "destructive" : "default"}
                        >
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(product)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDeleteClick(product)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">
                Aucun produit trouvé
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery || categoryFilter !== "all" || stockFilter !== "all"
                  ? "Essayez de modifier vos filtres de recherche."
                  : "Commencez par ajouter un produit à votre inventaire."}
              </p>
              {!searchQuery && categoryFilter === "all" && stockFilter === "all" && (
                <Button className="mt-4" onClick={() => setFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un produit
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ProductForm
        open={formOpen}
        onOpenChange={handleFormClose}
        product={editingProduct}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer &quot;{productToDelete?.name}&quot; ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
