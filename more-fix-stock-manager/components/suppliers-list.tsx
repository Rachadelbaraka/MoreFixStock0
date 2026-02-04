"use client"

import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { SupplierForm } from "./supplier-form"
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Truck,
  Mail,
  Phone,
} from "lucide-react"
import type { Supplier } from "@/lib/types"

export function SuppliersList() {
  const { state, addSupplier, updateSupplier, deleteSupplier } = useStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)

  const getProductCountForSupplier = (supplierId: string) => {
    return state.products.filter((p) => p.supplierId === supplierId).length
  }

  const handleCreate = (data: { name: string; email: string; phone: string }) => {
    addSupplier(data)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormOpen(true)
  }

  const handleUpdate = (data: { name: string; email: string; phone: string }) => {
    if (editingSupplier) {
      updateSupplier({ ...editingSupplier, ...data })
      setEditingSupplier(null)
    }
  }

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (supplierToDelete) {
      deleteSupplier(supplierToDelete.id)
      setSupplierToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const handleFormClose = (open: boolean) => {
    setFormOpen(open)
    if (!open) {
      setEditingSupplier(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fournisseurs</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez vos fournisseurs et partenaires
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Fournisseur
        </Button>
      </div>

      {/* Suppliers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.suppliers.map((supplier) => {
          const productCount = getProductCountForSupplier(supplier.id)
          return (
            <Card key={supplier.id} className="group relative">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{supplier.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {productCount} produit{productCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteClick(supplier)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-2">
                {supplier.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${supplier.email}`}
                      className="hover:text-foreground hover:underline"
                    >
                      {supplier.email}
                    </a>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${supplier.phone}`}
                      className="hover:text-foreground hover:underline"
                    >
                      {supplier.phone}
                    </a>
                  </div>
                )}
                {!supplier.email && !supplier.phone && (
                  <p className="text-sm text-muted-foreground">
                    Aucune information de contact
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {state.suppliers.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <Truck className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Aucun fournisseur
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Commencez par ajouter vos fournisseurs et partenaires.
            </p>
            <Button className="mt-4" onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un fournisseur
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Dialog */}
      <SupplierForm
        open={formOpen}
        onOpenChange={handleFormClose}
        supplier={editingSupplier}
        onSubmit={editingSupplier ? handleUpdate : handleCreate}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le fournisseur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer &quot;{supplierToDelete?.name}&quot; ?
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
