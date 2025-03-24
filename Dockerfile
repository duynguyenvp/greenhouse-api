# Stage 1: Build TypeScript
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code
COPY . .

# Build the project (transpile TypeScript to JavaScript)
RUN npm run build

# Stage 2: Run the application
FROM node:18-slim

# Set working directory
WORKDIR /app

# Only copy needed files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install --only=production

# Start the app
CMD ["node", "dist/index.js"]
