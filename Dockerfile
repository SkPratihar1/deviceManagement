# Use the official Node.js image as the base image
FROM node:18

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files

# Copy the rest of the project files into the working directory
COPY ./ ./

RUN rm -rf node_modules/

# Install project dependencies
RUN npm install

# Expose the port the app will run on
EXPOSE 4000

# Start the Node.js app
CMD ["npm", "run", "dev"]
