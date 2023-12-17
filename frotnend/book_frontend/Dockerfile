
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /frontend/


COPY public/ /frontend/public
COPY src/ /frontend/src


# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

EXPOSE 3000
# Command to start the web server
CMD ["npm", "start"]
