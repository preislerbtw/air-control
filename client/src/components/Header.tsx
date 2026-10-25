import { AirVent, ChevronDown, Power } from "lucide-react";

type Props = {
  name: string;
  ip: string;
  online: boolean;
  power: boolean;
  onTogglePower: () => void;
};

export function Header({ name, ip, online, power, onTogglePower }: Props) {
  return (
    <header className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
        <AirVent size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 font-semibold">
          <span className="truncate">{name}</span>
          <ChevronDown size={14} className="text-white/50" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/60">
          <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-green-400" : "bg-red-400"}`} />
          {online ? `Conectado · ${ip}` : "Sem conexão"}
        </div>
      </div>

      <button
        onClick={onTogglePower}
        aria-label="Ligar ou desligar"
        className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
          power ? "bg-[#5cc8ff] text-slate-900" : "bg-white/10 text-white/70 hover:bg-white/20"
        }`}
      >
        <Power size={20} />
      </button>
    </header>
  );
}
