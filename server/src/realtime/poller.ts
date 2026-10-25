import { config } from "../config.js";
import { deviceService } from "../services/deviceService.js";
import { Reading } from "../db/models/Reading.js";
import { broadcast } from "./socket.js";

// Consulta o aparelho periodicamente, avisa os clientes e grava o historico.
export function startPoller(deviceId: string) {
  let lastSaved = 0;
  setInterval(async () => {
    try {
      const state = await deviceService.getState();
      broadcast({ type: "state", data: state });

      // Grava uma leitura por minuto
      if (Date.now() - lastSaved >= 60_000) {
        lastSaved = Date.now();
        await Reading.create({
          timestamp: new Date(),
          meta: { deviceId },
          power: state.power,
          mode: state.mode,
          targetTemp: state.targetTemp,
          indoorTemp: state.indoorTemp,
          outdoorTemp: state.outdoorTemp,
        });
      }
    } catch (e) {
      broadcast({ type: "offline", error: (e as Error).message });
    }
  }, config.pollIntervalMs);
}
