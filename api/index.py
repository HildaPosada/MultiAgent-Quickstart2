from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
from pathlib import Path

from vercel_fastapi import VercelFastAPI

app = FastAPI()

# Basic response for the root endpoint
@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Agent Marketplace API is running",
        "version": "2.0.0"
    }

# Vercel handler
handler = VercelFastAPI(app)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# List available agents
@app.get("/api/agents")
async def list_agents():
    return {
        "agents": [
            {
                "id": "sample-agent-001",
                "name": "Sample Agent",
                "description": "A sample agent demonstrating basic capabilities",
                "capabilities": [
                    "text_analysis",
                    "data_processing",
                    "task_execution"
                ],
                "metrics": {
                    "response_time": "< 1s",
                    "accuracy": "95%"
                }
            }
        ]
    }

# Get marketplace stats
@app.get("/api/marketplace/stats")
async def marketplace_stats():
    return {
        "total_agents": 1,
        "active_sessions": 0,
        "total_transactions": 0,
        "uptime": "100%"
    }