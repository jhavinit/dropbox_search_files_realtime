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

# Make your script executable (if necessary)
RUN chmod +x ./start.sh

# Run the script file instead of npm start
CMD ["./start.sh"]
