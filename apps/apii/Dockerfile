FROM node:22-bookworm-slim AS base

WORKDIR /app
ENV YARN_ENABLE_TELEMETRY=0
ENV NX_DAEMON=false

RUN corepack enable

FROM base AS dependencies

COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/desktop/package.json ./apps/desktop/package.json
COPY packages/source/package.json ./packages/source/package.json
RUN yarn install --immutable

FROM dependencies AS builder

COPY . .
RUN yarn workspace @papyrus/source build
RUN yarn nx run apii:build

FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=dependencies /app/node_modules ./node_modules
RUN rm -rf node_modules/@papyrus/source && mkdir -p node_modules/@papyrus/source exports

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json
COPY --from=builder /app/apps/apii/tsconfig.json ./apps/apii/tsconfig.json
COPY --from=builder /app/apps/apii/tsconfig.app.json ./apps/apii/tsconfig.app.json
COPY --from=builder /app/packages/source/package.json ./node_modules/@papyrus/source/package.json
COPY --from=builder /app/packages/source/dist ./node_modules/@papyrus/source/dist
COPY apps/apii/docker-entrypoint.sh ./apps/apii/docker-entrypoint.sh

RUN mkdir -p ./apps/apii/src/migrations && chmod +x ./apps/apii/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./apps/apii/docker-entrypoint.sh"]
CMD ["node", "dist/apps/apii/apps/apii/src/main.js"]
