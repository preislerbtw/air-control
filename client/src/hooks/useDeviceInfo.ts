import { useEffect, useState } from "react";
import { getJson, type Capabilities, type DeviceInfo } from "../api/client";

export function useDeviceInfo() {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [caps, setCaps] = useState<Capabilities | null>(null);

  useEffect(() => {
    getJson<DeviceInfo>("/api/device/info").then(setInfo).catch(() => {});
    getJson<Capabilities>("/api/device/capabilities").then(setCaps).catch(() => {});
  }, []);

  return { info, caps };
}
