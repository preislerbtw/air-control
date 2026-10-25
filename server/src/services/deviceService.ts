import { config } from "../config.js";

export type DeviceState = {
  online: boolean;
  power: boolean;
  mode: string;
  targetTemp: number;
  indoorTemp: number | null;
  outdoorTemp: number | null;
  fan: number;
  swing: string;
  turbo: boolean;
  silent: boolean;
  eco: boolean;
  sleep: boolean;
  display: boolean;
};

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${config.deviceServiceUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`device-service ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export const deviceService = {
  getState: () => call<DeviceState>("/state"),
  getCapabilities: () => call<Record<string, unknown>>("/capabilities"),
  control: (patch: Partial<DeviceState>) =>
    call<DeviceState>("/control", { method: "POST", body: JSON.stringify(patch) }),
};
