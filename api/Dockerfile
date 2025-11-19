FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package.json   pnpm-lock.yaml ./

# Install dependencies
RUN bun install

# Copy the rest of the API code
COPY / ./

# Build the application
RUN bun run build

# Expose the port
EXPOSE 4435

# Start the server
CMD ["node", "dist/server.js"]
