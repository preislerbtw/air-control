const BASE = 'http://127.0.0.1:8787'

export type Mode = 'auto' | 'cool' | 'dry' | 'fan' | 'heat'
export type Feature = 'turbo' | 'silent' | 'sleep' | 'swing' | 'light' | 'xfan'

export interface AcState extends Record<Feature, boolean> {
  online: boolean
  mock: boolean
  host: string
  power: boolean
  mode: Mode
  target: number
  indoor: number
  fan: number // 0 = automático, 1..5
}

export const getState = async (): Promise<AcState> => (await fetch(`${BASE}/state`)).json()

export const patchState = async (patch: Partial<AcState>): Promise<AcState> =>
  (await fetch(`${BASE}/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  })).json()
