# Use Node base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose Vite default port
EXPOSE 5173

# Start the dev server
CMD ["npm", "run", "dev", "--", "--host"]
