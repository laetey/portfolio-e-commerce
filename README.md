# Tests Playwright - Automation Exercise

Projet de tests UI en TypeScript pour le site [Automation Exercise](https://automationexercise.com/test_cases).

## Prérequis

- Node.js 18 ou plus récent
- npm

## Installation

```bash
npm install
npx playwright install chromium
```

## Exécution

```bash
# Lancer les tests en mode headless
npm test

# Lancer les tests avec le navigateur visible
npm run test:headed

# Ouvrir l'interface interactive Playwright
npm run test:ui

# Afficher le dernier rapport HTML
npm run test:report
```

Les tests sont organisés sous `tests/e2e/` par domaine (`account`, `login` et `site`). Les objets de page sont dans `pages/`, les sélecteurs et textes dans `constants/`, et les données de compte de test dans `test-data/`.

La suite couvre le chargement de la page Test Cases, la présence des 26 scénarios, l'ouverture d'un scénario, l'inscription, la connexion avec un compte de test (Test Case 2), le refus d'identifiants invalides (Test Case 3), la déconnexion (Test Case 4), le refus d'inscription avec une adresse déjà enregistrée (Test Case 5), le formulaire Contact Us sans authentification (Test Case 6), l'accès à la page Test Cases (Test Case 7), les détails du premier produit (Test Case 8), la recherche de produit (Test Case 9), l'inscription à la newsletter depuis la page d'accueil (Test Case 10) et depuis le panier (Test Case 11), l'ajout de produits au panier (Test Case 12), la vérification de la quantité d'un produit (Test Case 13), le placement d'une commande avec inscription pendant le checkout (Test Case 14), le placement d'une commande après inscription préalable (Test Case 15), le placement d'une commande après connexion préalable (Test Case 16) et la suppression d'un produit du panier (Test Case 17).

Le Test Case 2 crée un compte jetable avec le parcours d'inscription dans son `beforeEach`, le déconnecte avant le scénario de connexion, puis le supprime dans son `afterEach`. L'adresse email est unique à chaque exécution.

Le périmètre actuel ne contient pas de tests API ni de scénarios catalog/cart/checkout ; leurs dossiers et clients API seront ajoutés avec ces suites plutôt que sous forme d'emplacements vides.
