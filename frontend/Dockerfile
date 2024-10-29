# Frontend Dockerfile
FROM node:20 AS build

WORKDIR /app

# Copy package files from the current directory
COPY package*.json ./

# Install dependencies and build frontend
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Serve the static files
FROM node:20
RUN npm install -g serve

# Copy from the correct build output directory
COPY --from=build /app/dist /app/build

EXPOSE 5173
CMD ["serve", "-s", "/app/build", "-l", "5173"]