# Protocole de déploiement

## Objectif

Déployer l'API Papyrus sur un VPS avec Docker, PostgreSQL et exécution automatique des migrations MikroORM.

## Prérequis serveur

- VPS Linux accessible en SSH.
- Docker et Docker Compose installés.
- Dépôt cloné dans le dossier défini par `VPS_APP_DIR`, par exemple `/opt/papyrus/Papyrus`.
- Fichier `apps/apii/.env` présent sur le serveur.

## Variables d'environnement API

Le fichier `apps/apii/.env` doit contenir au minimum :

```env
PGDATABASE=papyrus
PGUSER=papyrus
PGPASSWORD=change-me
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
AWS_ACCESS_KEY=change-me
AWS_SECRET_KEY=change-me
AWS_REGION=eu-west-3
AWS_BUCKET=papyrus-project
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=change-me
```

## Déploiement manuel

Depuis le serveur :

```bash
cd /opt/papyrus/Papyrus
git pull --ff-only
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env build --no-cache api
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env up -d --force-recreate api
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env exec -T api \
  node node_modules/@mikro-orm/cli/cli.js migration:up \
  --config dist/apps/apii/apps/apii/src/mikro-orm.config.js
docker image prune -f
```

## Vérifications après déploiement

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env ps
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env logs -f api
```

Vérifier les migrations :

```bash
docker compose -f apps/apii/docker-compose.yaml --env-file apps/apii/.env exec postgres \
  psql -U papyrus -d papyrus -c "select * from mikro_orm_migrations order by executed_at desc;"
```

## Retour arrière

En cas d'échec :

1. Consulter les logs API.
2. Corriger la variable d'environnement ou la migration en cause.
3. Relancer le workflow GitHub Actions ou les commandes manuelles.
4. Ne pas supprimer le volume PostgreSQL en production sans sauvegarde.

