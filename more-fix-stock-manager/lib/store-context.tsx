"use client"

import React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { StoreState, StoreAction, Category, Supplier, Product, ChatMessage } from "./types"
import { initialCategories, initialSuppliers, initialProducts } from "./mock-data"

const STORAGE_KEY = "morefix-store"

const initialState: StoreState = {
  categories: initialCategories,
  suppliers: initialSuppliers,
  products: initialProducts,
  chatMessages: [],
}

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "LOAD_STATE":
      return action.payload
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload }
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.payload] }
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      }
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.payload),
      }
    case "SET_SUPPLIERS":
      return { ...state, suppliers: action.payload }
    case "ADD_SUPPLIER":
      return { ...state, suppliers: [...state.suppliers, action.payload] }
    case "UPDATE_SUPPLIER":
      return {
        ...state,
        suppliers: state.suppliers.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      }
    case "DELETE_SUPPLIER":
      return {
        ...state,
        suppliers: state.suppliers.filter((s) => s.id !== action.payload),
      }
    case "SET_PRODUCTS":
      return { ...state, products: action.payload }
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] }
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      }
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      }
    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      }
    default:
      return state
  }
}

interface StoreContextType {
  state: StoreState
  dispatch: React.Dispatch<StoreAction>
  addCategory: (category: Omit<Category, "id" | "createdAt">) => Category
  updateCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  addSupplier: (supplier: Omit<Supplier, "id" | "createdAt">) => Supplier
  updateSupplier: (supplier: Supplier) => void
  deleteSupplier: (id: string) => void
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Product
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  addChatMessage: (role: "user" | "assistant", content: string) => void
  getCategoryById: (id: string) => Category | undefined
  getSupplierById: (id: string) => Supplier | undefined
  getProductById: (id: string) => Product | undefined
  getProductsByCategory: (categoryId: string) => Product[]
  getLowStockProducts: (threshold?: number) => Product[]
  getOutOfStockProducts: () => Product[]
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        dispatch({ type: "LOAD_STATE", payload: parsed })
      }
    } catch {
      console.error("Failed to load state from localStorage")
    }
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      console.error("Failed to save state to localStorage")
    }
  }, [state])

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const addCategory = (category: Omit<Category, "id" | "createdAt">) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: "ADD_CATEGORY", payload: newCategory })
    return newCategory
  }

  const updateCategory = (category: Category) => {
    dispatch({ type: "UPDATE_CATEGORY", payload: category })
  }

  const deleteCategory = (id: string) => {
    dispatch({ type: "DELETE_CATEGORY", payload: id })
  }

  const addSupplier = (supplier: Omit<Supplier, "id" | "createdAt">) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: "ADD_SUPPLIER", payload: newSupplier })
    return newSupplier
  }

  const updateSupplier = (supplier: Supplier) => {
    dispatch({ type: "UPDATE_SUPPLIER", payload: supplier })
  }

  const deleteSupplier = (id: string) => {
    dispatch({ type: "DELETE_SUPPLIER", payload: id })
  }

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: "ADD_PRODUCT", payload: newProduct })
    return newProduct
  }

  const updateProduct = (product: Product) => {
    dispatch({ type: "UPDATE_PRODUCT", payload: product })
  }

  const deleteProduct = (id: string) => {
    dispatch({ type: "DELETE_PRODUCT", payload: id })
  }

  const addChatMessage = (role: "user" | "assistant", content: string) => {
    const message: ChatMessage = {
      id: generateId(),
      role,
      content,
      timestamp: new Date().toISOString(),
    }
    dispatch({ type: "ADD_CHAT_MESSAGE", payload: message })
  }

  const getCategoryById = (id: string) => state.categories.find((c) => c.id === id)
  const getSupplierById = (id: string) => state.suppliers.find((s) => s.id === id)
  const getProductById = (id: string) => state.products.find((p) => p.id === id)
  const getProductsByCategory = (categoryId: string) =>
    state.products.filter((p) => p.categoryId === categoryId)
  const getLowStockProducts = (threshold = 5) =>
    state.products.filter((p) => p.quantity > 0 && p.quantity <= threshold)
  const getOutOfStockProducts = () => state.products.filter((p) => p.quantity === 0)

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        addCategory,
        updateCategory,
        deleteCategory,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addProduct,
        updateProduct,
        deleteProduct,
        addChatMessage,
        getCategoryById,
        getSupplierById,
        getProductById,
        getProductsByCategory,
        getLowStockProducts,
        getOutOfStockProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
