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

Les tests couvrent le chargement de la page Test Cases, la présence des 26 scénarios, l'ouverture d'un scénario ainsi que les sections d'instructions et de retour utilisateur. Le Test Case 1 automatise l'inscription complète avec des données uniques et supprime le compte créé à la fin.

Les sélecteurs, textes d'interface et données de test sont centralisés dans `tests/constants/`.
