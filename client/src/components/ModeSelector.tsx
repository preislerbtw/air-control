const MODES = [
  { id: "auto", label: "Auto" },
  { id: "cool", label: "Frio" },
  { id: "dry", label: "Seco" },
  { id: "fan_only", label: "Ventilar" },
  { id: "heat", label: "Quente" },
];

type Props = { value: string; onChange: (mode: string) => void };

export function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`rounded-lg py-3 text-sm transition ${
            value === m.id ? "bg-sky-400 text-slate-900" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
