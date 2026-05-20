export type SimConfig = {
  mass: number;
  gravity: number;
  angleDeg: number;
  friction: number;
  initialHeight: number;
  initialVelocity: number;
  slowMo: number;
};

export type SimState = {
  t: number;
  s: number;
  v: number;
  h: number;
  pe: number;
  ke: number;
  me: number;
};

export const TRACK_LENGTH = 8;
const DT = 1 / 60;

export const computeInitialState = (cfg: SimConfig): SimState => {
  const pe = cfg.mass * cfg.gravity * cfg.initialHeight;
  const ke = 0.5 * cfg.mass * cfg.initialVelocity ** 2;
  return { t: 0, s: 0, v: cfg.initialVelocity, h: cfg.initialHeight, pe, ke, me: pe + ke };
};

export const nextState = (prev: SimState, cfg: SimConfig): SimState => {
  const theta = (cfg.angleDeg * Math.PI) / 180;
  const accel = cfg.gravity * (Math.sin(theta) - cfg.friction * Math.cos(theta));
  const realDt = DT * cfg.slowMo;
  const v = Math.max(prev.v + accel * realDt, 0);
  const s = Math.min(prev.s + v * realDt, TRACK_LENGTH);
  const h = Math.max(cfg.initialHeight - s * Math.sin(theta), 0);
  const pe = cfg.mass * cfg.gravity * h;
  const ke = 0.5 * cfg.mass * v * v;
  const me = pe + ke;
  return { t: prev.t + realDt, s, v, h, pe, ke, me };
};
