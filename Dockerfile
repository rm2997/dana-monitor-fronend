# Use the official Node.js image as the base image
FROM docker.arvancloud.ir/node:22-alpine3.19 AS my-build

# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package*.json  ./

# Install dependencies 
RUN npm install 

# Copy the entire app to the container
COPY . ./

# Build the React app 
RUN npm run build

# Use Nginx as the web server to serve the built React.js app
FROM nginx:1.21.6

#Copy the built React.js app to the Nginx default public directory
COPY --from=my-build /app/build /usr/share/nginx/html

# Expose the port Nginx is listening on port 80(default)
EXPOSE 80

# Start Nginx
CMD [ "nginx","-g","daemon off;" ]

