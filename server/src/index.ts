import { createServer } from "node:http";
import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { connectDb } from "./db/connection.js";
import { Device } from "./db/models/Device.js";
import { deviceRouter } from "./routes/device.js";
import { historyRouter } from "./routes/history.js";
import { initSocket } from "./realtime/socket.js";
import { startPoller } from "./realtime/poller.js";
import { loadSchedules } from "./scheduler/index.js";

async function main() {
  await connectDb();

  const app = express();
  app.use(cors({ origin: config.clientOrigin }));
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api/device", deviceRouter);
  app.use("/api/history", historyRouter);

  const server = createServer(app);
  initSocket(server);

  // Garante que existe um aparelho cadastrado (por enquanto, um so)
  const device = await Device.findOneAndUpdate(
    { ip: "192.168.15.4" },
    { $setOnInsert: { name: "Ar da sala" } },
    { upsert: true, new: true }
  );
  startPoller(String(device._id));
  await loadSchedules();

  server.listen(config.port, () => console.log(`API em http://localhost:${config.port}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
