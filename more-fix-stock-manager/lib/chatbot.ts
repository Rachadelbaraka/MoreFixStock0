import type { StoreState, Category, Supplier, Product } from "./types"

interface ChatbotContext {
  state: StoreState
  addCategory: (data: { name: string; description: string }) => Category
  updateCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  addSupplier: (data: { name: string; email: string; phone: string }) => Supplier
  addProduct: (data: Omit<Product, "id" | "createdAt">) => Product
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  getCategoryById: (id: string) => Category | undefined
  getSupplierById: (id: string) => Supplier | undefined
  getLowStockProducts: (threshold?: number) => Product[]
  getOutOfStockProducts: () => Product[]
}

interface CommandResult {
  success: boolean
  message: string
  action?: string
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

function findProductByName(products: Product[], name: string): Product | undefined {
  const normalized = normalizeText(name)
  return products.find((p) => {
    const productName = normalizeText(p.name)
    return productName.includes(normalized) || normalized.includes(productName)
  })
}

function findCategoryByName(categories: Category[], name: string): Category | undefined {
  const normalized = normalizeText(name)
  return categories.find((c) => {
    const catName = normalizeText(c.name)
    return catName.includes(normalized) || normalized.includes(catName)
  })
}

function extractNumber(text: string): number | null {
  const match = text.match(/\d+/)
  return match ? parseInt(match[0]) : null
}

export function processCommand(input: string, context: ChatbotContext): CommandResult {
  const normalized = normalizeText(input)
  const { state } = context

  // Command: Add stock to a product
  // "Ajoute 10 claviers Logitech" or "ajoute 5 RTX 3060"
  if (normalized.includes("ajoute") || normalized.includes("ajouter")) {
    const quantity = extractNumber(input)
    if (quantity !== null) {
      // Try to find product name after the number
      const afterNumber = input.replace(/\d+/, "").trim()
      const words = afterNumber.split(/\s+/).filter((w) => 
        !["ajoute", "ajouter", "au", "stock", "de", "des", "du", "la", "le", "les", "un", "une"].includes(normalizeText(w))
      )
      
      if (words.length > 0) {
        const searchTerm = words.join(" ")
        const product = findProductByName(state.products, searchTerm)
        
        if (product) {
          context.updateProduct({ ...product, quantity: product.quantity + quantity })
          return {
            success: true,
            message: `J'ai ajouté ${quantity} unité(s) au produit "${product.name}". Stock actuel: ${product.quantity + quantity} unités.`,
            action: "add_stock",
          }
        }
      }
    }
    
    return {
      success: false,
      message: "Je n'ai pas trouvé ce produit. Essayez: \"Ajoute 10 [nom du produit]\"",
    }
  }

  // Command: Change/Set stock
  // "Change le stock de la RTX 3060 à 5" or "met le stock du clavier à 20"
  if (
    normalized.includes("change") ||
    normalized.includes("met") ||
    normalized.includes("modifier") ||
    normalized.includes("defini")
  ) {
    const matches = input.match(/(?:à|a)\s*(\d+)/i)
    if (matches) {
      const newQuantity = parseInt(matches[1])
      // Find product name
      const productNameMatch = input.match(/(?:de|du|des|la|le|les)\s+(.+?)(?:\s+(?:à|a)\s*\d+)/i)
      if (productNameMatch) {
        const searchTerm = productNameMatch[1].trim()
        const product = findProductByName(state.products, searchTerm)
        
        if (product) {
          const oldQty = product.quantity
          context.updateProduct({ ...product, quantity: newQuantity })
          return {
            success: true,
            message: `Stock de "${product.name}" modifié: ${oldQty} → ${newQuantity} unités.`,
            action: "set_stock",
          }
        }
      }
    }
    
    return {
      success: false,
      message: "Je n'ai pas compris. Essayez: \"Change le stock de [produit] à [nombre]\"",
    }
  }

  // Command: Create category
  // "Crée une catégorie Écrans" or "créer catégorie Moniteurs"
  if (normalized.includes("cree") || normalized.includes("creer") || normalized.includes("nouvelle categorie")) {
    const categoryMatch = input.match(/(?:catégorie|categorie)\s+(.+)/i)
    if (categoryMatch) {
      const categoryName = categoryMatch[1].trim()
      const existing = findCategoryByName(state.categories, categoryName)
      
      if (existing) {
        return {
          success: false,
          message: `La catégorie "${existing.name}" existe déjà.`,
        }
      }
      
      const newCat = context.addCategory({ name: categoryName, description: "" })
      return {
        success: true,
        message: `Catégorie "${newCat.name}" créée avec succès.`,
        action: "create_category",
      }
    }
    
    return {
      success: false,
      message: "Essayez: \"Crée une catégorie [nom]\"",
    }
  }

  // Command: Products out of stock
  // "Quels produits sont en rupture ?" or "rupture de stock"
  if (normalized.includes("rupture") || normalized.includes("epuise") || normalized.includes("plus en stock")) {
    const outOfStock = context.getOutOfStockProducts()
    
    if (outOfStock.length === 0) {
      return {
        success: true,
        message: "Aucun produit n'est en rupture de stock.",
        action: "query_stock",
      }
    }
    
    const productList = outOfStock.map((p) => `• ${p.name} (${p.sku})`).join("\n")
    return {
      success: true,
      message: `${outOfStock.length} produit(s) en rupture de stock:\n${productList}`,
      action: "query_stock",
    }
  }

  // Command: Low stock
  // "Quels produits ont un stock faible ?" or "stock faible"
  if (normalized.includes("stock faible") || normalized.includes("faible stock") || normalized.includes("bientot epuise")) {
    const lowStock = context.getLowStockProducts()
    
    if (lowStock.length === 0) {
      return {
        success: true,
        message: "Aucun produit n'a un stock faible (moins de 5 unités).",
        action: "query_stock",
      }
    }
    
    const productList = lowStock.map((p) => `• ${p.name}: ${p.quantity} unité(s)`).join("\n")
    return {
      success: true,
      message: `${lowStock.length} produit(s) avec stock faible:\n${productList}`,
      action: "query_stock",
    }
  }

  // Command: List products
  // "Liste les produits" or "montre moi les produits"
  if (normalized.includes("liste") && normalized.includes("produit")) {
    const products = state.products.slice(0, 10)
    const productList = products.map((p) => `• ${p.name}: ${p.quantity} unité(s) - ${p.price}€`).join("\n")
    const more = state.products.length > 10 ? `\n... et ${state.products.length - 10} autre(s)` : ""
    return {
      success: true,
      message: `${state.products.length} produit(s) en inventaire:\n${productList}${more}`,
      action: "list_products",
    }
  }

  // Command: List categories
  if (normalized.includes("liste") && normalized.includes("categorie")) {
    const categoryList = state.categories.map((c) => `• ${c.name}`).join("\n")
    return {
      success: true,
      message: `${state.categories.length} catégorie(s):\n${categoryList}`,
      action: "list_categories",
    }
  }

  // Command: Product info
  // "Info sur RTX 4070" or "details clavier logitech"
  if (normalized.includes("info") || normalized.includes("detail") || normalized.includes("combien")) {
    // Extract product name
    const words = input.split(/\s+/).filter((w) => 
      !["info", "infos", "information", "informations", "detail", "details", "sur", "de", "du", "le", "la", "les", "combien", "y", "a", "t", "il"].includes(normalizeText(w))
    )
    
    if (words.length > 0) {
      const searchTerm = words.join(" ")
      const product = findProductByName(state.products, searchTerm)
      
      if (product) {
        const category = context.getCategoryById(product.categoryId)
        const supplier = context.getSupplierById(product.supplierId)
        return {
          success: true,
          message: `**${product.name}**\nSKU: ${product.sku}\nCatégorie: ${category?.name || "N/A"}\nFournisseur: ${supplier?.name || "N/A"}\nPrix: ${product.price}€\nStock: ${product.quantity} unité(s)\n${product.description}`,
          action: "product_info",
        }
      }
    }
    
    return {
      success: false,
      message: "Produit non trouvé. Essayez: \"Info sur [nom du produit]\"",
    }
  }

  // Command: Total stock value
  if (normalized.includes("valeur") && (normalized.includes("stock") || normalized.includes("inventaire"))) {
    const totalValue = state.products.reduce((acc, p) => acc + p.price * p.quantity, 0)
    const totalItems = state.products.reduce((acc, p) => acc + p.quantity, 0)
    return {
      success: true,
      message: `Valeur totale du stock: ${totalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€\nNombre total d'articles: ${totalItems}`,
      action: "stock_value",
    }
  }

  // Command: Help
  if (normalized.includes("aide") || normalized.includes("help") || normalized.includes("commande")) {
    return {
      success: true,
      message: `**Commandes disponibles:**
• "Ajoute [nombre] [produit]" - Ajouter du stock
• "Change le stock de [produit] à [nombre]" - Modifier le stock
• "Crée une catégorie [nom]" - Créer une catégorie
• "Quels produits sont en rupture ?" - Voir les ruptures
• "Stock faible" - Voir les stocks bas
• "Liste les produits" - Lister l'inventaire
• "Info sur [produit]" - Détails d'un produit
• "Valeur du stock" - Valeur totale`,
      action: "help",
    }
  }

  // Default response
  return {
    success: false,
    message: "Je n'ai pas compris votre demande. Tapez \"aide\" pour voir les commandes disponibles.",
  }
}
