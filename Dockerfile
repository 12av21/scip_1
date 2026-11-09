# SCIP Production Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package configurations
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build production assets
RUN npm run build

# Runner stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application and required assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/metadata.json ./metadata.json

# Persistent data directory
VOLUME [ "/app/data" ]

EXPOSE 3000

CMD ["node", "server.ts"]
