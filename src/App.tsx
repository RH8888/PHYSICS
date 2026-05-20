import Controls from './components/Controls';
import EnergyChart from './components/EnergyChart';
import Scene from './components/Scene';
import { useSimulator } from './hooks/useSimulator';

export default function App() {
  const { config, setConfig, state, history, running, setRunning, reset, replay, energyLoss } = useSimulator();
  return (
    <main className="min-h-screen bg-slate-950 p-4 text-slate-100 md:p-8">
      <header className="mx-auto mb-6 max-w-7xl">
        <h1 className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-3xl font-bold text-transparent">Energy Conservation Simulator</h1>
        <p className="text-sm text-slate-400">پایستگی انرژی مکانیکی • PE=mgh • KE=½mv² • ME=PE+KE</p>
      </header>
      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Scene s={state.s} angleDeg={config.angleDeg} />
          <div className="rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-xl shadow-neon">
            <EnergyChart history={history} />
          </div>
        </div>
        <div className="space-y-4">
          <Controls config={config} setConfig={setConfig} />
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Potential', state.pe],
              ['Kinetic', state.ke],
              ['Mechanical', state.me],
              ['Loss (friction)', energyLoss],
            ].map(([label, val]) => (
              <div key={String(label)} className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-3">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-lg font-semibold text-cyan-200">{Number(val).toFixed(2)} J</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-xl bg-cyan-500 px-4 py-2 text-slate-950" onClick={() => setRunning((r) => !r)}>{running ? 'Pause' : 'Start'}</button>
            <button className="rounded-xl bg-slate-700 px-4 py-2" onClick={reset}>Reset</button>
            <button className="rounded-xl bg-fuchsia-600 px-4 py-2" onClick={replay}>Replay</button>
          </div>
        </div>
      </section>
    </main>
  );
}
