# Use Node.js official LTS image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Install git and clone the repository
RUN apt-get update && apt-get install -y git && \
    git clone https://github.com/Ramank200/Landmark.git && \
    rm -rf Landmark/.git

# Set working directory to the backend subfolder where package.json exists
WORKDIR /usr/src/app/Landmark/backend

# Install dependencies
RUN npm install

ENV PORT=5000
ENV MONGO_URI=mongodb+srv://Ramanakablah:Raman1311@cluster0.uzijl.mongodb.net/Ecomm?retryWrites=true&w=majority&appName=Cluster0
ENV JWT_SECRET=kettyPerry999666333

# Expose the app port (adjust if needed)
EXPOSE 50000

# Start the application
CMD ["node", "./src/app.js"]