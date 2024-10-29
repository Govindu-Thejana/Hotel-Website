# Dockerfile for backend
FROM node:20

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose API port
EXPOSE 8000
CMD ["npm", "start"]
