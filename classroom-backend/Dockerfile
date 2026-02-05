# syntax=docker/dockerfile:1.7

########################
# Build
########################
FROM node:18-slim AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build


########################
# Runtime
########################
FROM node:18-slim
WORKDIR /app

RUN npm install -g pnpm
RUN useradd -m appuser

COPY --chown=appuser:appuser package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --prod --frozen-lockfile

COPY --chown=appuser:appuser --from=builder /app/dist ./dist
COPY --chown=appuser:appuser --from=builder /app/drizzle ./drizzle
COPY --chown=appuser:appuser --from=builder /app/drizzle.config.ts .

USER appuser
EXPOSE 8000
CMD ["node", "dist/index.js"]
