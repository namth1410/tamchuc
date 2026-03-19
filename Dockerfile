FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package config first for caching
COPY package.json package-lock.json* ./
RUN npm ci

# Copy entire project
COPY . .

# Build Vite frontend to /dist folder
RUN npm run build

# Expose backend port
EXPOSE 3000

# Start Express server (Which now also serves /dist UI)
CMD ["node", "server.js"]
