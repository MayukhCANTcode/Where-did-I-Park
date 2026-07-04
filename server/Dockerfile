# ============================================
# ParkPal — Backend Dockerfile
# ============================================
# Multi-stage: development + production
# ============================================

# ---------- Stage 1: Development ----------

FROM node:22-alpine AS development

# Set working directory inside the container
WORKDIR /app

# Copy root package files first (server deps live in root package.json)
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy server source code
COPY server/ ./server/

# Expose Express port
EXPOSE 5000

# Set working directory to server folder so dotenv finds server/.env
WORKDIR /app/server

# Start the backend
CMD ["node", "server.js"]


# ---------- Stage 2: Production ----------

FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy server source code
COPY server/ ./server/

# Expose Express port
EXPOSE 5000

# Set working directory to server folder so dotenv finds server/.env
WORKDIR /app/server

# Start the backend
CMD ["node", "server.js"]
