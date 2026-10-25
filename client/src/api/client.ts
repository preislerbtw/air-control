export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type DeviceState = {
  online: boolean;
  power: boolean;
  mode: string;
  targetTemp: number;
  indoorTemp: number | null;
  outdoorTemp: number | null;
  fan: number; // 1-100 (%), 102 = auto
  swing: string;
  turbo: boolean;
  silent: boolean;
  eco: boolean;
  sleep: boolean;
  display: boolean;
};

export type Capabilities = {
  modes: string[];
  turbo: boolean;
  silent: boolean;
  eco: boolean;
  display: boolean;
  customFan: boolean;
  minTemp: number;
  maxTemp: number;
};

export type DeviceInfo = { name: string; ip: string };

export async function sendControl(patch: Partial<DeviceState>): Promise<DeviceState> {
  const res = await fetch(`${API_URL}/api/device/control`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Falha ao enviar comando");
  return res.json();
}

export async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}
