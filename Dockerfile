# 1) Base
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_OPTIONS="--max-old-space-size=4096 --no-warnings"
ENV NODE_NO_WARNINGS=1

# 2) Deps
FROM base AS deps
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci

ARG NODE_ENV=production
COPY .env .env

# 3) Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV TZ=Asia/Bangkok
RUN npm run build

# 4) Runner
FROM node:18-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat 
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

ENV NODE_ENV=production
ENV PORT=8080 HOST=0.0.0.0

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080
CMD ["node", "server.js"]
