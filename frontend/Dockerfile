FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the frontend code
COPY . .

# Expose port and run dev server
EXPOSE 3000
CMD ["npm", "run", "dev"]
