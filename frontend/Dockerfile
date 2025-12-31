# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Build the app
RUN npm run build

# Expose port (Railway will set PORT env variable)
EXPOSE 4173

# Start static file server
CMD ["npm", "start"]
