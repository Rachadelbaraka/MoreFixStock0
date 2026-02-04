# 🔧 Guide Technique - Authentification Admin

## 📋 Table des matières

1. [Architecture](#architecture)
2. [Implémentation](#implémentation)
3. [API du Contexte](#api-du-contexte)
4. [Exemples d'Utilisation](#exemples-dutilisation)
5. [Personnalisation](#personnalisation)
6. [Intégration Backend](#intégration-backend)

---

## 🏗️ Architecture

### Structure du Contexte d'Authentification

```typescript
// lib/auth-context.tsx

interface AuthState {
  isAuthenticated: boolean    // true si l'utilisateur est connecté
  user: {
    id: string               // ID unique de l'utilisateur
    email: string            // Email de l'utilisateur
    role: "admin"            // Rôle de l'utilisateur
  } | null
  isLoading: boolean         // true durant le chargement
}

// Actions disponibles
type AuthAction =
  | { type: "LOGIN"; payload: { id, email, role } }
  | { type: "LOGOUT" }
  | { type: "RESTORE_SESSION"; payload: AuthState }
  | { type: "SET_LOADING"; payload: boolean }
```

### Flux d'État Redux

```
Initial State
    ↓
useReducer(authReducer, initialState)
    ↓
dispatch(action)
    ↓
New State
    ↓
localStorage.setItem("morefix-auth", newState)
```

---

## 💻 Implémentation

### 1. AuthProvider (Root Layout)

```typescript
// app/layout.tsx
import { AuthProvider } from '@/lib/auth-context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. ProtectedRoute (Pages)

```typescript
// app/products/page.tsx
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
```

### 3. Login Page

```typescript
// app/login/page.tsx
"use client"

import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const { login } = useAuth()
  
  const handleSubmit = async (e) => {
    const success = await login(email, password)
    if (success) router.push("/")
  }
}
```

---

## 🔌 API du Contexte

### Hook: useAuth()

```typescript
const {
  state,                           // AuthState
  dispatch,                        // React.Dispatch<AuthAction>
  login,                           // async (email, password) => Promise<boolean>
  logout,                          // () => void
  isAdminAuthenticated,            // () => boolean
} = useAuth()
```

### Propriétés de State

```typescript
state.isAuthenticated      // boolean
state.user                 // { id, email, role } | null
state.user?.email          // string | undefined
state.user?.role           // "admin" | undefined
state.isLoading            // boolean
```

### Méthodes

```typescript
// Se connecter
await login("admin@morefix.com", "Admin123!")
// Returns: true si succès, false sinon

// Se déconnecter
logout()

// Vérifier si admin
if (isAdminAuthenticated()) {
  // Utilisateur est admin
}
```

---

## 💡 Exemples d'Utilisation

### Exemple 1: Afficher l'email de l'utilisateur

```typescript
"use client"

import { useAuth } from "@/lib/auth-context"

export function UserProfile() {
  const { state } = useAuth()
  
  return (
    <div>
      <p>Connecté en tant que: {state.user?.email}</p>
    </div>
  )
}
```

### Exemple 2: Bouton de déconnexion

```typescript
"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const { logout } = useAuth()
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    router.push("/login")
  }
  
  return <button onClick={handleLogout}>Déconnexion</button>
}
```

### Exemple 3: Condition sur l'authentification

```typescript
"use client"

import { useAuth } from "@/lib/auth-context"

export function AdminPanel() {
  const { state } = useAuth()
  
  if (state.isLoading) {
    return <LoadingSpinner />
  }
  
  if (!state.isAuthenticated) {
    return <div>Accès non autorisé</div>
  }
  
  return <div>Contenu admin</div>
}
```

### Exemple 4: Formulaire de connexion personnalisé

```typescript
"use client"

import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

export function CustomLoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const success = await login(email, password)
      
      if (!success) {
        setError("Identifiants invalides")
      }
    } catch (err) {
      setError("Erreur serveur")
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error">{error}</p>}
      <button type="submit">Se connecter</button>
    </form>
  )
}
```

---

## ⚙️ Personnalisation

### Changer les identifiants

#### Méthode 1: Directement dans auth-config.ts

```typescript
// lib/auth-config.ts
export const AUTH_CONFIG = {
  admin: {
    email: "nouveau@example.com",
    password: "NouveauMotDePasse123!",
  },
}
```

#### Méthode 2: Variables d'environnement

```bash
# .env.local
NEXT_PUBLIC_ADMIN_EMAIL=admin@custom.com
NEXT_PUBLIC_ADMIN_PASSWORD=SecurePassword!
```

### Ajouter plusieurs utilisateurs

```typescript
// lib/auth-context.tsx
const login = async (email: string, password: string): Promise<boolean> => {
  const validUsers = [
    { email: "admin@morefix.com", password: "Admin123!", role: "admin" },
    { email: "manager@morefix.com", password: "Manager123!", role: "admin" },
    { email: "user@morefix.com", password: "User123!", role: "viewer" },
  ]
  
  const user = validUsers.find(
    (u) => u.email === email && u.password === password
  )
  
  if (user) {
    dispatch({
      type: "LOGIN",
      payload: {
        id: `user-${user.email}`,
        email: user.email,
        role: user.role,
      },
    })
    return true
  }
  
  return false
}
```

### Ajouter une expiration de session

```typescript
// lib/auth-context.tsx
useEffect(() => {
  if (!state.isAuthenticated) return
  
  const timeout = setTimeout(() => {
    logout()
    // Rediriger vers /login
  }, 30 * 60 * 1000) // 30 minutes
  
  return () => clearTimeout(timeout)
}, [state.isAuthenticated])
```

### Personnaliser le composant ProtectedRoute

```typescript
// components/protected-route.tsx
export function ProtectedRoute({ 
  children, 
  requiredRole = "admin" 
}: { 
  children: React.ReactNode
  requiredRole?: string
}) {
  const { state } = useAuth()
  
  if (!state.isAuthenticated) {
    return <redirect to="/login" />
  }
  
  if (state.user?.role !== requiredRole) {
    return <div>Accès non autorisé</div>
  }
  
  return <>{children}</>
}
```

---

## 🔗 Intégration Backend

### Option 1: API Simple

```typescript
// lib/auth-context.tsx
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    
    if (!response.ok) {
      return false
    }
    
    const { user } = await response.json()
    
    dispatch({
      type: "LOGIN",
      payload: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
    
    return true
  } catch (error) {
    console.error("Erreur d'authentification:", error)
    return false
  }
}
```

### Option 2: JWT Token

```typescript
// lib/auth-context.tsx
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include", // Inclure les cookies
      body: JSON.stringify({ email, password }),
    })
    
    const { token, user } = await response.json()
    
    // Stocker le token
    localStorage.setItem("auth-token", token)
    
    dispatch({
      type: "LOGIN",
      payload: user,
    })
    
    return true
  } catch (error) {
    return false
  }
}

const logout = () => {
  localStorage.removeItem("auth-token")
  dispatch({ type: "LOGOUT" })
}
```

### Exemple API Route

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  
  // Vérifier dans la base de données
  const user = await db.users.findUnique({ where: { email } })
  
  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur non trouvé" },
      { status: 401 }
    )
  }
  
  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, user.passwordHash)
  
  if (!isValid) {
    return NextResponse.json(
      { error: "Mot de passe incorrect" },
      { status: 401 }
    )
  }
  
  // Générer JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
  
  return NextResponse.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  })
}
```

---

## 🧪 Tests

### Test du Contexte

```typescript
// __tests__/auth-context.test.tsx
import { render, screen } from "@testing-library/react"
import { AuthProvider, useAuth } from "@/lib/auth-context"

describe("AuthContext", () => {
  it("should login with correct credentials", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    const { login } = useAuth()
    const result = await login("admin@morefix.com", "Admin123!")
    
    expect(result).toBe(true)
  })
})
```

---

## 📚 Ressources

- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [React Context API](https://react.dev/reference/react/useContext)
- [Redux Pattern](https://redux.js.org/)
- [JWT](https://jwt.io/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

---

**Besoin d'aide?** Consultez les autres guides ou créez un issue!
