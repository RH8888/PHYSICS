import { useEffect, useMemo, useRef, useState } from 'react';
import { computeInitialState, nextState, type SimConfig, type SimState, TRACK_LENGTH } from '../lib/physics';

const baseConfig: SimConfig = {
  mass: 3,
  gravity: 9.81,
  angleDeg: 35,
  friction: 0,
  initialHeight: 4,
  initialVelocity: 0,
  slowMo: 1,
};

export const planets = {
  Earth: 9.81,
  Moon: 1.62,
  Mars: 3.71,
  Jupiter: 24.79,
};

export const useSimulator = () => {
  const [config, setConfig] = useState(baseConfig);
  const [running, setRunning] = useState(false);
  const [state, setState] = useState<SimState>(() => computeInitialState(baseConfig));
  const [history, setHistory] = useState<SimState[]>([computeInitialState(baseConfig)]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const frame = () => {
      setState((prev) => {
        const next = nextState(prev, config);
        setHistory((h) => [...h.slice(-300), next]);
        if (next.s >= TRACK_LENGTH) setRunning(false);
        return next;
      });
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, config]);

  const reset = () => {
    const fresh = computeInitialState(config);
    setState(fresh);
    setHistory([fresh]);
    setRunning(false);
  };

  const energyLoss = useMemo(() => {
    const first = history[0]?.me ?? 0;
    return Math.max(first - state.me, 0);
  }, [history, state.me]);

  return {
    config,
    setConfig,
    state,
    history,
    running,
    setRunning,
    reset,
    replay: () => {
      reset();
      setRunning(true);
    },
    energyLoss,
  };
};
