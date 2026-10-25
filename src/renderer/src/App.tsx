import { useCallback, useEffect, useState } from 'react'
import { Power, Minus, Plus, Snowflake, Flame, Droplets, Fan, Sparkles, Zap, VolumeX, Moon, ArrowUpDown, Lightbulb, Wind } from 'lucide-react'
import { AcState, Feature, Mode, getState, patchState } from './api'

const MODES: { id: Mode; label: string; Icon: typeof Fan }[] = [
  { id: 'auto', label: 'Auto', Icon: Sparkles },
  { id: 'cool', label: 'Frio', Icon: Snowflake },
  { id: 'dry', label: 'Seco', Icon: Droplets },
  { id: 'fan', label: 'Ventilar', Icon: Fan },
  { id: 'heat', label: 'Quente', Icon: Flame }
]
const FEATURES: { id: Feature; label: string; Icon: typeof Fan }[] = [
  { id: 'turbo', label: 'Turbo', Icon: Zap },
  { id: 'silent', label: 'Silêncio', Icon: VolumeX },
  { id: 'sleep', label: 'Sleep', Icon: Moon },
  { id: 'swing', label: 'Swing', Icon: ArrowUpDown },
  { id: 'light', label: 'Luz', Icon: Lightbulb },
  { id: 'xfan', label: 'X-Fan', Icon: Wind }
]
const MODE_TEXT: Record<Mode, string> = { auto: 'Automático', cool: 'Resfriando', dry: 'Secando', fan: 'Ventilando', heat: 'Aquecendo' }

const tile = (on: boolean) =>
  `flex items-center justify-center gap-2 rounded-md py-3 text-sm transition ${on ? 'bg-accent text-black font-medium' : 'bg-white/10 hover:bg-white/20'}`

export default function App() {
  const [s, setS] = useState<AcState | null>(null)
  const [err, setErr] = useState(false)

  const refresh = useCallback(() => getState().then((v) => { setS(v); setErr(false) }).catch(() => setErr(true)), [])
  useEffect(() => { refresh(); const t = setInterval(refresh, 5000); return () => clearInterval(t) }, [refresh])

  const set = (patch: Partial<AcState>) => {
    setS((cur) => (cur ? { ...cur, ...patch } : cur)) // atualização otimista
    patchState(patch).then(setS).catch(() => setErr(true))
  }

  if (!s) return <div className="grid h-full place-items-center text-white/60">{err ? 'Serviço offline. Rode: npm run service' : 'Conectando…'}</div>

  return (
    <div className="flex h-full flex-col gap-4 bg-black/40 p-5">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold">Ar-condicionado</div>
          <div className="text-xs text-white/60">
            <span className={err || !s.online ? 'text-red-400' : 'text-green-400'}>●</span>{' '}
            {err ? 'Serviço offline' : s.mock ? 'Modo simulado' : `Conectado · ${s.host}`}
          </div>
        </div>
        <button onClick={() => set({ power: !s.power })} className={`grid h-11 w-11 place-items-center rounded-full ${s.power ? 'bg-accent text-black' : 'bg-white/15'}`}>
          <Power size={20} />
        </button>
      </header>

      <section className={s.power ? '' : 'opacity-50'}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-6xl font-light leading-none">{s.target}<span className="align-top text-2xl">°C</span></div>
            <div className="mt-2 text-xs text-white/60">{MODE_TEXT[s.mode]} · ambiente {s.indoor}°</div>
          </div>
          <div className="flex gap-2">
            {[-1, 1].map((d) => (
              <button key={d} onClick={() => set({ target: Math.min(30, Math.max(16, s.target + d)) })} className="grid h-10 w-12 place-items-center rounded-md bg-white/10 hover:bg-white/20">
                {d < 0 ? <Minus size={16} /> : <Plus size={16} />}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-white/60">
          16°<input type="range" min={16} max={30} value={s.target} onChange={(e) => set({ target: +e.target.value })} className="flex-1" />30°
        </div>
      </section>

      <section>
        <div className="mb-2 text-xs text-white/60">Modo</div>
        <div className="grid grid-cols-5 gap-2">
          {MODES.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => set({ mode: id })} className={`${tile(s.mode === id)} flex-col !gap-1 !py-3 !text-xs`}>
              <Icon size={18} />{label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex justify-between text-xs text-white/60"><span>Ventilação</span><span>{s.fan === 0 ? 'Automática' : `Nível ${s.fan}`}</span></div>
        <div className="grid grid-cols-6 gap-1 rounded-md bg-white/10 p-1">
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => set({ fan: n })} className={`rounded py-2 text-sm ${s.fan === n ? 'bg-accent font-medium text-black' : 'hover:bg-white/10'}`}>{n === 0 ? 'Auto' : n}</button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 text-xs text-white/60">Recursos</div>
        <div className="grid grid-cols-3 gap-2">
          {FEATURES.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => set({ [id]: !s[id] })} className={tile(s[id])}><Icon size={16} />{label}</button>
          ))}
        </div>
      </section>
    </div>
  )
}
