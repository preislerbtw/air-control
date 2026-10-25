import { Droplets, Fan, Snowflake, Sparkles, Sun, type LucideIcon } from "lucide-react";

const MODES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "auto", label: "Auto", icon: Sparkles },
  { id: "cool", label: "Frio", icon: Snowflake },
  { id: "dry", label: "Seco", icon: Droplets },
  { id: "fan_only", label: "Ventilar", icon: Fan },
  { id: "heat", label: "Quente", icon: Sun },
];

type Props = { value: string; supported?: string[]; onChange: (mode: string) => void };

export function ModeGrid({ value, supported, onChange }: Props) {
  const modes = supported?.length ? MODES.filter((m) => supported.includes(m.id)) : MODES;

  return (
    <section className="space-y-2">
      <h2 className="text-sm text-white/60">Modo</h2>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${modes.length}, minmax(0, 1fr))` }}>
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1.5 rounded-lg border py-3 text-xs font-medium transition ${
              value === id
                ? "border-transparent bg-[#5cc8ff] text-slate-900"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
