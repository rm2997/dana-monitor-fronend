# Use the official Node.js image as the base image
FROM nginx:1.21.6

# Set the working directory in the container
WORKDIR  /usr/share/nginx/html

# Copy /build folder to container

COPY ./build ./

# Expose the port Nginx is listening on port 80(default)
EXPOSE 80

# Start Nginx
CMD [ "nginx","-g","daemon off;" ]

