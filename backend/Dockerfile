FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /backend/


COPY public/ /backend/public



# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g nodemon
COPY app.js connection.js ./


EXPOSE 3001
# Command to start the web server
CMD ["npm", "start"]
