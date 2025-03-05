# Use a Node.js image as the base image
FROM node:18

# Install necessary libraries
RUN apt-get update && apt-get install -y \
    default-mysql-client

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Copy the prisma directory
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the required port
EXPOSE 3000

# Run the application
CMD ["sh", "-c", "npm run migrate:deploy && npm run dev"]