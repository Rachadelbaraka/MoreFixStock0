# 🧪 Guide de Test - Authentification Admin

## 📋 Scénarios de Test

Utilisez ce guide pour tester complètement le système d'authentification.

---

## 🟢 Test 1: Connexion Réussie

### Étapes
1. Ouvrir `http://localhost:3000/login`
2. Saisir:
   - Email: `admin@morefix.com`
   - Mot de passe: `Admin123!`
3. Cliquer "Se connecter"

### Résultat Attendu
- ✅ Redirection vers `/` (dashboard)
- ✅ Sidebar affiche l'email `admin@morefix.com`
- ✅ Contenu du dashboard visible
- ✅ Button "Déconnexion" visible

### Détails Techniques
```
localStorage.getItem("morefix-auth")
// Doit contenir: { isAuthenticated: true, user: { email, id, role } }
```

---

## 🔴 Test 2: Email Incorrect

### Étapes
1. Ouvrir `http://localhost:3000/login`
2. Saisir:
   - Email: `wrong@example.com`
   - Mot de passe: `Admin123!`
3. Cliquer "Se connecter"

### Résultat Attendu
- ✅ Message d'erreur: "Email ou mot de passe incorrect"
- ✅ Rester sur la page `/login`
- ✅ Champs non vidés

---

## 🔴 Test 3: Mot de Passe Incorrect

### Étapes
1. Ouvrir `http://localhost:3000/login`
2. Saisir:
   - Email: `admin@morefix.com`
   - Mot de passe: `WrongPassword123!`
3. Cliquer "Se connecter"

### Résultat Attendu
- ✅ Message d'erreur: "Email ou mot de passe incorrect"
- ✅ Rester sur la page `/login`
- ✅ Champs non vidés

---

## 🟢 Test 4: Accès Protégé Sans Authentification

### Étapes
1. Ouvrir une fenêtre incognito
2. Aller directement à `http://localhost:3000/products`

### Résultat Attendu
- ✅ Redirection automatique vers `/login`
- ✅ Pas d'affichage du contenu
- ✅ Spinner visible pendant le chargement

---

## 🟢 Test 5: Protection de Toutes les Routes

### Étapes
Tester chaque route en fenêtre incognito:
1. `http://localhost:3000/`
2. `http://localhost:3000/products`
3. `http://localhost:3000/categories`
4. `http://localhost:3000/suppliers`
5. `http://localhost:3000/chatbot`

### Résultat Attendu
- ✅ Toutes redirigent vers `/login`

---

## 🟢 Test 6: Déconnexion

### Étapes
1. Se connecter (Test 1)
2. Cliquer "Déconnexion" dans la sidebar
3. Vérifier localStorage

### Résultat Attendu
- ✅ Redirection vers `/login`
- ✅ Email disparaît de la sidebar
- ✅ localStorage vide:
  ```javascript
  localStorage.getItem("morefix-auth") === null
  ```

---

## 🟢 Test 7: Persistance de Session

### Étapes
1. Se connecter (Test 1)
2. Actualiser la page (F5)
3. Vérifier que l'utilisateur est toujours connecté

### Résultat Attendu
- ✅ Rester connecté après refresh
- ✅ Email visible dans la sidebar
- ✅ Dashboard affiché sans redirection
- ✅ localStorage intacte

---

## 🟢 Test 8: localStorage Vidé

### Étapes
1. Se connecter
2. Ouvrir DevTools (F12)
3. Console → `localStorage.clear()`
4. Actualiser la page

### Résultat Attendu
- ✅ Redirection vers `/login`
- ✅ État de déconnexion correct

---

## 🟢 Test 9: Boutons du Formulaire

### Étapes
1. Ouvrir `/login`
2. Vérifier que le bouton "Se connecter" est désactivé
3. Saisir l'email
4. Vérifier que le bouton reste désactivé
5. Saisir le mot de passe
6. Vérifier que le bouton devient actif

### Résultat Attendu
- ✅ Bouton désactivé si champ vide
- ✅ Bouton actif si les deux champs remplis
- ✅ Texte "Connexion en cours..." pendant la requête

---

## 🟢 Test 10: Affichage Utilisateur Sidebar

### Étapes
1. Se connecter
2. Vérifier la sidebar

### Résultat Attendu
- ✅ Affiche "Connecté en tant que"
- ✅ Affiche l'email
- ✅ Badge avec couleur de fond

---

## 🔄 Test 11: Après Déconnexion

### Étapes
1. Se connecter
2. Déconnnecter
3. Tenter d'accéder à `/products`

### Résultat Attendu
- ✅ Redirection vers `/login`
- ✅ localStorage vide
- ✅ Sidebar n'affiche pas l'email

---

## 📱 Test 12: Responsivité Mobile

### Étapes
1. Ouvrir DevTools
2. Mode responsive (Ctrl+Shift+M)
3. Sélectionner un appareil mobile
4. Tester la navigation

### Résultat Attendu
- ✅ Menu mobile visible
- ✅ Toggle menu fonctionne
- ✅ Sidebar ferme en cliquant dehors
- ✅ Formulaire reste accessible

---

## ⌨️ Test 13: Navigation au Clavier

### Étapes
1. Ouvrir `/login`
2. Appuyer sur Tab pour naviguer
3. Saisir les identifiants
4. Appuyer sur Entrée

### Résultat Attendu
- ✅ Navigation au clavier fonctionne
- ✅ Focus visible sur les champs
- ✅ Entrée soumet le formulaire

---

## 🔍 Test 14: Cas Limites

### Cas 1: Espaces dans les identifiants
```
Email: "admin@morefix.com " (espace à la fin)
```
- ✅ Doit rejeter (pas de trim automatique)

### Cas 2: Casse des emails
```
Email: "ADMIN@MOREFIX.COM"
```
- ✅ Doit rejeter (sensible à la casse)

### Cas 3: Soumission multiple
- Cliquer plusieurs fois sur "Se connecter"
- ✅ Doit ignorer les clics multiples (button disabled)

---

## 🧪 Test 15: DevTools Inspection

### Étapes
1. Se connecter
2. Ouvrir DevTools (F12)

### Vérifications
- ✅ Console: Pas d'erreurs
- ✅ Application → localStorage:
  ```json
  {
    "isAuthenticated": true,
    "user": {
      "id": "admin-1",
      "email": "admin@morefix.com",
      "role": "admin"
    },
    "isLoading": false
  }
  ```
- ✅ Network: Pas de requête API (c'est local)
- ✅ Elements: Sidebar contient le bouton logout

---

## 📊 Matrice de Test

| # | Scénario | Status | Notes |
|---|----------|--------|-------|
| 1 | Connexion réussie | ✅ | Dashboard affiché |
| 2 | Email incorrect | ✅ | Erreur affichée |
| 3 | Mot de passe incorrect | ✅ | Erreur affichée |
| 4 | Route protégée sans auth | ✅ | Redirection |
| 5 | Toutes les routes | ✅ | Toutes protégées |
| 6 | Déconnexion | ✅ | localStorage vidé |
| 7 | Persistance session | ✅ | localStorage utilisé |
| 8 | localStorage clear | ✅ | Redirection |
| 9 | Boutons | ✅ | Désactivation OK |
| 10 | Affichage user | ✅ | Email visible |
| 11 | Après logout | ✅ | Protection OK |
| 12 | Mobile | ✅ | Responsive OK |
| 13 | Clavier | ✅ | Accessible |
| 14 | Cas limites | ✅ | Comportement attendu |
| 15 | DevTools | ✅ | Données OK |

---

## ✅ Checklist de Test Complète

### Avant Production
- [ ] Test 1 réussi
- [ ] Test 2-5 réussis
- [ ] Test 6-8 réussis
- [ ] Test 9-10 réussis
- [ ] Test 11-12 réussis
- [ ] Test 13-14 réussis
- [ ] Test 15 réussi
- [ ] Pas d'erreurs console
- [ ] localStorage fonctionne
- [ ] Redirection automatique OK

---

## 🔧 Outils de Test Utiles

### Browser DevTools
```javascript
// Vérifier l'état d'authentification
JSON.parse(localStorage.getItem("morefix-auth"))

// Forcer la déconnexion
localStorage.removeItem("morefix-auth")

// Vérifier le contexte Auth
// Dans les components client: console.log(useAuth().state)
```

### Test curl (Backend API, si implémenté)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@morefix.com",
    "password": "Admin123!"
  }'
```

---

## 📝 Notes de Test

- Tous les tests doivent passer avant déploiement
- Tester sur différents navigateurs
- Tester sur mobile et desktop
- Vérifier les performances (pas de lag)
- Vérifier l'accessibilité (clavier, lecteur d'écran)

---

## 🆘 Problèmes Observés

Si vous trouvez des problèmes:

1. Documenter le scénario exact
2. Vérifier la console pour les erreurs
3. Vérifier localStorage
4. Consulter DEBUGGING.md (si existe)
5. Créer une issue GitHub

---

**Tous les tests réussis? ✅ Votre app est prête! 🚀**
