import { useCallback, useEffect, useState } from "react";
import { API_URL, getJson, type DeviceState } from "../api/client";

export function useDeviceState() {
  const [state, setRawState] = useState<DeviceState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  const setState = useCallback((s: DeviceState) => {
    setRawState(s);
    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    getJson<DeviceState>("/api/device/state").then(setState).catch((e) => setError(String(e)));

    const ws = new WebSocket(API_URL.replace(/^http/, "ws") + "/ws");
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "state") {
        setState(msg.data);
        setError(null);
      }
      if (msg.type === "offline") setError(msg.error);
    };
    return () => ws.close();
  }, [setState]);

  return { state, setState, error, lastUpdate };
}
