# 🚀 Guide de Déploiement - MoreFix avec Authentification

## 📋 Avant de Déployer

### 1. Configuration de l'Authentification

#### Option A: Variables d'Environnement (RECOMMANDÉ)

Créez un fichier `.env.local` à la racine du projet :

```bash
# .env.local
NEXT_PUBLIC_ADMIN_EMAIL=votre-email@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=VotreMotDePasseSecurise123!
```

#### Option B: Identifiants par défaut

Modifier directement dans `lib/auth-config.ts` :

```typescript
export const AUTH_CONFIG = {
  admin: {
    email: "admin@example.com",
    password: "SecurePassword123!",
  },
  // ...
}
```

### 2. Installation et Build

```bash
# Installer les dépendances
pnpm install

# Tester en local
pnpm dev

# Build pour production
pnpm build

# Vérifier la build
pnpm start
```

---

## 🔐 Recommandations de Sécurité

### ✅ À FAIRE

- [x] Utiliser HTTPS en production
- [x] Ajouter une API backend pour l'authentification
- [x] Hasher les mots de passe (bcrypt)
- [x] Implémenter JWT avec expiration
- [x] Utiliser httpOnly cookies pour les tokens
- [x] Ajouter CSRF protection
- [x] Mettre en place le rate limiting
- [x] Implémenter 2FA
- [x] Ajouter des logs d'authentification

### ❌ À ÉVITER

- Ne pas coder les mots de passe en dur
- Ne pas utiliser localStorage pour les tokens sensibles
- Ne pas exposer les secrets via NEXT_PUBLIC_*
- Ne pas ignorer les erreurs de validation
- Ne pas accepter les cookies non sécurisés

---

## 📦 Déploiement sur Vercel

### 1. Configurer les variables d'environnement

```bash
# Via CLI
vercel env add NEXT_PUBLIC_ADMIN_EMAIL
vercel env add NEXT_PUBLIC_ADMIN_PASSWORD

# Ou via le dashboard Vercel
# Project Settings → Environment Variables
```

### 2. Déployer

```bash
# Option 1: Via git (recommandé)
git push origin main

# Option 2: Via CLI
vercel deploy --prod
```

### 3. Vérifier le déploiement

```bash
vercel open
# Ouvrir https://votre-projet.vercel.app/login
```

---

## 📦 Déploiement sur Netlify

### 1. Configuration du build

```bash
# Créer netlify.toml
[build]
  command = "pnpm build"
  publish = ".next"
```

### 2. Ajouter les variables d'environnement

Dashboard Netlify → Site Settings → Build & Deploy → Environment

```
NEXT_PUBLIC_ADMIN_EMAIL = votre-email@example.com
NEXT_PUBLIC_ADMIN_PASSWORD = VotreMotDePasse123!
```

### 3. Déployer

```bash
netlify deploy --prod
```

---

## 📦 Déploiement sur Railway / Render

### Variables d'environnement

Ajouter dans le dashboard :

```
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=SecurePassword123!
```

### Build command

```bash
pnpm build
```

### Start command

```bash
pnpm start
```

---

## 🔄 Mise à Jour de l'Authentification

### Changer les identifiants

1. **Via variables d'environnement:**
   ```bash
   # .env.local
   NEXT_PUBLIC_ADMIN_EMAIL=nouveau@email.com
   NEXT_PUBLIC_ADMIN_PASSWORD=NouveauMotDePasse123!
   ```

2. **Redémarrer l'application:**
   ```bash
   pnpm dev
   ```

### Ajouter des utilisateurs supplémentaires

Pour ajouter plusieurs utilisateurs, mettre à jour `auth-context.tsx` :

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  const validUsers = [
    { email: "admin@morefix.com", password: "Admin123!" },
    { email: "manager@morefix.com", password: "Manager123!" },
  ]
  
  const user = validUsers.find(u => u.email === email && u.password === password)
  
  if (user) {
    dispatch({
      type: "LOGIN",
      payload: {
        id: `user-${user.email}`,
        email: user.email,
        role: "admin",
      },
    })
    return true
  }
  return false
}
```

---

## 🚨 Dépannage

### L'application redirige constantement vers /login

**Cause:** Authentification non restaurée  
**Solution:** Vérifier que `localStorage` n'est pas désactivé

```bash
# Vérifier dans DevTools
localStorage.getItem("morefix-auth")
```

### Les identifiants ne fonctionnent pas

**Cause:** Variables d'environnement non chargées  
**Solution:** Redémarrer le serveur de dev

```bash
# Arrêter (Ctrl+C)
# Redémarrer
pnpm dev
```

### Session perdue après redéploiement

**Cause:** localStorage est local au navigateur  
**Solution:** Normale - c'est un comportement attendu

---

## 📊 Monitoring

### Logs d'authentification

Ajouter des logs dans `auth-context.tsx` :

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  console.log(`[AUTH] Tentative de connexion: ${email}`)
  
  // ...validation...
  
  if (success) {
    console.log(`[AUTH] ✅ Connexion réussie: ${email}`)
  } else {
    console.warn(`[AUTH] ❌ Échec de connexion: ${email}`)
  }
}
```

---

## 📞 Support

Pour plus d'aide:
- Consulter [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
- Consulter [AUTH_SETUP.md](./AUTH_SETUP.md)
- Créer un issue sur GitHub

---

**Dernière mise à jour:** Février 2026
