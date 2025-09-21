#!/bin/bash
echo "Starting Agent Marketplace Server..."
uvicorn backend.app:app --host 0.0.0.0 --port 8080 --reload