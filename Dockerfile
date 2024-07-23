# Use the official Node.js image as the base image
FROM docker.arvancloud.ir/node:22-alpine3.19

# Set the working directory in the container
WORKDIR /app

# Set env variables 
ENV REACT_APP_API_URL='http://localhost:4000/api'
ENV HOSTNAME='Dana-monitor-frontend'
# Copy package.json and package-lock.json to the container
COPY package*.json  ./

# # Install npm
# RUN apk add --update nodejs npm

# Install dependencies 
RUN npm install

# Copy the entire app to the container
COPY . /app/ 

# Build the React app 
RUN npm run build

# Expose the port on which the app will run 
EXPOSE 3000

# Start the React app
CMD [ "npm","start" ]


