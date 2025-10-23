![Strapi Cinema](https://media.gettyimages.com/id/2150652309/video/loopable-3d-animation-of-classic-movie-night-essentials-with-clapperboard-popcorn-and-film.jpg?s=640x640&k=20&c=HltjQAk8K8tO1q1W3kgDdKi9W3Mc3M5n20XqDIJLzCA=)

# 🎬 Strapi Cinema — Création et exploitation d'une API de gestion de films

**Auteur :** Team CDA ECO
**Date de création :** 09/10/2025  
**Statut :** Brouillon  
**Langue :** FR

---

## 🧭 Objectif du projet

Le projet **Strapi Cinema** a pour objectif de concevoir une **API complète** permettant de **gérer et d’exposer des données cinématographiques** (films, réalisateurs, acteurs) via un **CMS headless : Strapi**.

L'API devra interagir avec une API externe — **The Movie Database (TMDb)** — pour **importer automatiquement des données**, les **enrichir**, et les **exposer à travers des endpoints** sécurisés.

---

## 🧩 Référentiels

**Titre visé :** [2023] Concepteur⋅rice Développeur⋅se d’Applications

---

## 🧰 Ressources

- **CMS headless :** Strapi
- **API externe :** [The Movie Database (TMDb)](https://www.themoviedb.org/)

## 🗂️ Sources GitHub

- [exemple-issues.md](exemple-issues.md) — notions clés et bonnes pratiques pour créer des issues.
- [exemple-milestones.md](exemple-milestones.md) — repères pour structurer et suivre des milestones.

---

## 🎞️ Contexte du projet

La société **CineVerse** souhaite moderniser la gestion de son catalogue de films et d’acteurs.  
Jusqu’ici, les données étaient **dispersées entre plusieurs outils non connectés**.

L’entreprise souhaite désormais disposer d’un **système centralisé et automatisé** capable :

- d’importer des données depuis une source publique (TMDb),
- de les gérer dans une base locale,
- et de les exposer via une **API interne sécurisée**.

Les développeurs sont chargés de concevoir ce système en utilisant **Strapi** comme CMS headless, et en garantissant la **qualité**, la **cohérence** et la **sécurité** des échanges de données.

---

## 🛠️ Volet back-end

L’équipe back-end devra :

1. **Installer et configurer** un projet Strapi.
2. **Créer deux modèles de données** :
   - **Movie** : titre, description, date de sortie, réalisateur, acteurs (relation).
   - **Actor** : nom, prénom, date de naissance, film(s) associés.
3. **Consommer l’API externe TMDb** afin de récupérer des films et leurs acteurs, puis insérer ces données dans Strapi.
4. **Documenter toutes les requêtes API** utilisées pour les échanges (REST).
5. **Sécuriser l’accès à l’API** (authentification par token ou par compte utilisateur).
6. **Tester et valider les endpoints** à l’aide de Postman, Rest Client ou curl.
7. **Présenter le projet final** et sa **documentation technique complète**.
8. **Configurer une intégration continue** (GitHub Actions) pour lancer automatiquement lint/tests sur chaque pull request.

---

## 🛠️ Intégration continue (CI)

- Créer un workflow GitHub Actions (ou équivalent) qui s’exécute sur chaque push et pull request.
- Prévoir au minimum une étape d’installation, l’exécution des tests disponibles et des vérifications de qualité (lint, build).
- Documenter dans ce README comment lancer les mêmes vérifications en local.
- Utiliser les badges GitHub Actions dans le README dès que le pipeline est opérationnel.

---

## 🖥️ Volet front-end

En parallèle du développement de l’API, une interface utilisateur doit être réalisée afin de matérialiser l’expérience cible.

- **Interface statique** : créer une page vitrine en HTML/CSS (framework autorisé) permettant de parcourir les films et d’illustrer les contenus gérés par Strapi.
- **Maquette obligatoire** : produire au moins une maquette haute fidélité (Figma, XD…) validée avec l’équipe avant intégration.
- **Personas** : définir au moins deux profils cibles (ex. spectateur, programmateur) et lister leurs objectifs clés.
- **User journeys** : cartographier les parcours principaux (consultation d’un film, recherche d’acteurs) et les faire valider par les autres équipes ou parties prenantes.
- **Wireframes basse fidélité** : esquisser l’ergonomie des écrans avant intégration.
- **Maquettes haute fidélité** : proposer un design finalisé, cohérent avec la charte retenue.
- **Intégration** : implémenter les maquettes en HTML/CSS responsive et relier les contenus simulés aux captures Strapi ou aux endpoints disponibles.
- **Interaction avec l’API** : ajouter une couche JavaScript (vanilla ou framework léger) pour consommer l’API Strapi, gérer les états de chargement/erreur et afficher dynamiquement les contenus.

Tous les artefacts (personas, parcours, wireframes, maquettes) doivent être ajoutés au dépôt ou référencés via un lien partagé, et présentés lors des démos intermédiaires.

---

## 🧑‍🏫 Modalités pédagogiques

**Durée :** 10 jours (fin de Prairie)  
**Travail :** En binôme ou petit groupe

**Approche pédagogique :**

- _Learning by doing_
- Expérimentation, recherche et documentation personnelle
- Feedback collectif et démos intermédiaires

---

## 📘 User Stories

### 🎬 ÉPIQUE 1 — Installation et configuration du CMS Strapi

#### US-01 — Installation du projet

> En tant que **développeur**, je veux **installer et initialiser un projet Strapi** afin de disposer d’un back-office prêt à gérer les contenus.

**Critères d’acceptation :**

- Strapi est installé localement et fonctionne sur `localhost:1337`.
- Une configuration par défaut est opérationnelle.
- Un compte administrateur est créé et accessible.

---

#### US-02 — Configuration du projet

> En tant que **développeur**, je veux **configurer la base de données et les permissions** afin de préparer un environnement de travail sécurisé et cohérent.

**Critères d’acceptation :**

- La base (SQLite, PostgreSQL, etc.) est correctement reliée.
- Les rôles et permissions par défaut sont vérifiés.
- Les variables d’environnement sont gérées via `.env`.

---

### 🎞️ ÉPIQUE 2 — Modélisation des données (Films & Acteurs)

#### US-03 — Création du modèle Movie

> En tant qu’**administrateur du CMS**, je veux **créer un modèle Movie** pour structurer la gestion des films.

**Critères d’acceptation :**

- Modèle “Movie” créé dans Strapi.
- Champs : titre, description, date de sortie, réalisateur, acteurs.
- Relation bidirectionnelle avec “Actor”.

---

#### US-04 — Création du modèle Actor

> En tant qu’**administrateur du CMS**, je veux **créer un modèle Actor** pour gérer les acteurs et leur filmographie.

**Critères d’acceptation :**

- Modèle “Actor” créé dans Strapi.
- Champs : nom, prénom, date de naissance, films associés.
- Affichage croisé entre films et acteurs.

---

### 🌐 ÉPIQUE 3 — Intégration des données externes (TMDb)

#### US-05 — Connexion à l’API TMDb

> En tant que **développeur**, je veux **consommer l’API TMDb** afin de récupérer des informations sur les films et acteurs.

**Critères d’acceptation :**

- Clé TMDb valide dans `.env`.
- Endpoints identifiés et fonctionnels.
- Une requête GET renvoie des données valides.

---

#### US-06 — Import automatique des données

> En tant que **développeur**, je veux **importer les films et acteurs depuis TMDb** afin de centraliser la donnée dans Strapi.

**Critères d’acceptation :**

- Script d’import ou plugin fonctionnel.
- Données insérées dans Strapi avec relations correctes.
- Pas de doublons.

---

#### US-07 — Mise à jour périodique

> En tant qu’**administrateur technique**, je veux **planifier ou relancer l’import** pour maintenir le catalogue à jour.

**Critères d’acceptation :**

- Cron job ou commande de mise à jour.
- Nouveaux films ajoutés sans écraser les existants.

---

### 🔒 ÉPIQUE 4 — Sécurisation et gestion des accès

#### US-08 — Authentification API

> En tant qu’**utilisateur autorisé**, je veux **accéder à l’API via un token** afin de sécuriser les données internes.

**Critères d’acceptation :**

- Endpoints protégés (JWT ou token).
- 401 si non authentifié.
- Tokens expirés invalidés.

---

#### US-09 — Rôles et permissions

> En tant qu’**administrateur**, je veux **configurer les rôles et permissions** pour limiter les accès selon le profil.

**Critères d’acceptation :**

- Rôle “Public” restreint.
- Rôles “Authenticated” et “Admin” définis.
- Permissions conformes.

---

### 🔍 ÉPIQUE 5 — Documentation et validation

#### US-10 — Documentation technique

> En tant que **développeur**, je veux **documenter toutes les routes API et les échanges REST** pour garantir la maintenabilité du projet.

**Critères d’acceptation :**

- Endpoints listés et décrits (méthodes, payloads, codes retour).
- Exemples Postman / curl fournis.
- Documentation en anglais, versionnée.

---

#### US-11 — Tests et validation

> En tant qu’**équipe QA**, je veux **tester les endpoints** pour valider le bon fonctionnement du système.

**Critères d’acceptation :**

- Tests CRUD OK.
- Codes d’erreur cohérents (400, 404, 500).
- Résultats documentés.

---

#### US-12 — Démo et restitution

> En tant que **client CineVerse**, je veux **voir une démonstration complète** afin de valider la solution livrée.

**Critères d’acceptation :**

- Présentation orale du projet.
- Démonstration de l’import TMDb, de la gestion Strapi et de l’API.
- Documentation finale livrée.

---

### 🖥️ ÉPIQUE 6 — Expérience utilisateur & interface front

#### US-13 — Personas cibles

> En tant que **product owner**, je veux **formaliser les personas cibles** afin d’orienter les choix de conception de l’interface.

**Critères d’acceptation :**

- Au moins deux personas documentés (objectifs, frustrations, attentes).
- Format partagé (Markdown, PDF, Miro…) référencé dans le dépôt.
- Validation croisée avec le binôme back-end ou les parties prenantes.

---

#### US-14 — Parcours utilisateurs

> En tant que **UX designer**, je veux **cartographier les user journeys clés** pour assurer une navigation fluide.

**Critères d’acceptation :**

- Parcours couvrant la consultation d’un film et la recherche d’acteurs.
- Points de contact, émotions et irritants identifiés.
- Parcours présentés et validés lors d’un point d’équipe.

---

#### US-15 — Wireframes basse fidélité

> En tant que **designer**, je veux **produire des wireframes basse fidélité** pour poser la structure des écrans avant intégration.

**Critères d’acceptation :**

- Wireframes des écrans principaux (listing, fiche film, navigation).
- Respect des besoins identifiés dans les personas et user journeys.
- Partage avec l’équipe pour retours et ajustements.

---

#### US-16 — Maquettes haute fidélité

> En tant que **designer UI**, je veux **créer des maquettes haute fidélité** afin de valider la charte graphique et les interactions.

**Critères d’acceptation :**

- Maquettes desktop et mobile alignées sur la charte retenue.
- Composants réutilisables identifiés (cartes film, header, filtres…).
- Validation par le client interne ou référent pédagogique.

---

#### US-17 — Intégration HTML/CSS/JS

> En tant que **développeur front**, je veux **intégrer la page vitrine en HTML/CSS/JS responsive** pour illustrer l’expérience utilisateur cible.

**Critères d’acceptation :**

- Interface responsive (desktop, tablette, mobile) conforme aux maquettes.
- Contenus connectés à Strapi (API/exports) ou mockés de façon réaliste.
- Code JavaScript structuré (modules, composants ou script dédié) orchestrant l’affichage du contenu et les interactions de base.
- Code versionné, relu et déployable pour les démos.

---

#### US-18 — Consommation de l’API Strapi côté front

> En tant que **développeur front**, je veux **consommer l’API Strapi via JavaScript** afin d’afficher dynamiquement les films et acteurs.

**Critères d’acceptation :**

- Appels `fetch` (ou équivalent) vers les endpoints Strapi documentés.
- Gestion des états de chargement et d’erreur (indicateur visuel, message utilisateur).
- Données mises en cache ou filtrées côté client selon les besoins (ex. recherche, tri).
- Respect des contraintes de sécurité (tokens, variables d’environnement) et configuration claire dans la documentation.

---

## 🧾 Modalités d’évaluation

L’évaluation est continue, avec une **revue finale** à la fin des 10 jours.

**Seront observés :**

- Compréhension du besoin client.
- Pertinence des modèles de données.
- Qualité des échanges avec l’API externe.
- Clarté de la documentation technique.
- Authentification fonctionnelle.
- Autonomie, collaboration et communication technique.

---

## 📦 Livrables attendus

- Lien du dépôt GitHub public (organisation de la promo).
- Lien vers votre board GitHub Project.
- Projet Strapi complet et fonctionnel (**API “Strapi Cinema”**).
- Modèles **Movie** et **Actor** configurés et reliés.
- Script d’import automatique des données TMDb.
- Interface front-end HTML/CSS/JS responsive consommant l’API Strapi (ou utilisant des mocks réalistes si l’API n’est pas accessible).
- Pipeline d’intégration continue opérationnelle (GitHub Actions) avec tests/lint automatiques.
- Artefacts UX : personas, user journeys, wireframes, maquettes (fichiers ou liens partageables).
- Documentation technique (README) avec exemples de requêtes et guide d’intégration front/back (installation, configuration des clés, endpoints consommés).
- Démonstration finale en conditions réelles.

---

## ⚙️ Critères de performance

- Qualité et fiabilité de l’application.
- Respect des fonctionnalités décrites dans les User Stories.
- Facilité d’utilisation de l’API et de l’interface front (UX/UI).
- Respect des bonnes pratiques de développement (structure de projet, JS lisible, CSS maintenable).
- Robustesse de la consommation API côté front (gestion des erreurs, états de chargement).
- Versionnement Git rigoureux (plusieurs commits/jour).
- **Une branche par fonctionnalité.**
- Pipeline CI fiable (exécutions régulières, statut au vert avant merge).

---

## 💼 Situation professionnelle simulée

Développement et intégration d’une **API headless** pour la gestion de contenus cinématographiques.

---

## 🧠 Besoin client

Une société de production souhaite centraliser la gestion de ses films et acteurs dans un système moderne et évolutif.  
Le besoin est de disposer d’une **API centralisée** capable de :

- Gérer les contenus (films / acteurs),
- Importer automatiquement les données TMDb,
- Permettre la consultation via REST et GraphQL,
- Sécuriser l’accès aux données.

---

## 🧩 Compétences visées

| Code | Compétence                                             | Niveaux visés |
| ---- | ------------------------------------------------------ | ------------- |
| C1   | Installer et configurer son environnement de travail   | Niveau 1 à 3  |
| C2   | Développer des interfaces utilisateur                  | Niveau 1 à 3  |
| C3   | Développer des composants métier                       | Niveau 1 à 3  |
| C4   | Contribuer à la gestion d’un projet informatique       | Niveau 1      |
| C5   | Analyser les besoins et maquetter une application      | Niveau 1 à 2  |
| CT3  | Définir le périmètre d’un problème rencontré           | Niveau 1 à 2  |
| CT4  | Rechercher de façon méthodique des solutions           | Niveau 1 à 2  |
| CT5  | Partager la solution adoptée et documenter             | Niveau 1      |
| CT6  | Présenter un travail réalisé et répondre aux questions | Niveau 1      |

---

## 🏁 Fin du brief
