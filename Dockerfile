# Use Bun's official image as base
FROM oven/bun:1 AS base
WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (no lockfile needed)
RUN bun install

# Copy source code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5000
ENV ORIGIN=*

# Run the app
USER bun
CMD ["bun", "run", "index.js"]