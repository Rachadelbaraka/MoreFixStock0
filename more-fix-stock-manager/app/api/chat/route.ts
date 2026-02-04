import { streamText, convertToModelMessages, Output } from "ai"
import * as z from "zod"

export const maxDuration = 30

const systemPrompt = `Tu es Assistant MoreFix, une intelligence artificielle integree dans une application de gestion de stock pour un magasin d'informatique.

L'application existe deja (produits, categories, fournisseurs, stock).
Tu es connecte au chatbot de l'application et tu interagis avec l'interface.

Ton role :
- Comprendre le langage naturel de l'utilisateur (francais)
- Aider a gerer le stock de maniere fluide et intelligente
- Repondre comme un assistant humain, professionnel et clair

Regles importantes :
- Ne jamais demander a l'utilisateur d'utiliser une commande specifique
- Ne jamais afficher de liste de commandes
- Ne jamais dire "commande reconnue"
- Toujours accepter des phrases naturelles
- Repondre de maniere naturelle et conversationnelle

Tu dois etre capable de :
- Analyser l'etat du stock
- Mettre a jour des quantites
- Creer ou modifier des categories
- Donner des informations sur des produits
- Identifier les ruptures et stocks faibles
- Repondre a des questions d'analyse ("qu'est-ce qui coute le plus cher", "qu'est-ce qui manque")

Fonctionnement interne :
Pour chaque message utilisateur, identifie l'intention et extrais les informations utiles (produit, quantite, categorie, fournisseur).

Tu dois TOUJOURS repondre en JSON valide avec ce format exact:
{
  "intent": "NOM_DE_L_INTENTION",
  "data": {},
  "message": "Reponse naturelle a afficher a l'utilisateur"
}

Intentions possibles :
- UPDATE_STOCK: Modifier la quantite d'un produit (data: { productName: string, quantity: number, operation: "add" | "set" })
- ADD_PRODUCT: Ajouter un nouveau produit (data: { name: string, sku: string, price: number, quantity: number, categoryName?: string, supplierName?: string, description?: string })
- CREATE_CATEGORY: Creer une nouvelle categorie (data: { name: string, description?: string })
- DELETE_CATEGORY: Supprimer une categorie (data: { name: string })
- CREATE_SUPPLIER: Creer un nouveau fournisseur (data: { name: string, email?: string, phone?: string })
- GET_LOW_STOCK: Demande des produits a stock faible (data: {})
- GET_OUT_OF_STOCK: Demande des produits en rupture (data: {})
- GET_PRODUCT_INFO: Demande d'info sur un produit (data: { productName: string })
- GET_STOCK_VALUE: Demande de la valeur totale du stock (data: {})
- LIST_PRODUCTS: Liste des produits (data: { categoryName?: string })
- LIST_CATEGORIES: Liste des categories (data: {})
- LIST_SUPPLIERS: Liste des fournisseurs (data: {})
- GENERAL_QUESTION: Question generale ou conversation (data: {})

Ton ton :
- Naturel
- Professionnel
- Amical
- Clair

Tu es un veritable assistant intelligent, pas un bot a commandes.`

const responseSchema = z.object({
  intent: z.enum([
    "UPDATE_STOCK",
    "ADD_PRODUCT",
    "CREATE_CATEGORY",
    "DELETE_CATEGORY",
    "CREATE_SUPPLIER",
    "GET_LOW_STOCK",
    "GET_OUT_OF_STOCK",
    "GET_PRODUCT_INFO",
    "GET_STOCK_VALUE",
    "LIST_PRODUCTS",
    "LIST_CATEGORIES",
    "LIST_SUPPLIERS",
    "GENERAL_QUESTION",
  ]),
  data: z.record(z.unknown()),
  message: z.string(),
})

export async function POST(req: Request) {
  const { messages, storeData } = await req.json()

  // Build context about current store state
  const storeContext = `
Etat actuel du stock:
- ${storeData.products.length} produit(s) en inventaire
- ${storeData.categories.length} categorie(s)
- ${storeData.suppliers.length} fournisseur(s)
- Valeur totale: ${storeData.products.reduce((acc: number, p: { price: number; quantity: number }) => acc + p.price * p.quantity, 0).toLocaleString("fr-FR")} EUR

Produits (nom, SKU, stock, prix):
${storeData.products.map((p: { name: string; sku: string; quantity: number; price: number }) => `- ${p.name} (${p.sku}): ${p.quantity} unites, ${p.price} EUR`).join("\n")}

Categories:
${storeData.categories.map((c: { name: string }) => `- ${c.name}`).join("\n")}

Fournisseurs:
${storeData.suppliers.map((s: { name: string }) => `- ${s.name}`).join("\n")}

Produits en rupture (stock = 0):
${storeData.products.filter((p: { quantity: number }) => p.quantity === 0).map((p: { name: string }) => `- ${p.name}`).join("\n") || "Aucun"}

Produits a stock faible (stock <= 5):
${storeData.products.filter((p: { quantity: number }) => p.quantity > 0 && p.quantity <= 5).map((p: { name: string; quantity: number }) => `- ${p.name}: ${p.quantity} unites`).join("\n") || "Aucun"}
`

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt + "\n\n" + storeContext,
    messages: await convertToModelMessages(messages),
    output: Output.object({ schema: responseSchema }),
  })

  return result.toUIMessageStreamResponse()
}
