/**
 * Configuration d'authentification
 * 
 * ⚠️ IMPORTANT: En production, utiliser des variables d'environnement
 * 
 * Exemple avec .env.local:
 * NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
 * NEXT_PUBLIC_ADMIN_PASSWORD=SomeSecurePassword123!
 */

export const AUTH_CONFIG = {
  // Identifiants admin (DEMO UNIQUEMENT)
  admin: {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@morefix.com",
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Admin123!",
  },

  // Configuration de session
  session: {
    storageKey: "morefix-auth",
    // Durée de session en ms (0 = illimitée)
    timeout: 0, // 30 * 60 * 1000 pour 30 minutes
  },

  // Routes publiques (ne nécessitent pas d'authentification)
  publicRoutes: ["/login", "/", "/public"],

  // Routes protégées
  protectedRoutes: ["/", "/products", "/categories", "/suppliers", "/chatbot"],
}

/**
 * ⚠️ SECURITÉ EN PRODUCTION
 * 
 * JAMAIS:
 * - Coder les mots de passe en dur
 * - Utiliser NEXT_PUBLIC_* pour les secrets
 * - Stocker les tokens en localStorage (utiliser httpOnly cookies)
 * 
 * À FAIRE:
 * - Utiliser une API backend pour l'authentification
 * - Hasher les mots de passe avec bcrypt
 * - Utiliser des JWT avec expiration
 * - Implémenter le refresh token
 * - Ajouter le CSRF protection
 * - Mettre en place le rate limiting
 */
