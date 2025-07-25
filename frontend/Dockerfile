# Stage 1: Build the React application
# We use the official Node.js 20 LTS image as a builder.
FROM node:20-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's layer caching.
# This step only re-runs if these files change.
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Build the application for production. The output will be in the /app/dist directory.
RUN npm run build

# Stage 2: Serve the application with Nginx
# We use a lightweight Nginx image for the production environment.
FROM nginx:stable-alpine

# Copy the static build assets from the 'build' stage to the Nginx HTML directory.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to allow incoming traffic to the Nginx server.
EXPOSE 80

# The default command for the nginx image is to start the server.
# This command keeps Nginx running in the foreground.
CMD ["nginx", "-g", "daemon off;"]