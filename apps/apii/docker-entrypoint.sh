#!/bin/sh
set -e

SCHEMA_MODE="${DB_SCHEMA_MODE:-sync}"
ORM_CONFIG="dist/apps/apii/apps/apii/src/mikro-orm.config.js"

if [ "${RUN_MIGRATIONS:-true}" = "false" ] && [ -z "${DB_SCHEMA_MODE:-}" ]; then
  SCHEMA_MODE="none"
fi

case "$SCHEMA_MODE" in
  sync)
    node node_modules/@mikro-orm/cli/cli.js schema:update --run --safe --config "$ORM_CONFIG"
    ;;
  migrate)
    node node_modules/@mikro-orm/cli/cli.js migration:up --config "$ORM_CONFIG"
    ;;
  none)
    ;;
  *)
    echo "Invalid DB_SCHEMA_MODE: $SCHEMA_MODE. Expected sync, migrate, or none."
    exit 1
    ;;
esac

exec "$@"
