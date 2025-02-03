# Use the official Bun image (change image name if needed)
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Copy package files and lock file (if you have one)
# Bun uses bun.lockb (if available) to lock dependencies.
COPY package.json bun.lock* ./

# Install dependencies using Bun
RUN bun install

# Copy the entire application code into the container
COPY . .

# Generate Prisma Client
RUN bun prisma generate

# Expose the port your Fastify server listens on
EXPOSE 3000

# Run the Fastify server using Bun
CMD ["bun", "run", "server.js"]
