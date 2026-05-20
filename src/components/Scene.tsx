import { motion } from 'framer-motion';
import { TRACK_LENGTH } from '../lib/physics';

type Props = { s: number; angleDeg: number };

const TRACK_PX = 420;

export default function Scene({ s, angleDeg }: Props) {
  const clampedProgress = Math.min(Math.max(s / TRACK_LENGTH, 0), 1);
  const angleRad = (angleDeg * Math.PI) / 180;

  const originX = 56;
  const originY = 180;
  const dx = TRACK_PX * Math.cos(angleRad);
  const dy = TRACK_PX * Math.sin(angleRad);

  const ballX = originX + dx * clampedProgress;
  const ballY = originY - dy * clampedProgress;

  return (
    <div className="relative h-72 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-slate-900 to-black">
      <div
        className="absolute h-1 bg-cyan-500/60"
        style={{
          left: `${originX}px`,
          top: `${originY}px`,
          width: `${TRACK_PX}px`,
          transformOrigin: 'left center',
          transform: `rotate(${-angleDeg}deg)`,
        }}
      />
      <motion.div
        className="absolute h-8 w-8 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.85)]"
        animate={{ left: `${ballX - 16}px`, top: `${ballY - 16}px` }}
        transition={{ type: 'spring', stiffness: 220, damping: 24, mass: 0.4 }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.20),transparent_40%)]" />
    </div>
  );
}
