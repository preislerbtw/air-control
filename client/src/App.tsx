import { sendControl, type DeviceState } from "./api/client";
import { useDeviceState } from "./hooks/useDeviceState";
import { useDeviceInfo } from "./hooks/useDeviceInfo";
import { Header } from "./components/Header";
import { AcViewer } from "./components/AcViewer";
import { TempSection } from "./components/TempSection";
import { ModeGrid } from "./components/ModeGrid";
import { FanSelector } from "./components/FanSelector";
import { FeatureGrid } from "./components/FeatureGrid";
import { Footer } from "./components/Footer";

export default function App() {
  const { state, setState, error, lastUpdate } = useDeviceState();
  const { info, caps } = useDeviceInfo();

  async function update(patch: Partial<DeviceState>) {
    if (state) setState({ ...state, ...patch }); // atualização otimista
    try {
      setState(await sendControl(patch));
    } catch {
      /* o WebSocket corrige o estado no próximo ciclo */
    }
  }

  return (
    <main className="flex h-full flex-col gap-4 overflow-y-auto rounded-xl border border-white/10 bg-neutral-900/70 p-4">
      <Header
        name={info?.name ?? "Ar-condicionado"}
        ip={info?.ip ?? ""}
        online={!error && !!state}
        power={state?.power ?? false}
        onTogglePower={() => state && update({ power: !state.power })}
      />

      {!state ? (
        <p className="py-10 text-center text-sm text-white/60">{error ?? "Conectando…"}</p>
      ) : (
        <>
          <AcViewer active={state.power} />
          <TempSection
            state={state}
            min={caps?.minTemp ?? 16}
            max={caps?.maxTemp ?? 30}
            onCommit={(targetTemp) => update({ targetTemp })}
          />
          <ModeGrid value={state.mode} supported={caps?.modes} onChange={(mode) => update({ mode })} />
          <FanSelector value={state.fan} onChange={(fan) => update({ fan })} />
          <FeatureGrid state={state} caps={caps} onToggle={update} />
          <Footer
            lastUpdate={lastUpdate}
            sleep={state.sleep}
            eco={state.eco}
            onSleep={() => update({ sleep: !state.sleep })}
            onEco={() => update({ eco: !state.eco })}
            onSettings={() => console.log("configurações")}
          />
        </>
      )}
    </main>
  );
}
