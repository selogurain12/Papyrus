# Papyrus

Papyrus est une application de bureau pour organiser, rediger et suivre un projet d'ecriture. Le projet est organise en monorepo avec une API NestJS, une application desktop Electron/React, une application vitrine React et un package TypeScript partage.

## Sommaire

- [Architecture](#architecture)
- [Prerequis](#prerequis)
- [Installation locale](#installation-locale)
- [Configuration de l'API](#configuration-de-lapi)
- [Lancer le projet en developpement](#lancer-le-projet-en-developpement)
- [Base de donnees et migrations](#base-de-donnees-et-migrations)
- [Tests et qualite](#tests-et-qualite)
- [Build et application desktop](#build-et-application-desktop)
- [Deploiement Docker de l'API](#deploiement-docker-de-lapi)
- [Commandes utiles](#commandes-utiles)
- [Depannage](#depannage)

## Architecture

```text
apps/
  apii/          API NestJS, MikroORM, PostgreSQL, S3
  desktop/       Application Electron + Vite + React
  app-vitrine/   Site vitrine React/Vite

packages/
  source/        DTO, contrats, schemas et utilitaires partages

docs/            Documentation technique, CI/CD, deploiement et tests
tests/           Tests Jest front, API et package partage
```

## Stack technique

- Monorepo : Nx + Yarn 4
- API : NestJS, TypeScript, Express, MikroORM, PostgreSQL
- Desktop : Electron Forge, Vite, React, SQLite local avec `better-sqlite3`
- Front : TanStack Router, React Query, ts-rest, React Hook Form
- Stockage fichiers : S3 cote API, fichiers locaux cote desktop hors ligne
- Tests : Jest, Testing Library, ts-jest
- Qualite : ESLint, TypeScript, Husky, Commitlint
- Deploiement : Docker Compose, GitHub Actions, migrations MikroORM

## Prerequis

Installe les outils suivants avant de demarrer :

- Node.js `22.21.1` recommande
- Corepack, fourni avec Node dans les installations recentes
- Yarn `4.9.2`, active via Corepack
- Docker et Docker Compose pour PostgreSQL/API en conteneur
- Git

Verifie les versions :

```bash
node --version
corepack --version
docker --version
docker compose version
```

Si `corepack` n'est pas disponible, installe une version recente de Node.js, puis relance ton terminal.

## Installation locale

```bash
git clone https://github.com/selogurain12/Papyrus.git
cd Papyrus
corepack enable
corepack prepare yarn@4.9.2 --activate
yarn install --immutable
```

Si tu travailles deja dans le dossier du projet :

```bash
cd /chemin/vers/Papyrus
corepack enable
corepack prepare yarn@4.9.2 --activate
yarn install --immutable
```

## Configuration de l'API

L'API lit sa configuration depuis des variables d'environnement.

Pour une installation Docker, cree le fichier `apps/apii/.env` :

```bash
cp apps/apii/.env.docker.example apps/apii/.env
```

Puis adapte les valeurs.

Exemple minimal :

```env
PGDATABASE=papyrus
PGUSER=papyrus
PGPASSWORD=change-moi
DBHOST=localhost
PGPORT=5432

JWT_SECRET=change-moi-avec-une-valeur-longue
JWT_EXPIRES_IN=7d

AWS_REGION=eu-west-3
AWS_ACCESS_KEY=access-key
AWS_SECRET_KEY=secret-key
AWS_BUCKET=papyrus-project

PGADMIN_DEFAULT_EMAIL=admin@papyrus.local
PGADMIN_DEFAULT_PASSWORD=change-moi
```

Variables importantes :

| Variable | Role |
| --- | --- |
| `DBHOST` | Hote PostgreSQL. En Docker, il est defini automatiquement a `postgres`. |
| `PGPORT` | Port PostgreSQL. |
| `PGDATABASE` | Nom de la base. |
| `PGUSER` | Utilisateur PostgreSQL. |
| `PGPASSWORD` | Mot de passe PostgreSQL. |
| `JWT_SECRET` | Secret utilise pour signer les tokens. |
| `JWT_EXPIRES_IN` | Duree de validite du token, par exemple `7d`. |
| `AWS_REGION` | Region S3. |
| `AWS_ACCESS_KEY` | Cle d'acces S3. |
| `AWS_SECRET_KEY` | Cle secrete S3. |
| `AWS_BUCKET` | Nom du bucket S3. |
| `DB_SCHEMA_MODE` | Mode schema au demarrage Docker : `migrate`, `sync` ou `none`. |

> Attention : le `docker-compose.yaml` utilise `AWS_ACCESS_KEY`, `AWS_SECRET_KEY` et `AWS_BUCKET`.

## Lancer le projet en developpement

### Option recommandee : lancer l'API avec Docker

Le fichier `apps/apii/docker-compose.yaml` lance deja l'API, PostgreSQL et pgAdmin. C'est donc la facon la plus simple de demarrer le back complet :

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env up -d --build
```

Services disponibles :

- API : `http://localhost:3000`
- PostgreSQL : `localhost:5432`
- pgAdmin : `http://localhost:5050`

Dans ce mode, il ne faut pas lancer `yarn nx run apii:serve` en plus, sinon tu risques d'avoir deux API qui essaient d'utiliser le meme port ou deux configurations de base differentes.

Tu peux suivre les logs de l'API avec :

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env logs -f api
```

### Build du package partage

Avant de lancer l'application desktop ou de travailler sur les contrats partages :

```bash
yarn workspace @papyrus/source build
```

### Lancer l'application desktop

Dans un autre terminal :

```bash
yarn workspace desktop start
```

Cette commande reconstruit aussi les modules natifs Electron, notamment `better-sqlite3`.

Note : le client desktop pointe actuellement vers l'API de production dans `apps/desktop/src/utils/client/client.ts` et `apps/desktop/src/utils/client/client-file.ts`. Pour tester avec l'API Docker locale, remplace temporairement l'URL par :

```ts
http://localhost:3000
```

### Lancer le site vitrine

```bash
yarn workspace app-vitrine dev
```

Le site vitrine est lance par Vite, generalement sur :

```text
http://localhost:5173
```

ou le prochain port disponible.

### Option alternative : lancer seulement PostgreSQL en Docker

Si tu veux seulement la base de donnees et pgAdmin :

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env up -d postgres pgadmin
```

PostgreSQL est disponible sur le port `5432`.

pgAdmin est disponible sur :

```text
http://localhost:5050
```

Dans ce cas seulement, tu peux lancer l'API en local avec Nx :

```bash
yarn workspace @papyrus/source build
yarn nx run apii:build
yarn nx run apii:serve
```

Par defaut, l'API locale ecoute sur :

```text
http://localhost:3000
```

## Base de donnees et migrations

### Creer une migration

Apres modification d'une entite MikroORM :

```bash
yarn nx run apii:migration
```

### Appliquer les migrations en local

```bash
yarn nx run apii:migrate:up
```

### Appliquer les migrations dans Docker

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env exec api \
  node node_modules/@mikro-orm/cli/cli.js migration:up \
  --config dist/apps/apii/apps/apii/src/mikro-orm.config.js
```

### Verifier les migrations appliquees

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env exec postgres \
  psql -U papyrus -d papyrus
```

Puis dans `psql` :

```sql
select * from mikro_orm_migrations order by executed_at desc;
```

Adapte `papyrus` si ton `PGUSER` ou ton `PGDATABASE` est different.

## Tests et qualite

### Lancer tous les tests

```bash
yarn test
```

### Lancer les tests avec couverture

```bash
yarn test --coverage --runInBand
```

### Lancer seulement une partie

```bash
yarn test:source
yarn test:api
yarn test:desktop
```

### Typecheck

```bash
yarn typecheck
```

### Lint

```bash
yarn lint
```

## Build et application desktop

### Build API

```bash
yarn nx run apii:build
```

### Build site vitrine

```bash
yarn workspace app-vitrine build
```

### Packager l'application desktop

Pour generer une application locale :

```bash
yarn workspace desktop package
```

Pour generer un installateur ou une archive distribuable :

```bash
yarn workspace desktop make
```

Les fichiers generes sont dans :

```text
apps/desktop/out/
```

### Modules natifs Electron

L'application desktop utilise `better-sqlite3`. Ce module doit etre compile pour la version d'Electron utilisee par l'application.

La commande suivante est lancee automatiquement par `start`, `package` et `make` :

```bash
yarn workspace desktop rebuild:natives
```

Si tu vois une erreur du type `NODE_MODULE_VERSION`, relance :

```bash
yarn workspace desktop rebuild:natives
```

puis redemarre l'application.

## Deploiement Docker de l'API

### Lancer l'API et PostgreSQL en Docker

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env up -d --build
```

Services lances :

- `api` sur `http://localhost:3000`
- `postgres` sur `localhost:5432`
- `pgadmin` sur `http://localhost:5050`

### Voir les logs

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env logs -f api
```

### Redemarrer apres modification

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env build api
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env up -d
```

### Arreter les conteneurs

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env down
```

### Supprimer aussi les donnees PostgreSQL

Cette commande supprime le volume de base de donnees.

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env down -v
```

## Commandes utiles

| Action | Commande |
| --- | --- |
| Installer les dependances | `yarn install --immutable` |
| Build package partage | `yarn workspace @papyrus/source build` |
| Build API | `yarn nx run apii:build` |
| Lancer API avec Docker | `docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env up -d --build` |
| Lancer API en local, sans conteneur API | `yarn nx run apii:serve` |
| Lancer desktop | `yarn workspace desktop start` |
| Lancer vitrine | `yarn workspace app-vitrine dev` |
| Tests | `yarn test` |
| Tests desktop | `yarn test:desktop` |
| Couverture | `yarn test --coverage --runInBand` |
| Lint | `yarn lint` |
| Typecheck | `yarn typecheck` |
| Creer migration | `yarn nx run apii:migration` |
| Appliquer migrations | `yarn nx run apii:migrate:up` |
| Mettre a jour statuts objectifs | `yarn nx run apii:goal-status:update` |
| Package desktop | `yarn workspace desktop package` |
| Generer installateur desktop | `yarn workspace desktop make` |

## Depannage

### `yarn install` lance `cmdtest` ou indique `No such file or directory: install`

Sur Ubuntu/Debian, le paquet `yarn` peut installer `cmdtest`. Supprime-le et utilise Corepack :

```bash
sudo apt remove -y cmdtest yarn
corepack enable
corepack prepare yarn@4.9.2 --activate
yarn --version
```

Si `corepack` est introuvable, installe une version recente de Node.js.

### Le lockfile serait modifie avec `--immutable`

Cela veut dire que `package.json` et `yarn.lock` ne sont pas synchronises.

En local :

```bash
yarn install
```

Puis commit `yarn.lock`.

En CI, il faut garder :

```bash
yarn install --immutable
```

### Erreur `better-sqlite3` ou `NODE_MODULE_VERSION`

Le module natif SQLite a ete compile pour une autre version de Node/Electron.

```bash
yarn workspace desktop rebuild:natives
yarn workspace desktop start
```

Si l'erreur persiste :

```bash
yarn install
yarn workspace desktop rebuild:natives
```

### La base Docker n'a aucune table

Verifie que les migrations ont ete appliquees :

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env exec api \
  node node_modules/@mikro-orm/cli/cli.js migration:list \
  --config dist/apps/apii/apps/apii/src/mikro-orm.config.js
```

Puis force l'application :

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env exec api \
  node node_modules/@mikro-orm/cli/cli.js migration:up \
  --config dist/apps/apii/apps/apii/src/mikro-orm.config.js
```

### Connexion PostgreSQL : `role "root" does not exist`

La commande utilise l'utilisateur Linux par defaut. Precise l'utilisateur et la base :

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env exec postgres \
  psql -U papyrus -d papyrus
```

Remplace `papyrus` par les valeurs de `PGUSER` et `PGDATABASE`.

### Nettoyer le cache Nx

```bash
yarn nx reset
```

### Reinstallation propre

```bash
yarn nx reset
yarn install
```

## Documentation complementaire

- `docs/PROTOCOLE_CI.md`
- `docs/PROTOCOLE_DEPLOIEMENT.md`
- `docs/SECURITE_ACCESSIBILITE.md`
- `docs/tests.md`
- `docs/mindmaps-user-guide.md`
