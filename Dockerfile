# Saathi container for Google Cloud Run.
# Built by Cloud Build (gcloud run deploy --source .), no local Docker needed.

FROM node:22-slim AS base
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# 1. Install dependencies (also runs `prisma generate` via postinstall)
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# 2. Build the Next.js app
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Small runtime image
FROM base AS run
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=8080 HOSTNAME=0.0.0.0
# Prisma CLI, only to apply database migrations at startup
RUN npm install -g prisma@6.19.3 && npm cache clean --force
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
USER node
EXPOSE 8080
# Apply any pending migrations, then start the server.
CMD ["sh", "-c", "prisma migrate deploy && node server.js"]
