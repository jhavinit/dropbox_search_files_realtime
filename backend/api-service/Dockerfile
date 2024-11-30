# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# Make your script executable (if necessary)
RUN chmod +x ./start.sh

RUN apt-get update
RUN apt-get install -y iputils-ping
RUN apt-get install -y vim

# Keep the container alive
CMD ["sh", "-c", "./start.sh && while true; do sleep 1; done"]