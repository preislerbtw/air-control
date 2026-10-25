import { ArrowUpDown, Leaf, Lightbulb, Moon, VolumeX, Zap, type LucideIcon } from "lucide-react";
import type { Capabilities, DeviceState } from "../api/client";

type Feature = {
  key: "turbo" | "silent" | "sleep" | "swing" | "display" | "eco";
  label: string;
  icon: LucideIcon;
  supported: (c: Capabilities | null) => boolean;
};

const FEATURES: Feature[] = [
  { key: "turbo", label: "Turbo", icon: Zap, supported: (c) => c?.turbo ?? true },
  { key: "silent", label: "Silêncio", icon: VolumeX, supported: (c) => c?.silent ?? true },
  { key: "sleep", label: "Sleep", icon: Moon, supported: () => true },
  { key: "swing", label: "Swing", icon: ArrowUpDown, supported: () => true },
  { key: "display", label: "Luz", icon: Lightbulb, supported: (c) => c?.display ?? true },
  { key: "eco", label: "Eco", icon: Leaf, supported: (c) => c?.eco ?? true },
];

type Props = {
  state: DeviceState;
  caps: Capabilities | null;
  onToggle: (patch: Partial<DeviceState>) => void;
};

export function FeatureGrid({ state, caps, onToggle }: Props) {
  const isOn = (key: Feature["key"]) => (key === "swing" ? state.swing !== "off" : Boolean(state[key]));

  const toggle = (key: Feature["key"]) => {
    if (key === "swing") onToggle({ swing: isOn("swing") ? "off" : "vertical" });
    else onToggle({ [key]: !state[key] });
  };

  return (
    <section className="space-y-2">
      <h2 className="text-sm text-white/60">Recursos</h2>
      <div className="grid grid-cols-3 gap-2">
        {FEATURES.filter((f) => f.supported(caps)).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-sm transition ${
              isOn(key)
                ? "border-transparent bg-[#5cc8ff] font-medium text-slate-900"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
