import cron from "node-cron";
import { Schedule } from "../db/models/Schedule.js";
import { deviceService } from "../services/deviceService.js";

const tasks = new Map<string, cron.ScheduledTask>();

// Le os agendamentos do MongoDB e registra um cron para cada um.
export async function loadSchedules() {
  for (const t of tasks.values()) t.stop();
  tasks.clear();

  const schedules = await Schedule.find({ enabled: true });
  for (const s of schedules) {
    if (!cron.validate(s.cron)) continue;
    const task = cron.schedule(s.cron, async () => {
      try {
        await deviceService.control(s.action as Record<string, never>);
        console.log(`Agendamento executado: ${s.name}`);
      } catch (e) {
        console.error(`Falha no agendamento ${s.name}:`, (e as Error).message);
      }
    });
    tasks.set(String(s._id), task);
  }
  console.log(`${tasks.size} agendamento(s) ativo(s)`);
}
