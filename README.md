# Energy Conservation Simulator (پایستگی انرژی مکانیکی)

Premium interactive web lab for visualizing mechanical energy conservation on a ramp.

## Stack
- React + TypeScript + Vite
- TailwindCSS (glassmorphism + neon UI)
- Framer Motion
- Chart.js via react-chartjs-2

## Features
- Real-time simulation of rolling ball on an incline.
- Configurable mass, gravity, ramp angle, friction, initial height, and initial velocity.
- Start / Pause / Reset / Replay controls.
- Slow-motion factor.
- Planet presets: Earth, Moon, Mars, Jupiter.
- Live PE / KE / ME graph.
- Frictionless mode keeps total mechanical energy near constant.
- Friction mode shows energy loss over time.

## Physics model
- Potential energy: `PE = mgh`
- Kinetic energy: `KE = 1/2 mv²`
- Mechanical energy: `ME = PE + KE`
- Acceleration approximation along incline:
  `a = g(sinθ - μcosθ)`

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Structure
- `src/lib/physics.ts`: physics equations and time stepping.
- `src/hooks/useSimulator.ts`: state management, animation loop, history buffer.
- `src/components/*`: controls, scene, and chart modules.
- `src/App.tsx`: dashboard composition.
