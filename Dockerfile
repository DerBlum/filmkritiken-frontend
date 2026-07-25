# Stage 1: Build
FROM node:26-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

RUN npm ci

# Copy source
COPY ./ ./

# Build Vue app (Vite → dist/)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.31-alpine AS serve

# Copy built Vue app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
