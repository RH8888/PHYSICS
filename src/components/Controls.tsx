import type { SimConfig } from '../lib/physics';
import { planets } from '../hooks/useSimulator';

type Props = {
  config: SimConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimConfig>>;
};

const slider = (label: string, key: keyof SimConfig, min: number, max: number, step: number, config: SimConfig, setConfig: Props['setConfig']) => (
  <label className="block text-xs text-cyan-100/90" key={key}>
    {label}: <span className="text-fuchsia-300">{config[key]}</span>
    <input className="w-full accent-cyan-400" type="range" min={min} max={max} step={step} value={config[key]} onChange={(e) => setConfig((c) => ({ ...c, [key]: Number(e.target.value) }))} />
  </label>
);

export default function Controls({ config, setConfig }: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-xl shadow-neon">
      <div className="flex flex-wrap gap-2">
        {Object.entries(planets).map(([name, g]) => (
          <button key={name} className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-cyan-200 hover:bg-cyan-900" onClick={() => setConfig((c) => ({ ...c, gravity: g }))}>{name}</button>
        ))}
      </div>
      {slider('Mass (kg)', 'mass', 0.5, 20, 0.1, config, setConfig)}
      {slider('Gravity (m/s²)', 'gravity', 0.1, 30, 0.01, config, setConfig)}
      {slider('Ramp angle (°)', 'angleDeg', 5, 70, 1, config, setConfig)}
      {slider('Friction (μ)', 'friction', 0, 1, 0.01, config, setConfig)}
      {slider('Initial height (m)', 'initialHeight', 0.5, 8, 0.1, config, setConfig)}
      {slider('Initial velocity (m/s)', 'initialVelocity', 0, 15, 0.1, config, setConfig)}
      {slider('Slow motion factor', 'slowMo', 0.1, 1, 0.1, config, setConfig)}
    </div>
  );
}
