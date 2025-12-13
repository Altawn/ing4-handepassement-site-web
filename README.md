# Handepassement

Bienvenue sur le dépôt du projet **Handepassement**.

## 📝 Description

**Handepassement** est une plateforme web dédiée à l'accompagnement des étudiants en situation de handicap dans l'enseignement supérieur. Notre mission est de faciliter leur insertion et leur réussite académique à travers :

-   📅 **Prise de rendez-vous** pour un suivi personnalisé.
-   🤝 **Accompagnement sur mesure** adapté aux besoins spécifiques (Dyslexie, TDAH, Autisme, etc.).
-   📚 **Documentation** et ressources sur les aménagements disponibles.
-   🛠️ **Outils de compensation** numériques pour aider au quotidien.

L'objectif est de garantir des études supérieures sans obstacles : *"On Handiscute ?"*

## 🚀 Technologies utilisées

Ce projet est construit avec des technologies web modernes pour assurer performance et accessibilité :

-   **Framework** : [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
-   **Langage** : [TypeScript](https://www.typescriptlang.org/)
-   **Styles** : [Tailwind CSS](https://tailwindcss.com/)
-   **Routing** : [React Router](https://reactrouter.com/)
-   **Base de données / Backend** : [Airtable](https://airtable.com/)
-   **Icônes** : [Lucide React](https://lucide.dev/)

## 🛠️ Installation et Démarrage

Pour lancer le projet localement sur votre machine :

1.  **Cloner le dépôt** :
    ```bash
    git clone https://gitlab.com/Altawn/handepassement-site-web.git
    cd handepassement-site-web
    ```

2.  **Installer les dépendances** :
    ```bash
    yarn install
    ```

3.  **Configurer les variables d'environnement** :
    Créez un fichier `.env` à la racine du projet et ajoutez vos clés API Airtable (voir `.env.example` si disponible ou demandez à l'administrateur).
    ```env
    VITE_AIRTABLE_API_KEY=votre_cle_api
    VITE_AIRTABLE_BASE_ID=votre_id_base
    ```

4.  **Lancer le serveur de développement** :
    ```bash
    yarn run dev
    ```

5.  **Accéder à l'application** :
    Ouvrez votre navigateur à l'adresse indiquée (généralement `http://localhost:5173`).

## ✅ To-Do List

Cette section liste les tâches restantes et les améliorations à apporter au projet.

-- [ ] **Inscription**
    - [ ] Rendre les champs obligatoires.
    - [ ] Ajouter champ aidant familial
    - [ ] En mode Tritanopie, la page inscription est floutée 
    - [ ] Modal et oeil bloqué en mode Tritanopie et les autres
    - [ ] Protéger les mdp dans la bdd (admin devrait pas pouvoir les voir je pense)


- [ ] **Prise de rendez-vous**
    - [ ] Ajouter selon choix présentiel ou visio un lien visio ou localisation pour rdv (demander a Myriam)
    - [ ] générer un lien google meet pour visio


- [ ] **BDD**
    - [ ] Gérer statut étudiant "en attente" après premier RDV
    - [ ] Verif si l'étudiant est déjà dans la base en tant que "Etudiant" avant d'autoriser l'inscription (pas en attente) 
    - [ ] rajouter champs disponibilités dans table admin (ou creer un table en plus connecté a l'admin)


- [ ] **RDV**
    - [ ] connecter prise de rdv depuis page de connexion de l'étudiant
    - [ ] creer le champs de remplissage du résumé du rdv dans admin
    - [ ] connecté ces résumés à l'étudiant en question dans son espace 
    - [ ] enlever le bouton "nouveau rendez-vous" dans l'espace admin (si elle veut un rdv soit on met ca dans la to do list de l'étudiant - en mode prend un rdv avec moi, soit on envoie un mail)
    - [ ] rajouter une page ou un endroit pour que myriam puisse remplir ses dispo - comment on gere ca dans la bdd????
    - [ ] réalisé et validé ??? 


- [ ] **Connexion**
    - [x] Footer qui est en haut de la page
    - [ ] Régler le fait que si on tape "/admin" dans l'adresse, on est redirigé vers la page admin sans même s'être connecté (Faire une protection sur les pages nécessitant une connexion)


- [ ] **Admin**
    - [ ] rajouter bouton pour valider un etudiant - le faire passer de "en attente" à "etudiant"
    - [ ] detail de l'étudiant à lié avec l'étudiant sur lequel on clique, afficher ses infos (avec airtable)


- [ ] **Documentation**
    - [ ] creer la table documentation dans airtable
    - [ ] lier l'accès à la documentation à l'admin avec ajout et modification 
    - [ ] afficher la documentation dans l'espace etudiant


- [ ] **Automatisation**
    - [ ] Envoi de mail automatique pour la prise de RDV

- [ ] **Général**
    - [ ] Quand appui du bouton Handépassement alors qu'on est ceonnecté -> déconnexion (on veut être redirigé vers la page accueil client ou admin quand on clique sur handépassement et qu'on est connecté)

---
*Projet réalisé dans le cadre de l'ING4.*
