#!/bin/bash
set -e

# Find the JAR file (Spring Boot creates a JAR with the project name)
JAR_FILE=$(find build/libs -name "*.jar" -not -name "*-plain.jar" | head -n 1)

if [ -z "$JAR_FILE" ]; then
  echo "Error: JAR file not found in build/libs/"
  echo "Current directory: $(pwd)"
  echo "Listing build/libs contents:"
  ls -la build/libs/ || echo "build/libs directory does not exist"
  exit 1
fi

echo "Starting application with JAR: $JAR_FILE"
echo "Using PORT: $PORT"
exec java -Dserver.port=${PORT:-8080} -jar "$JAR_FILE"

