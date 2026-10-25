import type { Server } from "node:http";
import { WebSocketServer, WebSocket } from "ws";

let wss: WebSocketServer;

export function initSocket(server: Server) {
  wss = new WebSocketServer({ server, path: "/ws" });
  wss.on("connection", () => console.log("Cliente WebSocket conectado"));
}

export function broadcast(message: unknown) {
  if (!wss) return;
  const payload = JSON.stringify(message);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(payload);
  }
}
