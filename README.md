# MultiAgent-Quickstart2

> 🏆 Project submission for the [Internet of Agents Hackathon](https://lablab.ai/event/internet-of-agents) on lablab.ai

A comprehensive agent marketplace platform that integrates with the Coral Protocol, providing a scalable infrastructure for AI agents. This project aims to demonstrate the power of agent-based systems and their ability to collaborate and interact in a decentralized marketplace environment.

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
│   ├── agents/         # Agent definitions and configurations
│   ├── templates/      # HTML templates
│   ├── app.py         # Main FastAPI application
│   ├── agent_marketplace.py    # Agent marketplace implementation
│   └── coral_integration.py    # Coral Protocol integration
└── README.md
```

## 🔍 API Endpoints

- `/`: Home page
- `/agents`: List all available agents
- `/health`: System health check
- Additional endpoints documented in the API

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