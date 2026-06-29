# EventSync Admin

Panel d'administration pour la plateforme EventSync. Il permet de gérer l'ensemble du contenu de l'application — événements, sessions, intervenants, salles et questions Q&A — sans toucher au code ni à la base de données directement.

Construit avec **React Admin v5**, il communique avec le backend EventSync via une API REST sécurisée par JWT.

---

## Ce que permet le panel

- Créer, modifier et supprimer des **événements** (la suppression est en cascade : sessions, speakers, salles et questions sont supprimés automatiquement)
- Gérer les **sessions** avec leurs horaires, leur salle et leurs intervenants — un badge LIVE s'affiche en temps réel dans la liste
- Gérer les **intervenants** avec bio, photo de profil et liens externes (Twitter, LinkedIn, GitHub…)
- Gérer les **salles** associées à un événement
- Consulter et supprimer les **questions Q&A** posées par les participants

---

## Stack technique

- **React Admin v5** — framework d'administration React
- **Vite** — bundler et serveur de développement
- **TypeScript**
- **Material UI** — composants UI fournis par React Admin

---

## Structure du projet

```
Event-Sync-Admin/
└── admin/
    ├── src/
    │   ├── events/          # Pages Create / Edit pour les événements
    │   ├── sessions/        # Pages Create / Edit pour les sessions
    │   ├── speakers/        # Pages Create / Edit pour les intervenants
    │   ├── rooms/           # Pages Create / Edit pour les salles
    │   ├── questions/       # Liste et suppression des questions Q&A
    │   ├── dataProvider.ts  # Client HTTP custom — gère les UUIDs et les routes spécifiques
    │   ├── authProvider.ts  # Connexion / déconnexion via JWT
    │   └── Layout.tsx       # Sidebar et structure de l'interface
    └── vite.config.ts
```

---

## Installation

```bash
cd admin
npm install
```

Créer un fichier `.env` dans le dossier `admin/` :

```env
VITE_API_URL=http://localhost:4000
```

Démarrer le panel :

```bash
npm run dev
```

Le panel est accessible sur **http://localhost:5173**.

> Le backend EventSync doit être démarré avant sur **http://localhost:4000**.

---

## Connexion

La connexion utilise l'email et le mot de passe d'un compte `Organizer` enregistré en base de données. Après connexion, le token JWT est stocké dans le `localStorage` sous la clé `adminToken` et ajouté automatiquement à toutes les requêtes.

---

## Détails par ressource

### Événements
- Le **slug** est généré automatiquement depuis le titre à la création, et mis à jour si le titre est modifié (sauf si un slug manuel est renseigné)
- La suppression d'un événement **supprime en cascade** toutes les données liées : sessions, questions, intervenants, liens et salles

### Sessions
- Lors de la création, il faut sélectionner un **événement** et optionnellement une **salle**
- La liste affiche un badge **LIVE** en rouge pour les sessions actuellement en cours
- Le filtre par événement permet de n'afficher que les sessions d'un événement donné

### Intervenants
- À la création, l'intervenant est rattaché à un événement via le champ **Événement**
- Les **liens externes** (Twitter, LinkedIn, GitHub, etc.) peuvent être ajoutés et modifiés directement depuis le formulaire
- Un filtre par événement est disponible dans la liste

### Salles
- Une salle appartient à un seul événement — à sélectionner obligatoirement à la création

### Questions
- Liste globale de toutes les questions posées par les participants via le Q&A
- La suppression d'une question la retire immédiatement du frontend

---

## Notes techniques

**dataProvider custom** — Le `dataProvider.ts` est entièrement écrit à la main (sans `ra-data-simple-rest`) pour gérer les spécificités du backend : les IDs sont des UUIDs, les événements ont des routes dédiées (`/api/events/id/:id` pour les opérations admin), et la création d'événement complet passe par une route spéciale (`/api/events/full`).

**mutationMode pessimistic** — Tous les formulaires d'édition utilisent `mutationMode="pessimistic"`. Cela signifie que la sauvegarde attend la réponse du serveur avant de mettre à jour l'interface, ce qui garantit que le slug et les autres champs calculés côté serveur sont bien affichés après modification.
