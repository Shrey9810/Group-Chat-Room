# Dockerfile for the server
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the server runs on (adjust if needed)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
