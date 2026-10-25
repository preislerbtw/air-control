import { useRef, useState } from "react";
import { Rotate3d } from "lucide-react";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function AcViewer({ active }: { active: boolean }) {
  const [angle, setAngle] = useState(-15);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; a: number } | null>(null);

  return (
    <div
      className="relative h-48 shrink-0 touch-none overflow-hidden rounded-xl border border-white/10 bg-black/20"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, a: angle };
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        setAngle(clamp(drag.current.a + (e.clientX - drag.current.x) * 0.4, -45, 45));
      }}
      onPointerUp={() => {
        drag.current = null;
        setDragging(false);
      }}
    >
      <div className="absolute right-3 top-2.5 flex items-center gap-1 text-xs text-white/40">
        <Rotate3d size={13} />
        Arraste para girar
      </div>

      <div className="absolute inset-0 flex items-start justify-center pt-10" style={{ perspective: 700 }}>
        <div
          className="relative"
          style={{
            transform: `rotateY(${angle}deg)`,
            transformStyle: "preserve-3d",
            transition: dragging ? "none" : "transform .25s ease-out",
          }}
        >
          {/* corpo do split */}
          <div className="relative h-14 w-64 rounded-2xl bg-gradient-to-b from-white to-slate-300 shadow-2xl">
            <div className="absolute bottom-2 left-3 right-3 h-1.5 rounded-full bg-slate-400/60" />
            <div className="absolute right-6 top-3 flex gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-green-400" : "bg-slate-400"}`} />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            </div>
          </div>

          {/* fluxo de ar */}
          {active && (
            <div className="pointer-events-none absolute left-0 right-0 top-full h-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute top-1 h-10 w-px rounded-full bg-white/60"
                  style={{
                    left: 22 + i * 26,
                    transform: `rotate(${(i - 4) * 4}deg)`,
                    animation: `air 1.6s ease-in infinite`,
                    animationDelay: `${i * 0.17}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
