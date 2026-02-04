"use client"

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react"

interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    role: "admin"
  } | null
  isLoading: boolean
}

type AuthAction =
  | { type: "LOGIN"; payload: { id: string; email: string; role: "admin" } }
  | { type: "LOGOUT" }
  | { type: "RESTORE_SESSION"; payload: AuthState }
  | { type: "SET_LOADING"; payload: boolean }

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }
    case "RESTORE_SESSION":
      return action.payload
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdminAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restaurer la session au chargement
  useEffect(() => {
    const storedAuth = localStorage.getItem("morefix-auth")
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        dispatch({
          type: "RESTORE_SESSION",
          payload: authData,
        })
      } catch (error) {
        console.error("Erreur lors de la restauration de la session:", error)
      }
    }
    dispatch({ type: "SET_LOADING", payload: false })
  }, [])

  // Sauvegarder la session dans localStorage
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem("morefix-auth", JSON.stringify(state))
    }
  }, [state, state.isLoading])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Import de la configuration d'authentification
    const { AUTH_CONFIG } = await import("./auth-config")
    
    // Vérification des identifiants (DEMO - en production, utiliser une API)
    if (email === AUTH_CONFIG.admin.email && password === AUTH_CONFIG.admin.password) {
      dispatch({
        type: "LOGIN",
        payload: {
          id: "admin-1",
          email: email,
          role: "admin",
        },
      })
      return true
    }
    return false
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
    localStorage.removeItem("morefix-auth")
  }

  const isAdminAuthenticated = () => {
    return state.isAuthenticated && state.user?.role === "admin"
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        isAdminAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider")
  }
  return context
}
