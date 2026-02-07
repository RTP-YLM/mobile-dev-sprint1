# Multi-stage Dockerfile for Node.js Backend
# Optimized for production with minimal image size

# ============================================
# Stage 1: Base - Common dependencies
# ============================================
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    dumb-init \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# ============================================
# Stage 2: Dependencies - Install all deps
# ============================================
FROM base AS dependencies

# Install all dependencies (including devDependencies)
RUN npm ci --include=dev

# ============================================
# Stage 3: Build - Compile TypeScript/Build assets
# ============================================
FROM dependencies AS build

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# ============================================
# Stage 4: Production - Final minimal image
# ============================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001

WORKDIR /app

# Copy production dependencies
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

# Copy any required static files
COPY --chown=nodejs:nodejs public ./public

# Switch to non-root user
USER nodejs

# Environment variables
ENV NODE_ENV=production \
    PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/main.js"]
