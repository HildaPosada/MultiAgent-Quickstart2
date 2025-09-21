#!/bin/bash
# Ensure we're in the project root directory
cd "$(dirname "$0")"
echo "Starting Agent Marketplace Server..."
# Run from root directory with proper module path
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8080 --reload