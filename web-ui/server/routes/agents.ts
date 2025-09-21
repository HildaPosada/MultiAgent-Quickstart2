import { RequestHandler } from "express";

export const getAgents: RequestHandler = (_req, res) => {
  const agents = [
    {
      id: "researcher",
      icon: "🔎",
      name: "Researcher Agent",
      price_sol: 0.015,
      category: "Research",
      description: "Deep web research and source gathering",
    },
    {
      id: "writer",
      icon: "✍️",
      name: "Content Writer",
      price_sol: 0.012,
      category: "Content",
      description: "Turn briefs into polished articles and posts",
    },
    {
      id: "coder",
      icon: "💻",
      name: "Code Assistant",
      price_sol: 0.02,
      category: "Development",
      description: "Generate and refactor code across stacks",
    },
    {
      id: "designer",
      icon: "🎨",
      name: "Design Critic",
      price_sol: 0.01,
      category: "Design",
      description: "Evaluate UI/UX and suggest improvements",
    },
    {
      id: "analyst",
      icon: "📈",
      name: "Data Analyst",
      price_sol: 0.018,
      category: "Analytics",
      description: "Summarize datasets and generate insights",
    },
  ];

  res.json({ agents });
};
