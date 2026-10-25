import { Router } from "express";
import { z } from "zod";
import { deviceService } from "../services/deviceService.js";
import { broadcast } from "../realtime/socket.js";
import { Device } from "../db/models/Device.js";

export const deviceRouter = Router();

const controlSchema = z.object({
  power: z.boolean().optional(),
  mode: z.enum(["auto", "cool", "dry", "heat", "fan_only"]).optional(),
  targetTemp: z.number().min(16).max(30).optional(),
  fan: z.number().int().min(1).max(102).optional(),
  swing: z.enum(["off", "vertical", "horizontal", "both"]).optional(),
  turbo: z.boolean().optional(),
  silent: z.boolean().optional(),
  eco: z.boolean().optional(),
  sleep: z.boolean().optional(),
  display: z.boolean().optional(),
});

deviceRouter.get("/info", async (_req, res) => {
  const d = await Device.findOne();
  res.json({ name: d?.name ?? "Ar-condicionado", ip: d?.ip ?? "" });
});

deviceRouter.get("/state", async (_req, res) => {
  try {
    res.json(await deviceService.getState());
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
});

deviceRouter.get("/capabilities", async (_req, res) => {
  try {
    res.json(await deviceService.getCapabilities());
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
});

deviceRouter.post("/control", async (req, res) => {
  const parsed = controlSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  try {
    const state = await deviceService.control(parsed.data);
    broadcast({ type: "state", data: state });
    res.json(state);
  } catch (e) {
    res.status(502).json({ error: (e as Error).message });
  }
});
