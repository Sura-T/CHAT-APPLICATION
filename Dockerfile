# Multi-stage build for production deployment
# Pin specific Node.js version (no :latest)
FROM node:20.12.2-alpine3.19 AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./
COPY frontend/package.json frontend/package-lock.json* ./frontend/

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && \
    cd frontend && npm ci

# Copy application source code
COPY . .

# Build the frontend
RUN npm run build --prefix frontend

# Production stage - smaller final image
FROM node:20.12.2-alpine3.19

# Install security updates only (no unnecessary packages)
RUN apk update && \
    apk upgrade --no-cache && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy backend code and built frontend from builder stage
COPY --chown=nodejs:nodejs backend ./backend
COPY --chown=nodejs:nodejs --from=builder /app/frontend/dist ./frontend/dist
COPY --chown=nodejs:nodejs patches ./patches

# Run postinstall for patch-package
RUN npm run postinstall || true

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Set production environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start the application
CMD ["node", "backend/server.js"]
