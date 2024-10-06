# Use a Node 22 image as the base, can use 22-alpine if needed for smaller size
FROM node:22

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml into the working directory
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the frontend source code
COPY . .

# Expose port 5173
EXPOSE 5173

# Start the frontend server
CMD ["pnpm", "run", "dev", "--host"]