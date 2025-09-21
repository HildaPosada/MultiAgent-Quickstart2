import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getAgents } from "./routes/agents";
import { executeWorkflow } from "./routes/workflow";
import { registerAuth } from "./auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Auth
  registerAuth(app);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Marketplace APIs
  app.get("/api/agents", getAgents);
  app.post("/api/workflow/execute", executeWorkflow);

  return app;
}
