## 🔐 Système de Sécurité Admin - Guide Complet

### 📌 Résumé des modifications

J'ai ajouté un **système d'authentification admin complet** pour sécuriser votre application MoreFix.

---

### 🎯 Fonctionnalités Principales

#### 1️⃣ **Page de Connexion** (`/login`)
- Interface moderne et élégante
- Validation des identifiants
- Messages d'erreur clairs
- Affichage des identifiants de démonstration

#### 2️⃣ **Authentification Admin**
- Email : `admin@morefix.com`
- Mot de passe : `Admin123!`

#### 3️⃣ **Routes Protégées**
Toutes les pages suivantes nécessitent une authentification :
- 🏠 Dashboard `/`
- 📦 Produits `/products`
- 📁 Catégories `/categories`
- 🚚 Fournisseurs `/suppliers`
- 🤖 Chatbot IA `/chatbot`

#### 4️⃣ **Session Persistante**
- Les données d'authentification sont sauvegardées en `localStorage`
- L'utilisateur reste connecté après actualisation
- La session se termine au clic sur "Déconnexion"

#### 5️⃣ **Sidebar Améliorée**
- Affiche l'email de l'utilisateur connecté
- Bouton de déconnexion visible
- Information utilisateur dans le panneau latéral

---

### 📂 Fichiers Créés

1. **`lib/auth-context.tsx`**
   - Contexte React pour gérer l'authentification
   - Reducer pour les actions (login, logout)
   - Hook personnalisé `useAuth()`

2. **`app/login/page.tsx`**
   - Page de connexion
   - Formulaire avec validation
   - Redirection automatique après connexion

3. **`components/protected-route.tsx`**
   - Composant wrapper pour les routes protégées
   - Redirige vers `/login` si non authentifié
   - Affiche un spinner pendant le chargement

---

### 📝 Fichiers Modifiés

| Fichier | Modification |
|---------|-------------|
| `app/layout.tsx` | Ajout du `AuthProvider` |
| `app/page.tsx` | Enveloppe avec `ProtectedRoute` |
| `app/products/page.tsx` | Enveloppe avec `ProtectedRoute` |
| `app/categories/page.tsx` | Enveloppe avec `ProtectedRoute` |
| `app/suppliers/page.tsx` | Enveloppe avec `ProtectedRoute` |
| `app/chatbot/page.tsx` | Enveloppe avec `ProtectedRoute` |
| `components/sidebar.tsx` | Bouton déconnexion + info utilisateur |

---

### 🚀 Comment utiliser

#### 1. Démarrer l'application
```bash
pnpm dev
# ou
npm run dev
```

#### 2. Accéder à la page de connexion
- Naviguez vers `http://localhost:3000/login`
- Vous serez redirigé vers `/login` automatiquement

#### 3. Se connecter
- Email : `admin@morefix.com`
- Mot de passe : `Admin123!`
- Cliquez sur "Se connecter"

#### 4. Accéder aux pages protégées
Après connexion, vous pouvez accéder à :
- Dashboard
- Produits
- Catégories
- Fournisseurs
- Chatbot

#### 5. Se déconnecter
- Cliquez sur "Déconnexion" dans la sidebar

---

### 🔄 Flux d'Authentification

```
┌─────────────────────────────────────────────────────────┐
│                    Utilisateur                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓
       ┌─────────────────────┐
       │  Essaye d'accéder   │
       │  à une page         │
       └────────┬────────────┘
                │
                ↓
       ┌─────────────────────┐
       │  Authentifié?       │
       └────┬────────────┬───┘
            │            │
         NON│            │OUI
            ↓            ↓
    ┌──────────────┐  ┌──────────────┐
    │ Page Login   │  │ Page Demandée│
    └──────────────┘  └──────────────┘
            │                │
            ↓                ↓
    ┌──────────────┐  ┌──────────────┐
    │Saisir login  │  │   Afficher   │
    │Envoyer       │  │  le contenu  │
    └──────┬───────┘  └──────────────┘
           │
           ↓
    ┌──────────────┐
    │ Valider      │
    │ credentials  │
    └──────┬───────┘
           │
           ↓
    ┌──────────────────┐
    │ Valide? Rediriger│
    │ sinon: erreur    │
    └──────────────────┘
```

---

### 🔐 Architecture de Sécurité

```
AuthContext (app/layout.tsx)
    ↓
AuthProvider
    ├── State: { isAuthenticated, user, isLoading }
    ├── login(email, password)
    ├── logout()
    └── isAdminAuthenticated()
         ↓
    ProtectedRoute (chaque page)
         ├── Vérifie isAuthenticated
         ├── Si false → redirige vers /login
         └── Si true → affiche le contenu
```

---

### ⚙️ Comportement Technique

| Événement | Comportement |
|-----------|-------------|
| App démarrage | Vérifie `localStorage` pour restaurer la session |
| Authentification | Sauvegarde en `localStorage` (clé: `morefix-auth`) |
| Accès page protégée | Vérifie `isAuthenticated` du contexte |
| Non authentifié | Redirige automatiquement vers `/login` |
| Déconnexion | Efface `localStorage` et redirige vers `/login` |
| Refresh page | Conserve la session (localStorage) |

---

### 🔮 Prochaines Étapes (Optionnel)

Pour améliorer la sécurité en production :

1. **Backend API**
   ```typescript
   POST /api/auth/login
   { email, password } → { token, user }
   ```

2. **Hachage des mots de passe**
   ```bash
   npm install bcryptjs
   ```

3. **Tokens JWT**
   ```bash
   npm install jsonwebtoken
   ```

4. **Expiration de session**
   ```typescript
   const sessionTimeout = 30 * 60 * 1000; // 30 minutes
   ```

5. **Rate limiting**
   ```bash
   npm install express-rate-limit
   ```

---

### 📋 Checklist de Déploiement

- [ ] Modifier les identifiants hardcodes
- [ ] Ajouter une API backend
- [ ] Implémenter le hachage des mots de passe
- [ ] Ajouter les tokens JWT
- [ ] Configurer HTTPS
- [ ] Mettre en place le rate limiting
- [ ] Ajouter les logs d'authentification
- [ ] Configurer 2FA

---

### 💡 Notes Importantes

⚠️ **Développement uniquement** : Les identifiants sont codés en dur pour la démonstration.

✅ **Production** : Utilisez une API backend sécurisée avec authentification proper.

---

Besoin d'aide ? Consultez le fichier [AUTH_SETUP.md](./AUTH_SETUP.md) pour plus de détails techniques.
