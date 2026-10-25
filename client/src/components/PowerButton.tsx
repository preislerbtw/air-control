type Props = { on: boolean; onToggle: () => void };

export function PowerButton({ on, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label="Ligar ou desligar"
      className={`h-12 w-12 rounded-full text-xl transition ${
        on ? "bg-sky-400 text-slate-900" : "bg-white/10 text-white/70 hover:bg-white/20"
      }`}
    >
      ⏻
    </button>
  );
}
