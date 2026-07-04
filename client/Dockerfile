# ============================================
# ParkPal — Frontend Dockerfile
# ============================================
# Multi-stage: development + production
# ============================================

# ---------- Stage 1: Development ----------

FROM node:22-alpine AS development

# Set working directory inside the container
WORKDIR /app

# Copy package files first (Docker layer caching optimization)
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server — bind to 0.0.0.0 so it is accessible outside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# ---------- Stage 2: Production ----------

FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy all source code
COPY . .

# Build the production bundle
RUN npm run build

# Expose preview port
EXPOSE 4173

# Serve the production build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
