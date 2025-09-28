#!/bin/bash

# Array of your service directories
services=("auth-service" "attendance-service" "api-gateway" "employee-service")

echo "Installing frontend dependencies"

cd frontend
npm i
cd ..

cd microservices
# Loop through each service
for service in "${services[@]}"; do
  echo "Installing dependencies for $service..."
  cd "$service" || { echo "Failed to cd into $service"; exit 1; }
  npm install
  cd ..
done

echo "All dependencies installed!"
