export interface Category {
  id: string
  name: string
  description: string
  createdAt: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  categoryId: string
  supplierId: string
  price: number
  quantity: number
  sku: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface StoreState {
  categories: Category[]
  suppliers: Supplier[]
  products: Product[]
  chatMessages: ChatMessage[]
}

export type StoreAction =
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "ADD_CATEGORY"; payload: Category }
  | { type: "UPDATE_CATEGORY"; payload: Category }
  | { type: "DELETE_CATEGORY"; payload: string }
  | { type: "SET_SUPPLIERS"; payload: Supplier[] }
  | { type: "ADD_SUPPLIER"; payload: Supplier }
  | { type: "UPDATE_SUPPLIER"; payload: Supplier }
  | { type: "DELETE_SUPPLIER"; payload: string }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "ADD_CHAT_MESSAGE"; payload: ChatMessage }
  | { type: "LOAD_STATE"; payload: StoreState }
