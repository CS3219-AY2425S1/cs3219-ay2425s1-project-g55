#!/bin/bash

# Variables
DOCKER_USERNAME="your_docker_username"
NAMESPACE="g55"
SERVICE_NAMES=("service-user" "service-question" "service-matching" "mongoDB" "service-room" "service-history")
IMAGE_NAMES=("user_service" "question_service" "matching_service" "mongodb" "room_service" "history_service")

# Start Minikube
minikube start

# Create Kubernetes namespace
kubectl create namespace $NAMESPACE

# Enable Ingress addon in Minikube
minikube addons enable ingress

# Build Docker images for each service
cd ..
for i in "${!IMAGE_NAMES[@]}"
do
  cd ${SERVICE_NAMES[$i]}
  docker build -t $DOCKER_USERNAME/${IMAGE_NAMES[$i]} .
  cd ..
done

cd service-user
kubectl create configmap userdb-seed-config --from-file=./seed/init.sql -n g55
cd ..

# Push all images to Docker Hub
for IMAGE_NAME in "${IMAGE_NAMES[@]}"
do
  docker push $DOCKER_USERNAME/$IMAGE_NAME
done

# Move to Kubernetes configuration folder
cd ./kubernetes

for yaml_file in *.yaml; do
  sed -i '' "s/docker_username/$DOCKER_USERNAME/g" "$yaml_file"
done

# Apply Kubernetes configurations
kubectl apply -f . -n $NAMESPACE

# Port-forward Ingress-Nginx service (keep terminal open)
echo "Open a terminal and run: kubectl port-forward --namespace ingress-nginx service/ingress-nginx-controller 8080:80 "

echo "Port forwarding is running in the background. Do not close this terminal."

# Function to check individual service logs
echo "To check service logs, use: kubectl logs <service_name> -n $NAMESPACE"

echo "Script executed successfully."
