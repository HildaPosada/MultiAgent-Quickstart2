import { RequestHandler } from "express";
import { broadcastUpdate } from "../ws";

const SOL_TO_USD = 180;

export const executeWorkflow: RequestHandler = async (req, res) => {
  const { query, selected_agents: selectedAgents } = req.body as {
    query: string;
    selected_agents: string[];
    user_wallet?: string;
  };

  if (!query || !Array.isArray(selectedAgents) || selectedAgents.length === 0) {
    return res.status(400).json({ error: "Missing query or selected agents" });
  }

  try {
    broadcastUpdate(`⏳ Received workflow: "${query.slice(0, 80)}"...`);

    // Simulate agent processing with staged updates
    const results: Record<string, any> = {};

    for (const agentId of selectedAgents) {
      broadcastUpdate(`🚀 Starting ${agentId}...`);
      await wait(400);
      broadcastUpdate(`🔧 ${agentId} is processing...`);
      await wait(600);
      const output = mockAgentOutput(agentId, query);
      results[prettyName(agentId)] = output;
      broadcastUpdate(`✅ ${agentId} completed`);
    }

    const total_cost_sol = selectedAgents
      .map((a) => PRICE_SOL[a] ?? 0.01)
      .reduce((a, b) => a + b, 0);

    const response = {
      results,
      total_cost_sol,
      total_cost_usd: total_cost_sol * SOL_TO_USD,
    };

    broadcastUpdate("🎉 Workflow finished");
    res.json(response);
  } catch (e) {
    res.status(500).json({ error: "Workflow failed" });
  }
};

const PRICE_SOL: Record<string, number> = {
  researcher: 0.015,
  writer: 0.012,
  coder: 0.02,
  designer: 0.01,
  analyst: 0.018,
};

function prettyName(id: string) {
  return (
    id.charAt(0).toUpperCase() +
    id.slice(1).replace(/[-_]/g, " ").replace(/\b(\w)/g, (m) => m.toUpperCase())
  );
}

function mockAgentOutput(agentId: string, query: string) {
  switch (agentId) {
    case "researcher":
      return {
        summary: `Key findings for: ${query}`,
        sources: [
          "https://example.com/source-1",
          "https://example.com/source-2",
          "https://example.com/source-3",
        ],
      };
    case "writer":
      return {
        title: `Draft outline for: ${query}`,
        outline: ["Intro", "Key Points", "Conclusion"],
      };
    case "coder":
      return {
        repo: "github.com/demo/project",
        notes: "Generated starter code and tests",
      };
    case "designer":
      return {
        audit: "Contrast, spacing, hierarchy improved",
        suggestions: ["Increase heading size", "Use 8px grid", "Improve contrast"],
      };
    case "analyst":
      return {
        insight: "Anomalies detected in Q2",
        chart: "bar",
      };
    default:
      return { note: `Completed: ${agentId}` };
  }
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
