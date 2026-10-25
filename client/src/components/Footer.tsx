import { useEffect, useState } from "react";
import { Moon, RefreshCw, Settings, Zap } from "lucide-react";

type Props = {
  lastUpdate: number;
  sleep: boolean;
  eco: boolean;
  onSleep: () => void;
  onEco: () => void;
  onSettings: () => void;
};

function ago(ms: number) {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 10) return "agora";
  if (s < 60) return `há ${s}s`;
  return `há ${Math.floor(s / 60)} min`;
}

export function Footer({ lastUpdate, sleep, eco, onSleep, onEco, onSettings }: Props) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const btn = "flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10";

  return (
    <footer className="mt-auto flex items-center justify-between border-t border-white/10 pt-3 text-sm text-white/70">
      <span className="flex items-center gap-2">
        <RefreshCw size={14} />
        Atualizado {ago(lastUpdate)}
      </span>
      <div className="flex gap-1">
        <button className={`${btn} ${sleep ? "text-[#5cc8ff]" : ""}`} onClick={onSleep} aria-label="Modo noturno">
          <Moon size={16} />
        </button>
        <button className={`${btn} ${eco ? "text-[#5cc8ff]" : ""}`} onClick={onEco} aria-label="Economia">
          <Zap size={16} />
        </button>
        <button className={btn} onClick={onSettings} aria-label="Configurações">
          <Settings size={16} />
        </button>
      </div>
    </footer>
  );
}
