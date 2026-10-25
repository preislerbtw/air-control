type Props = { value: number; indoor: number | null; onChange: (v: number) => void };

export function TempControl({ value, indoor, onChange }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-6xl font-light">{value}°C</div>
        {indoor !== null && <div className="text-sm text-white/60">ambiente {indoor}°</div>}
      </div>
      <div className="flex gap-2">
        <button className="h-12 w-12 rounded-xl bg-white/10 text-2xl hover:bg-white/20" onClick={() => onChange(value - 1)}>
          −
        </button>
        <button className="h-12 w-12 rounded-xl bg-white/10 text-2xl hover:bg-white/20" onClick={() => onChange(value + 1)}>
          +
        </button>
      </div>
    </div>
  );
}
