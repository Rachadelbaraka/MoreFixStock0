# 🔒 Système d'Authentification Admin - MoreFix

## 📋 Vue d'ensemble
Un système d'authentification sécurisé a été ajouté à l'application MoreFix pour protéger l'accès aux pages sensibles.

## 🔐 Identifiants de Connexion
- **Email** : `admin@morefix.com`
- **Mot de passe** : `Admin123!`

## 🎯 Fonctionnalités
### ✅ Implémenté
- **Page de connexion** (`/login`) - Interface moderne et sécurisée
- **Authentification Admin** - Vérification des identifiants
- **Contexte d'authentification** - Gestion globale de l'état d'authentification
- **Routes protégées** - Les pages suivantes nécessitent une authentification :
  - Dashboard (`/`)
  - Produits (`/products`)
  - Catégories (`/categories`)
  - Fournisseurs (`/suppliers`)
  - Chatbot IA (`/chatbot`)
- **Stockage de session** - Sauvegarde en localStorage (session persistante)
- **Bouton de déconnexion** - Dans la sidebar
- **Affichage utilisateur** - Email connecté visible dans la sidebar

## 🚀 Utilisation
1. Accédez à `http://localhost:3000/login`
2. Entrez les identifiants admin
3. Cliquez sur "Se connecter"
4. Vous serez redirigé vers le dashboard
5. Pour vous déconnecter, cliquez sur "Déconnexion" dans la sidebar

## 📂 Fichiers Créés/Modifiés
### Nouveaux fichiers :
- `lib/auth-context.tsx` - Contexte d'authentification avec reducer
- `app/login/page.tsx` - Page de connexion
- `components/protected-route.tsx` - Wrapper pour routes protégées

### Fichiers modifiés :
- `app/layout.tsx` - Ajout du AuthProvider
- `app/page.tsx` - Ajout de ProtectedRoute
- `app/products/page.tsx` - Ajout de ProtectedRoute
- `app/categories/page.tsx` - Ajout de ProtectedRoute
- `app/suppliers/page.tsx` - Ajout de ProtectedRoute
- `app/chatbot/page.tsx` - Ajout de ProtectedRoute
- `components/sidebar.tsx` - Ajout du bouton déconnexion et info utilisateur

## 🔄 Flux d'Authentification
```
User → Login Page → Verify Credentials → Set Auth State → Redirect to Dashboard
                                              ↓
                                         localStorage
```

## 🔮 Améliorations Futures
- [ ] API Backend pour vérifier les identifiants (remplacer les identifiants en dur)
- [ ] Base de données pour gérer les utilisateurs
- [ ] Tokens JWT pour les sessions
- [ ] 2FA (Authentification à deux facteurs)
- [ ] Gestion des rôles et permissions
- [ ] Historique des connexions
- [ ] Expiration de session

## ⚠️ Sécurité
**Note** : Les identifiants sont actuellement codés en dur pour la démonstration. 
En production, utilisez :
- Une API backend sécurisée
- Hachage des mots de passe (bcrypt)
- Tokens JWT avec expiration
- HTTPS obligatoire
- Rate limiting sur les tentatives de connexion
