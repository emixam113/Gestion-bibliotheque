# Application de bibliothèque: 
Une application de Bibliothèque qui permet de gérer une Bibliothèque. Les utilisateurs peuvent ajouter, modifier, supprimer des livres, ainsi que la filtrer et rechercher parmi ceux-ci.
l'application se connecte à une API pour effectuer ses opérations.

# Fonctionnalité: 
  - Affichage d'une liste de livre avec leur titre, auteur et statut de disponibilité.
  - Recherche de livre par un auteur ou par titre.
  - Filtrage de livre par disponibilité.
  - Ajout de nouveau livre à la bibliothèque.
  - Modification des informations des livres existant.
  - Suppression des livres.

# Technologie Utilisés:
  #   Backend:
  - Node.js: pour la construction d'une API Restful (il faut vérifier que nodeJS est bien installer).
  - PostgreSQL: Pour la gestion de la base de donnée.
  - Dotenv: pour la gestion des Variables d'environnement.
  - CORS: pour autoriser les requêtes provenant d'autre domaine.
   # Frontend:  
  - Vue.JS: Framework Javascript pour la création de l'interface utilisateu.
  - ViteJS: outil de build rapide pour VueJS.

# Installation 
  1. Prérequis:
Avant de commencer, assurer vous d'avoir:
  - NodeJS installé sur votre machine (version recommandé: LTS version 18.x.x). Vous pouvez le téléchargé sur le site officiel.
  - PostgreSQL installé sur votre Machine (version recommandé: 14.x.x). Téléchargé-le depuis le site officiel.
  - Git: pour cloner le projet (Facultatif si vous télécharger l'archive).
  - ViteJS installer sur l'ordinateur. consulter la documentation officiel de vite en cas de besoins

  2. Cloner le Projet:
     git clone https://github.com/emixam113/Gestion-bibliotheque.

  3. Configurer les variables d'environnement:
     - Créer un fichier .env dans le dossier racine du backend.
     - ajouter les informations suivantes:
           DATABASE_HOST=your_host
           DATABASE_PORT=your_port
           DATABASE_USER=your_postgres_user
           DATABASE_PASSWORD=your_postgres_password
           DATABASE_NAME=your_database_name
       remplacer les valeurs par vos informations personnelles.

  4. Démarrer le Backend:
    npm start

  5. Configurer le Frontend:
  Dans le dossier racine créer un nouveau projet VueJS avec ViteJS :
  npm create vite@latest
    répondez aux questions suivante:
  - nom du projet (par exemple: frontend);
  - Framework : Sélectionner Vue
  - Variation: choisir entre Vue (JavaScript) ou Vue (TypeScript)

  6. Accéder au dossier que vous avez créer:
     cd frontend

  7. installer les dépendances:
     npm install

  8. Lancer le Projet:
     npm run dev

Configurer VueJS. 
ajouter des fonctionnalité supplémentaire à votre Projet comme Vuex pour la gestion de l'état global si nécessaire.

Visualisation des données: 
L'application Chart.js pour afficher des statistiques de la bibliothèque sous forme de graphique. Par exemple: 
  - Répartition des livres par catégories.
  - Tendance des emprunts
  - Proportion des livres disponible et indisponible
