#!/bin/bash
# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run Spring Boot
cd SalesIncentiveSystem
./gradlew bootRun
