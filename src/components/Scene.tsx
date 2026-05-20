import { motion } from 'framer-motion';
import { TRACK_LENGTH } from '../lib/physics';

type Props = { s: number; angleDeg: number };

export default function Scene({ s, angleDeg }: Props) {
  const progress = (s / TRACK_LENGTH) * 100;
  return (
    <div className="relative h-72 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-slate-900 to-black">
      <div className="absolute left-8 right-8 top-1/2 h-1 origin-left -translate-y-1/2 bg-cyan-500/60" style={{ transform: `translateY(-50%) rotate(${angleDeg}deg)` }} />
      <motion.div
        className="absolute h-8 w-8 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.85)]"
        animate={{ left: `calc(${progress}% - 16px)`, top: `calc(50% - ${progress * 0.8}px)` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.20),transparent_40%)]" />
    </div>
  );
}
