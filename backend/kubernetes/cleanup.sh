#!/bin/bash

# Variables
DOCKER_USERNAME="your_docker_username"
NAMESPACE="g55"
IMAGE_NAMES=("user_service" "question_service" "matching_service" "mongodb" "room_service" "history_service")

# Clean up Kubernetes resources
kubectl patch pvc postgres-data-userdb-0 -n g55 -p '{"metadata":{"finalizers":null}}'
kubectl delete all --all -n $NAMESPACE
kubectl delete namespace $NAMESPACE

# Stop and delete Minikube cluster
minikube stop
minikube delete

# Revert all changes for docker image naming
for yaml_file in *.yaml; do
  sed -i '' "s/$DOCKER_USERNAME/docker_username/g" "$yaml_file"
done

# Remove Docker images
for IMAGE_NAME in "${IMAGE_NAMES[@]}"
do
  docker rmi $DOCKER_USERNAME/$IMAGE_NAME
done

echo "Cleanup completed."
