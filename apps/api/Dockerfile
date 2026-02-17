FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Enable corepack for pnpm/yarn (if needed, but we use npm here)
# RUN corepack enable

# Copy root package.json and lockfile
COPY package.json package-lock.json turbo.json ./

# Copy app package.json
COPY apps/api/package.json ./apps/api/package.json
# Copy shared packages if any (none yet)
# COPY packages/ ./packages/

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build the API
WORKDIR /app
RUN npx turbo run build --filter=api...

# --- Production Stage ---
FROM node:18-alpine AS runner
WORKDIR /app

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built artifacts and necessary files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
# Copy generated prisma client (it's in root node_modules)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set env to production
ENV NODE_ENV production

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "apps/api/dist/src/main.js"]
