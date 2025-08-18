# Papyrus

Projet de fin d'année de Mastère - Suite applicative avec API, Desktop et Mobile.

## Architecture

- **API** (`apps/api/`) - Backend NestJS
- **Desktop** (`apps/webui_desktop/`) - Application Electron
- **Mobile** *(à venir)* - React Native

## Stack Technique

- **Backend** : NestJS + TypeScript + Express
- **Desktop** : Electron + Vite + TypeScript
- **Monorepo** : Nx + Yarn 4
- **Qualité** : ESLint + Prettier + Husky + Commitlint

## Installation

```bash
git clone <repository-url>
cd papyrus
corepack enable
yarn install
```

## Développement

```bash
# API (port 3333)
yarn nx serve api

# Desktop App
yarn nx serve webui_desktop

# Tout en parallèle
yarn nx run-many --target=serve --all
```

## Build

```bash
yarn nx build api
yarn nx build webui_desktop
```

## Commits

Le projet utilise les commits conventionnels :

```bash
git commit -m "feat: nouvelle fonctionnalité"
git commit -m "fix: correction de bug"
git commit -m "docs: mise à jour documentation"
```

Les hooks Git valident automatiquement le code et le format des commits.
## Structure

```
apps/
├── api/          # Backend NestJS
└── webui_desktop/    # App Electron
packages/         # Code partagé
```

## Scripts Utiles

```bash
# Linting
yarn nx run-many --target=lint --all

# Tests
yarn nx run-many --target=test --all

# Générer du code
yarn nx g @nx/nest:controller <name> --project=api
```

## Troubleshooting

```bash
# Problème de cach
yarn nx reset

# Reinstall propre
yarn nx reset && yarn install
```
