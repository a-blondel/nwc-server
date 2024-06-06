# Use the patched Node.js image as base
FROM ghcr.io/a-blondel/nwc-server/node-sslv3-rc4:latest

# Install libstdc++ and libgcc
RUN apk add --no-cache libstdc++ libgcc

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy specific files and directories
COPY app.js .
COPY controllers controllers
COPY utils utils

# Create an empty directory to store certificates
RUN mkdir certs

# Expose port 80 for HTTP traffic
EXPOSE 80
# Expose port 443 for HTTPS traffic
EXPOSE 443

# Start the application
#CMD ["app.js", "--mode=http"]

# Override ENTRYPOINT to use npm
ENTRYPOINT ["npm", "run"]
CMD ["start-http"]