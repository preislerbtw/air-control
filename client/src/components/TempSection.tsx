import { useEffect, useState } from "react";
import { Minus, Plus, Thermometer } from "lucide-react";
import type { DeviceState } from "../api/client";

type Props = {
  state: DeviceState;
  min: number;
  max: number;
  onCommit: (temp: number) => void;
};

function statusLabel(s: DeviceState) {
  if (!s.power) return "Desligado";
  switch (s.mode) {
    case "cool":
      return s.indoorTemp !== null && s.indoorTemp > s.targetTemp ? "Resfriando" : "Frio";
    case "heat":
      return "Aquecendo";
    case "dry":
      return "Desumidificando";
    case "fan_only":
      return "Ventilando";
    default:
      return "Automático";
  }
}

export function TempSection({ state, min, max, onCommit }: Props) {
  const [temp, setTemp] = useState(state.targetTemp);

  // sincroniza quando o aparelho muda
  useEffect(() => setTemp(state.targetTemp), [state.targetTemp]);

  const step = (d: number) => {
    const next = Math.min(max, Math.max(min, temp + d));
    setTemp(next);
    onCommit(next);
  };
  const pct = ((temp - min) / (max - min)) * 100;

  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-start leading-none">
            <span className="text-6xl font-semibold">{temp}</span>
            <span className="mt-1 text-2xl text-white/70">°C</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-white/60">
            <Thermometer size={14} />
            {statusLabel(state)}
            {state.indoorTemp !== null && ` · ambiente ${Math.round(state.indoorTemp)}°`}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => step(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => step(1)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-white/60">
        <span>{min}°</span>
        <input
          type="range"
          className="ac-slider"
          min={min}
          max={max}
          step={1}
          value={temp}
          style={{ ["--pct" as string]: `${pct}%` }}
          onChange={(e) => setTemp(Number(e.target.value))}
          onPointerUp={() => onCommit(temp)}
          onKeyUp={() => onCommit(temp)}
        />
        <span>{max}°</span>
      </div>
    </section>
  );
}
