# Build stage
FROM node:24.0-alpine

WORKDIR /usr/app/frontend

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
# Angular 20 app with default prod build
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]