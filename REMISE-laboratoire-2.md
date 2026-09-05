# Laboratoire 2 — Fiche de remise

> À déposer sur Teams. Ce fichier doit contenir la **liste des membres** et le **lien du dépôt GitHub**.

## 👥 Équipe

| Nom complet   | Matricule | (Optionnel) rôle |
| ------------- | --------- | ---------------- |
| Samuel Lortie | 0000000   | FullStack        |

## 🎯 Sujet (choisi au Laboratoire 1)

Sujet : RPG

## 🔗 Dépôt GitHub

Lien : https://github.com/Samy199L/LAB-RPG2

## ▶️ Lancer le projet

Backend :

```bash
cd backend
npm install
npm run dev        # http://localhost:3000
```

Frontend :

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Variables d'environnement à créer (non committées) : `DATABASE_URL`, `JWT_SECRET`.

## ✅ Fonctionnalités réalisées

- [x] Backend : CRUD complet
- [x] Backend : authentification JWT + rôles
- [x] Backend : intégration de l'API publique (Axios)
- [x] Backend : CORS activé
- [x] Frontend : affichage des données (useEffect + axios, 3 états)
- [x] Frontend : formulaire(s) de création
- [x] Frontend : connexion / inscription (token + AuthContext)
- [x] Frontend : action protégée (visible seulement si connecté)

## 📝 Remarques (facultatif)

...
