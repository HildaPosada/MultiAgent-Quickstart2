import type { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer | null = null;

export function setupWebSocket(httpServer: HTTPServer) {
  if (wss) return wss;

  const server = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (request: any, socket, head) => {
    const url = request.url as string | undefined;
    if (!url || !url.startsWith("/ws/updates")) {
      return;
    }
    server.handleUpgrade(request, socket, head, (ws) => {
      server.emit("connection", ws, request);
    });
  });

  server.on("connection", (ws: WebSocket) => {
    try {
      ws.send("✅ Connected to live updates server");
    } catch {}
  });

  wss = server;
  return server;
}

export function broadcastUpdate(message: string) {
  if (!wss) return;
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      try {
        client.send(message);
      } catch {}
    }
  }
}
