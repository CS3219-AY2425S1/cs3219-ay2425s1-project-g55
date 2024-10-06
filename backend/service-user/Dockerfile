# Use an OpenJDK 21 image as the base
FROM maven:3-eclipse-temurin-21 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the Maven project files
COPY pom.xml .
COPY src ./src

# Install dependencies and build the project
RUN mvn clean package -DskipTests

# Run stage
FROM maven:3-eclipse-temurin-21

WORKDIR /app

# Copy the built JAR file
COPY --from=build /app/target/*.jar app.jar

# Expose port 8081 for the backend service
EXPOSE 8081

# Run the 
ENTRYPOINT ["java", "-jar", "app.jar"]
