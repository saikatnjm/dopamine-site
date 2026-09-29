# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# base: shared Node runtime
# ---------------------------------------------------------------------------
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------------------------------------------------------------------------
# deps: install dependencies (uses the lockfile when present)
# ---------------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# ---------------------------------------------------------------------------
# dev: hot-reload development server. Source is bind-mounted by compose;
# node_modules and .next live in named volumes, never on the host.
# ---------------------------------------------------------------------------
FROM base AS dev
RUN mkdir -p node_modules .next && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["sh", "-c", "npm install && npm run dev -- --hostname 0.0.0.0 --port 3000"]

# ---------------------------------------------------------------------------
# builder: production build
# NEXT_PUBLIC_* values are inlined at build time, so they are build args.
# ---------------------------------------------------------------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_GA_ID=
ARG NEXT_PUBLIC_CONTACT_EMAIL=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL
RUN npm run build

# ---------------------------------------------------------------------------
# runner: minimal production image (Next.js standalone output, non-root)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["node", "server.js"]
