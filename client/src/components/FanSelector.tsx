const AUTO = 102;
const LEVELS = [20, 40, 60, 80, 100]; // níveis 1 a 5 (% da velocidade)

type Props = { value: number; onChange: (fan: number) => void };

export function FanSelector({ value, onChange }: Props) {
  const isAuto = value === AUTO;
  const level = isAuto ? 0 : Math.max(1, Math.min(5, Math.round(value / 20)));

  const base = "rounded-md py-2 text-sm transition";
  const on = "bg-[#5cc8ff] font-medium text-slate-900";
  const off = "hover:bg-white/10";

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Ventilação</h2>
        <span className="text-xs text-white/50">{isAuto ? "Automática" : `Nível ${level}`}</span>
      </div>
      <div className="grid grid-cols-[1.6fr_repeat(5,1fr)] gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
        <button className={`${base} ${isAuto ? on : off}`} onClick={() => onChange(AUTO)}>
          Auto
        </button>
        {LEVELS.map((v, i) => (
          <button key={v} className={`${base} ${level === i + 1 ? on : off}`} onClick={() => onChange(v)}>
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
