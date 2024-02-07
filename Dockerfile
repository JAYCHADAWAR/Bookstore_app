FROM postgres:latest

# Copy the initialization script into the Docker image
COPY init.sql /docker-entrypoint-initdb.d/init.sql
