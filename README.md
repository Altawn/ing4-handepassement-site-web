# Handepassement

Bienvenue sur le dépôt du projet **Handepassement**.

## 📝 Description

**Handepassement** est une plateforme web dédiée à l'accompagnement des étudiants en situation de handicap dans l'enseignement supérieur. Elle vise à faciliter leur insertion et leur réussite académique grâce à des outils numériques adaptés.

### Fonctionnalités principales :
-   📅 **Prise de rendez-vous** : Module de réservation de créneaux avec gestion des disponibilités.
-   🤝 **Espace Étudiant** : Suivi personnalisé, accès aux documents et informations.
-   🛠️ **Espace Administrateur** : Gestion des étudiants, validation des inscriptions, planning des rendez-vous.
-   📚 **Documentation** : Ressources sur les aménagements et aides disponibles.
-   🔔 **Notifications** : Emails automatiques pour les confirmations et rappels de rendez-vous.

---

## 🚀 Technologies

Ce projet utilise une stack moderne pour garantir performance et maintenabilité :
-   **Frontend** : [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Langage** : [TypeScript](https://www.typescriptlang.org/)
-   **Styling** : [Tailwind CSS](https://tailwindcss.com/)
-   **Routing** : [React Router](https://reactrouter.com/)
-   **Backend / Base de données** : [Airtable](https://airtable.com/)
-   **Emails** : [EmailJS](https://www.emailjs.com/)
-   **Icônes** : [Lucide React](https://lucide.dev/)

---

## 🛠️ Installation et Configuration

Suivez ces étapes pour installer et lancer le projet localement.

### 1. Prérequis
-   **Node.js** (version 18 ou supérieure recommandée)
-   **npm** (ou yarn)

### 2. Cloner le projet
```bash
git clone https://gitlab.com/Altawn/handepassement-site-web.git
cd handepassement-site-web
```

### 3. Installer les dépendances
```bash
npm install
# ou si vous utilisez yarn : yarn install
```

### 4. Configuration des variables d'environnement
Le projet nécessite certaines clés API pour fonctionner (Airtable, EmailJS).
Créez un fichier `.env` à la racine du projet en dupliquant le fichier d'exemple :

```bash
cp .env.example .env
```

Puis ouvrez le fichier `.env` et remplissez les valeurs :
```env
# Airtable configuration
VITE_AIRTABLE_API_KEY=votre_cle_api_airtable
VITE_AIRTABLE_BASE_ID=votre_id_base_airtable

# EmailJS configuration
VITE_EMAILJS_PUBLIC_KEY=votre_public_key
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_UPDATE_TEMPLATE_ID=votre_update_template_id (optionnel)
```
> **Note** : Demandez ces clés à l'administrateur du projet si vous ne les avez pas.

---

## ▶️ Démarrage

Pour lancer le serveur de développement local :
```bash
npm run dev
```
L'application sera accessible sur `http://localhost:5173`.

---

## 📂 Structure du Projet

Voici une vue d'ensemble pour vous aider à naviguer dans le code :

```
src/
├── components/      # Composants réutilisables (Boutons, Modales, Widgets...)
├── pages/           # Pages de l'application (EspaceEtudiant, Admin, Login...)
├── services/        # Logique métier et appels API
│   ├── airtable.ts  # Configuration et fonctions liées à Airtable
│   └── email.ts     # Service d'envoi d'emails via EmailJS
├── styles/          # Fichiers CSS globaux et index.css
├── App.tsx          # Composant racine et configuration des routes
└── main.tsx         # Point d'entrée de l'application
```

---

## 📦 Build et Déploiement

Le projet est optimisé pour être déployé sur **Vercel** ou tout autre hébergeur statique.

### Créer une version de production
Pour compiler le projet pour la production :
```bash
npm run build
```
Les fichiers générés se trouveront dans le dossier `dist`.

### Déploiement Vercel
Le fichier `vercel.json` est présent à la racine pour configurer le déploiement automatique. Assurez-vous d'ajouter les variables d'environnement dans l'interface de Vercel lors du déploiement.

---

## 🤝 Contribuer

1.  Assurez-vous que le code respecte les règles de linter :
    ```bash
    npm run lint
    ```
2.  Créez une branche pour votre fonctionnalité et faites une Pull Request.

---
*Projet réalisé par Ronan MEYER, Matthias AUBERT, Marina SA NASCIMENTO dans le cadre de l'ING4.*
