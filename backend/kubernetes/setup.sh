#!/bin/bash

# Variables
DOCKER_USERNAME="your_docker_username"
NAMESPACE="g55"
INGRESS_NAMESPACE="ingress-nginx"
DB_SERVICE_NAMES=("service-user" "service-room" "service-question" "service-history")
SEED_CONFIG_NAMES=("userdb-seed-config" "roomdb-seed-config" "questiondb-seed-config" "historydb-seed-config")
INIT_FILE_NAMES=("./seed/init.sql" "./seed/init.sql" "./seed/init-mongo.js" "./seed/init-mongo.js")
SERVICE_NAMES=("service-user" "service-question" "service-matching" "service-room" "service-history" "service-code-execution" "service-collaborative-editor" "service-video")
IMAGE_NAMES=("user_service" "question_service" "matching_service" "room_service" "history_service" "code_execution_service" "collaborative_editor_service" "video_service")

# Start Minikube
minikube start

# Create Kubernetes namespace
kubectl create namespace $NAMESPACE

# Enable Ingress addon in Minikube
minikube addons enable ingress
minikube addons enable metrics-server

# Build Docker images for each service
cd ..
for i in "${!IMAGE_NAMES[@]}"
do
  cd ${SERVICE_NAMES[$i]}
  docker build -t $DOCKER_USERNAME/${IMAGE_NAMES[$i]} .
  cd ..
done


for i in "${!SEED_CONFIG_NAMES[@]}"
do
  cd ${DB_SERVICE_NAMES[$i]}
  kubectl create configmap ${SEED_CONFIG_NAMES[$i]} --from-file=${INIT_FILE_NAMES[$i]} -n $NAMESPACE
  cd ..
done

# Push all images to Docker Hub
for IMAGE_NAME in "${IMAGE_NAMES[@]}"
do
  docker push $DOCKER_USERNAME/$IMAGE_NAME
done

for IMAGE_NAME in "${DB_IMAGE_NAMES[@]}"
do
  docker push $DOCKER_USERNAME/$IMAGE_NAME
done

# Move to Kubernetes configuration folder
cd ./kubernetes

for yaml_file in *.yaml; do
  sed -i '' "s/docker_username/$DOCKER_USERNAME/g" "$yaml_file"
done

echo "Apply API Gateway configuration"
kubectl apply -f ./nginx/0-nginx-config-map.yaml -n $INGRESS_NAMESPACE

echo "Applying Kubernetes configurations"
kubectl apply -f . -n $NAMESPACE

# Port-forward Ingress-Nginx service (keep terminal open)
echo "Open a terminal and run: kubectl port-forward --namespace ingress-nginx service/ingress-nginx-controller 8080:80 "

echo "Port forwarding is running in the background. Do not close this terminal."

# Function to check individual service logs
echo "To check service logs, use: kubectl logs <service_name> -n $NAMESPACE"

echo "Script executed successfully."
