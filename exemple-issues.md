# Issues / User Stories

## Comprendre les issues GitHub

### Définition

Une issue GitHub est une fiche de suivi permettant de consigner un manque, un bug ou une idée d’amélioration. Elle centralise la discussion, les pièces jointes et les décisions prises pour résoudre le besoin.

### Pourquoi les utiliser ?

- Garder l’historique des décisions et des échanges techniques.
- Faciliter la priorisation avec labels, milestones et projets.
- Relier le code à une tâche précise en liant issues et pull requests.
- Répartir explicitement les responsabilités via l’assignation.

### Bonnes pratiques

**Niveau débutant**
- Rédiger un titre clair et orienté action (`“Corriger le formulaire de contact”`).
- Décrire le contexte, les étapes pour reproduire (si bug) et l’attendu.
- Ajouter au moins un label (`bug`, `feature`, `question`) pour classer l’issue.
- Mentionner les personnes concernées (`@collaborateur`) pour accélérer les retours.

**Niveau intermédiaire**
- Ajouter des captures, logs ou ressources utiles pour gagner du temps.
- Relier l’issue à une milestone ou un projet pour suivre l’avancement global.
- Découper une grosse demande en plusieurs issues plus petites et gérables.
- Lier l’issue à la pull request (`Fixes #123`) pour clôture automatique une fois le code mergé.

## ÉPIQUE 1 — Installation & configuration Strapi

### US-01 : Installation du projet Strapi

**Titre** : “Installation du projet Strapi”  
**Description** :

- En tant que développeur, je veux installer et initialiser un projet Strapi
- Critères d’acceptation :
  - Strapi fonctionne localement sur `localhost:1337`
  - Compte administrateur créé
  - Projet de base généré

### US-02 : Configuration du projet

**Titre** : “Configuration de la base de données & permissions”  
**Description** :

- Choisir et configurer la base (SQLite, PostgreSQL, etc.)
- Gérer les rôles et permissions dans Strapi
- Charger les variables d’environnement via `.env`

---

## ÉPIQUE 2 — Modélisation des données

### US-03 : Modèle Movie

**Titre** : “Création du modèle Movie”  
**Description** :

- Champs : titre, description, date de sortie, réalisateur, acteurs (relation)
- Relation avec le modèle Actor

### US-04 : Modèle Actor

**Titre** : “Création du modèle Actor”  
**Description** :

- Champs : nom, prénom, date de naissance
- Relation vers films associés

---

## ÉPIQUE 3 — Intégration des données externes (TMDb)

### US-05 : Connexion à l’API TMDb

**Titre** : “Connexion à l’API TMDb”  
**Description** :

- Clé TMDb chargée depuis `.env`
- Endpoints définis
- Requête GET valide

### US-06 : Import automatique des données

**Titre** : “Import des films et acteurs depuis TMDb”  
**Description** :

- Script ou plugin d’import fonctionnel
- Insertion dans Strapi avec relations correctes
- Pas de doublons

### US-07 : Mise à jour périodique

**Titre** : “Planification de l’import périodique”  
**Description** :

- Cron job ou commande déclencheur
- Prise en compte des nouvelles données sans écraser les anciennes

---

## ÉPIQUE 4 — Sécurisation & gestion des accès

### US-08 : Authentification API

**Titre** : “Implémentation de l’authentification API”  
**Description** :

- Endpoints protégés (token, JWT, etc.)
- Retour 401 pour accès non autorisé
- Invalidation des tokens expirés

### US-09 : Rôles et permissions

**Titre** : “Gestion des rôles et permissions dans Strapi”  
**Description** :

- Rôles “Public”, “Authenticated”, “Admin” définis
- Permissions de lecture / écriture contrôlées selon le rôle

---

## ÉPIQUE 5 — Documentation & validation

### US-10 : Documentation technique des endpoints

**Titre** : “Documenter les API REST”  
**Description** :

- Lister tous les endpoints (méthodes, payloads, codes retour)
- Exemples Postman / curl
- Documentation versionnée (README ou dossier dédié)

### US-11 : Tests & validation des endpoints

**Titre** : “Tests des endpoints CRUD”  
**Description** :

- Tester toutes les opérations CRUD
- Vérifier les codes d’erreur (400, 404, 500)
- Documenter les résultats

### US-12 : Démo & restitution finale

**Titre** : “Démonstration du projet & restitution”  
**Description** :

- Présentation orale du projet
- Démonstration de l’import TMDb, de l’API Strapi, de l’interface front
- Livrables (code, documentation, artefacts UX) remis

---

## ÉPIQUE 6 — Expérience utilisateur & interface front

### US-13 : Personas

**Titre** : “Formaliser les personas cibles”  
**Description** :

- Définir au moins 2 personas (objectifs, frustrations, attentes)
- Partager (md, PDF, Miro…) dans le dépôt

### US-14 : Parcours utilisateurs

**Titre** : “Cartographier les user journeys”  
**Description** :

- Parcours pour consultation d’un film, recherche d’acteurs
- Points de contact, émotions, irritants
- Validation avec l’équipe

### US-15 : Wireframes basse fidélité

**Titre** : “Créer des wireframes basse fidélité”  
**Description** :

- Esquisser les écrans principaux
- Respect des besoins définis
- Partager pour retours

### US-16 : Maquettes haute fidélité

**Titre** : “Réaliser des maquettes UI haute fidélité”  
**Description** :

- Desktop / mobile selon la charte
- Composants réutilisables
- Validation avec le client interne

### US-17 : Intégration HTML / CSS / JS

**Titre** : “Intégration front responsive”  
**Description** :

- Code HTML / CSS responsive selon maquettes
- Liaison avec Strapi ou données simulées
- Code versionné, structuré

### US-18 : Consommation de l’API Strapi côté front

**Titre** : “Afficher les films / acteurs via API Strapi”  
**Description** :

- Appels fetch vers endpoints documentés
- Gestion états chargement / erreur
- Respect sécurité (token, .env)
- Filtrer / trier / mettre en cache si nécessaire
