FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /build
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /build
COPY --from=deps /build/node_modules ./node_modules
COPY . .
RUN npm run lint && npm run build

# Run
FROM base AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static
COPY ./public ./public
RUN chown -R nextjs:nodejs ./

USER nextjs

EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME 0.0.0.0

CMD ["node", "server.js"]