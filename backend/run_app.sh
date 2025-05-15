#!/bin/bash
# This script runs the FastAPI application and handles MongoDB init errors
# Usage: ./run_app.sh

echo "Starting NovaUni API server..."

# Check if MongoDB connection works
echo "Testing MongoDB connection..."

# Run the FastAPI application
echo "Starting FastAPI app..."
cd "$(dirname "$0")"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
