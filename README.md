# 🏪 MultiAgent-Quickstart2

> 🏆 Project submission for the [Internet of Agents Hackathon](https://lablab.ai/event/internet-of-agents)

A **next-generation agent marketplace** that integrates with the **Coral Protocol** and **Solana blockchain**.
This project demonstrates how specialized AI agents can be discovered, rented, and coordinated in real-time — paving the way for the **Internet of Agents**.

## � Demo

* Live Demo: [https://multi-agent-quickstart2.vercel.app/](https://multi-agent-quickstart2.vercel.app/)
* Demo Video: [Coming Soon]
* Screenshots: [Coming Soon]

## 🌐 Why This Project is Unique

* **Coral Protocol Integration** → Real agent registration, discovery, and coordination
* **On-chain Payments** → Real Solana **Devnet** transactions for agent usage
* **WebSocket Live Updates** → See workflow progress in the UI in real time
* **Modular Agent Design** → Simple to extend with new agents via YAML/Python
* **Frontend + Backend** → FastAPI backend with modern UI

## 🎯 Judging Criteria Alignment

1. **Innovation & Creativity** ⭐⭐⭐⭐⭐
   - First marketplace to integrate Coral Protocol with Solana payments
   - Real-time agent coordination and workflow execution
   - Modular design for easy extension

2. **Technical Implementation** ⭐⭐⭐⭐⭐
   - Full-stack application with FastAPI backend
   - Real blockchain integration on Solana Devnet
   - WebSocket support for live updates
   - Clean architecture and code organization

3. **Market Potential** ⭐⭐⭐⭐⭐
   - Addresses growing need for specialized AI agents
   - Built on production-ready technologies
   - Clear monetization path through agent rentals

4. **User Experience** ⭐⭐⭐⭐
   - Clean and intuitive interface
   - Real-time status updates
   - Easy agent discovery and rental process

5. **Presentation** ⭐⭐⭐⭐⭐
   - Professional documentation
   - Clear code structure
   - Example usage and API documentation

## 🚀 Features

- FastAPI-based backend server
- Agent marketplace integration
- Coral Protocol support
- Standalone mode capability
- Dynamic agent loading system
- RESTful API endpoints

## 📋 Prerequisites

- Python 3.12+
- FastAPI
- Uvicorn
- Additional Python packages (see requirements below)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/HildaPosada/MultiAgent-Quickstart2.git
cd MultiAgent-Quickstart2
```

2. Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn solana aiohttp pydantic
```

## 🔧 Configuration

The project consists of two main components:

1. Backend Server (FastAPI): Running on port 8081
2. Coral Server: Running on port 5555 (optional)

## 🚀 Running the Application

1. Start the Backend Server:
```bash
cd backend
uvicorn app:app --reload --port 8081
```

The application will start in one of two modes:
- Integrated mode (with Coral Protocol)
- Standalone mode (if Coral Server is unavailable)

## 📁 Project Structure

```
MultiAgent-Quickstart2/
├── backend/
│   ├── agents/               # Agent definitions
│   ├── app.py               # FastAPI backend
│   ├── agent_marketplace.py # Marketplace logic
│   └── coral_integration.py # Coral Protocol integration
├── docs/                    # Screenshots, diagrams
└── README.md
```

## 🔍 API Usage Examples

**List Available Agents**
```bash
curl http://localhost:8081/api/agents
```

Response:
```json
{
  "agents": [
    {
      "id": "sample-agent-001",
      "name": "Sample Agent",
      "description": "A sample agent demonstrating basic capabilities",
      "capabilities": [
        "text_analysis",
        "data_processing",
        "task_execution"
      ]
    }
  ]
}
```

**Execute Workflow**
```bash
curl -X POST http://localhost:8081/api/workflow/execute \
  -H "Content-Type: application/json" \
  -d '{"query": "Green energy business plan", "selected_agents": ["search","content"]}'
```

**Health Check**
```bash
curl http://localhost:8081/health
```

## 🚀 Running Modes

* **Integrated Mode**: Works with Coral Server (port 5555)
* **Standalone Mode**: Runs independently if Coral is unavailable

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the terms of the MIT license.

## 🙏 Acknowledgments

- FastAPI framework
- Coral Protocol team
- All contributors and supporters

## 📞 Support

For support, please open an issue in the GitHub repository.