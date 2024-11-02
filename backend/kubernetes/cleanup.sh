#!/bin/bash

# Variables
DOCKER_USERNAME="your_docker_username"
NAMESPACE="g55"
IMAGE_NAMES=("user_service" "question_service" "matching_service" "mongodb")

# Clean up Kubernetes resources
kubectl delete all --all -n $NAMESPACE
kubectl delete namespace $NAMESPACE

# Stop and delete Minikube cluster
minikube stop
minikube delete

# Remove Docker images
for IMAGE_NAME in "${IMAGE_NAMES[@]}"
do
  docker rmi $DOCKER_USERNAME/$IMAGE_NAME
done

echo "Cleanup completed."
