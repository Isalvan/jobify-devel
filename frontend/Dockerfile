FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the frontend code
COPY . .

# Use a non-root user
RUN chown -R node:node /app
USER node

# Expose port and run dev server
EXPOSE 3000
CMD ["npm", "run", "dev"]
