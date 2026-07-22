# Protocole d'intégration et déploiement continus

## Objectif

Garantir que chaque modification envoyée sur `main` est vérifiée avant déploiement de l'API.

## Workflow GitHub Actions

Le fichier `.github/workflows/deploy-api.yml` exécute deux étapes principales :

1. `quality`
   - checkout du dépôt
   - installation Node.js 22
   - activation Corepack
   - installation avec `yarn install --immutable`
   - lint API et desktop
   - tests Jest avec couverture
   - typecheck du package source
   - typecheck de l'API

2. `deploy`
   - connexion SSH au VPS
   - `git pull --ff-only`
   - build Docker sans cache
   - redémarrage du conteneur API
   - exécution des migrations MikroORM
   - nettoyage des images Docker inutilisées

## Secrets GitHub nécessaires

| Secret | Description |
|---|---|
| `VPS_HOST` | Adresse IP ou domaine du VPS |
| `VPS_USER` | Utilisateur SSH |
| `VPS_SSH_KEY` | Clé privée SSH autorisée sur le VPS |
| `VPS_APP_DIR` | Dossier du dépôt sur le VPS |

## Commandes de contrôle local

Avant de pousser :

```bash
yarn eslint ./apps/apii
yarn workspace desktop eslint src
yarn test --coverage --runInBand
yarn tsc --noEmit -p packages/source/tsconfig.json
yarn tsc --noEmit -p apps/apii/tsconfig.app.json
```

## Critères d'acceptation

- La CI doit échouer si les tests ou le typage échouent.
- Le déploiement ne démarre que si la qualité est validée.
- Les migrations doivent être lancées automatiquement après le redémarrage de l'API.
- Le déploiement doit être reproductible sans action manuelle hors configuration initiale du VPS.
