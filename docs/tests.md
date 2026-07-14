# Strategie de tests

## Objectif

Cette suite de tests couvre les fonctions metier critiques du projet Papyrus avec Jest.

## Commandes

```bash
yarn test
```

Commandes ciblees :

```bash
yarn test:source
yarn test:api
yarn test:desktop
yarn test:coverage
```

## Perimetre couvert

- `packages/source` : validation des DTO, formats de dates, objectifs, projets et recherches.
- `apps/apii` : progression des objectifs depuis une baseline.
- `apps/desktop` : offline/local DB, rappels de notifications via les reglages, fichiers affichables,
  conversion du contenu Lexical, dates, time picker, raccourcis clavier, composants UI,
  formulaires d'objectifs, cartes et details des domaines, navigation, dashboard, cartes mentales
  et reglages.

## Organisation

Tous les tests sont regroupes dans le dossier racine `tests/` :

- `tests/source` : tests des DTO et utilitaires du package source.
- `tests/apii` : tests unitaires du backend.
- `tests/desktop` : tests des composants, pages, local DB et utilitaires desktop.
- `tests/desktop/support` : fixtures, setup Jest et mocks partages.

## Verification actuelle

La commande `yarn test` execute les tests unitaires Jest des trois projets.
