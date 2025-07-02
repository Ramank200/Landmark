# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 5000

# Set environment variable for production
ENV NODE_ENV=production

# Start the app
CMD ["node", "src/app.js"]
