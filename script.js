const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const statusBadge = document.getElementById('statusBadge');
const fpsBadge = document.getElementById('fpsBadge');

const controls = {
  mass: document.getElementById('mass'), gravity: document.getElementById('gravity'), friction: document.getElementById('friction'),
  angle: document.getElementById('angle'), height: document.getElementById('height'), velocity: document.getElementById('velocity'),
  planet: document.getElementById('planetSelect')
};
const vals = { massVal, gravityVal, frictionVal, angleVal, heightVal, velocityVal };
const readouts = {
  v: velRead, h: heightRead, pe: peRead, ke: keRead, me: meRead, loss: lossRead,
  peBar, keBar, meBar
};
const state = { running: false, slow: false, t: 0, x: 0, v: 0, heatLoss: 0, trail: [], particles: [], lastTime: 0, fps: 0, frameCount: 0, fpsClock: 0 };

const PLANETS = { earth: 9.81, moon: 1.62, mars: 3.71, jupiter: 24.79 };
const track = { startX: 60, endX: 0, baseY: 0, lenPx: 0, metersToPx: 0, theta: 0, totalLenM: 0, maxHeightM: 0 };

const chart = new Chart(document.getElementById('energyChart'), {
  type: 'line',
  data: { labels: [], datasets: [
    { label: 'Potential', data: [], borderColor: '#5fe7ff', tension: .25 },
    { label: 'Kinetic', data: [], borderColor: '#8b7dff', tension: .25 },
    { label: 'Mechanical', data: [], borderColor: '#76ffb2', tension: .25 }
  ]},
  options: { animation: false, responsive: true, plugins: { legend: { labels: { color: '#dff6ff' } } }, scales: {
    x: { ticks: { color: '#b6d4ff' }, grid: { color: 'rgba(120,180,255,.15)' } },
    y: { ticks: { color: '#b6d4ff' }, grid: { color: 'rgba(120,180,255,.15)' } }
  }}
});

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  recalcTrack();
}

function recalcTrack() {
  const angle = +controls.angle.value * Math.PI / 180;
  const h0 = +controls.height.value;
  track.theta = angle;
  track.maxHeightM = h0;
  track.totalLenM = Math.max(h0 / Math.sin(angle), 1);
  track.baseY = canvas.clientHeight - 35;
  track.endX = canvas.clientWidth - 45;
  track.lenPx = track.endX - track.startX;
  track.metersToPx = track.lenPx / track.totalLenM;
}

function resetSimulation() {
  recalcTrack();
  state.t = 0; state.x = 0; state.v = +controls.velocity.value; state.heatLoss = 0;
  state.trail = []; state.particles = [];
  chart.data.labels = []; chart.data.datasets.forEach(d => d.data = []); chart.update();
  updateDisplays();
}

function updateLabels() { Object.entries(vals).forEach(([k, e]) => e.textContent = (+controls[k.replace('Val','')]?.value || +controls[k.replace('Val','')] || 0).toFixed(k==='frictionVal'?3:2)); }
function setPlanetGravity() { controls.gravity.value = PLANETS[controls.planet.value].toFixed(2); updateLabels(); }

function physicsStep(dt) {
  const m = +controls.mass.value, g = +controls.gravity.value, mu = +controls.friction.value, theta = track.theta;
  const N = m * g * Math.cos(theta);
  const frictionAcc = mu * N / m;
  const acc = g * Math.sin(theta) - frictionAcc;
  state.v += acc * dt;
  state.v = Math.max(state.v, 0);
  state.x += state.v * dt;
  if (state.x > track.totalLenM) { state.x = track.totalLenM; state.v = 0; state.running = false; statusBadge.textContent = 'Completed'; }
  state.heatLoss += Math.max(mu * N * (state.v * dt), 0);
  state.t += dt;
  makeEffects();
}

function makeEffects() {
  const { bx, by } = getBallPosition();
  state.trail.push({ x: bx, y: by, a: 1 }); if (state.trail.length > 45) state.trail.shift();
  state.particles.push({ x: bx, y: by, vx: (Math.random()-.5)*1.6, vy: (Math.random()-.5)*1.6, life: 1 });
  if (state.particles.length > 80) state.particles.shift();
}

function getBallPosition() {
  const px = track.startX + state.x * track.metersToPx;
  const y = track.baseY - (track.endX - px) * Math.tan(track.theta);
  return { bx: px, by: y };
}

function energies() {
  const m = +controls.mass.value, g = +controls.gravity.value;
  const h = Math.max(track.maxHeightM - state.x * Math.sin(track.theta), 0);
  const pe = m * g * h;
  const ke = .5 * m * state.v * state.v;
  return { h, pe, ke, me: pe + ke };
}

function render() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  const grad = ctx.createLinearGradient(0, 0, canvas.clientWidth, canvas.clientHeight);
  grad.addColorStop(0, 'rgba(48,89,188,.25)'); grad.addColorStop(1, 'rgba(0,0,0,.1)');
  ctx.fillStyle = grad; ctx.fillRect(0,0,canvas.clientWidth, canvas.clientHeight);

  ctx.strokeStyle = 'rgba(95,231,255,.9)'; ctx.lineWidth = 4; ctx.shadowBlur = 24; ctx.shadowColor = '#4de6ff';
  ctx.beginPath(); ctx.moveTo(track.startX, track.baseY - track.lenPx * Math.tan(track.theta)); ctx.lineTo(track.endX, track.baseY); ctx.stroke(); ctx.shadowBlur = 0;

  state.trail.forEach((p, i) => { p.a *= .97; ctx.fillStyle = `rgba(95,231,255,${p.a * i / state.trail.length})`; ctx.beginPath(); ctx.arc(p.x, p.y, 7,0,Math.PI*2); ctx.fill(); });
  state.particles.forEach(p => { p.life *= .96; p.x += p.vx; p.y += p.vy; ctx.fillStyle = `rgba(125,195,255,${p.life})`; ctx.fillRect(p.x, p.y, 2, 2); });

  const { bx, by } = getBallPosition();
  const pulse = 12 + Math.sin(performance.now() * .008) * 4;
  ctx.fillStyle = 'rgba(88,236,255,.35)'; ctx.beginPath(); ctx.arc(bx, by, pulse,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = '#7af0ff'; ctx.shadowColor = '#7af0ff'; ctx.shadowBlur = 28; ctx.beginPath(); ctx.arc(bx, by, 10,0,Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
}

function updateDisplays() {
  const e = energies();
  const total0 = (+controls.mass.value) * (+controls.gravity.value) * (+controls.height.value) + .5 * (+controls.mass.value) * (+controls.velocity.value)**2;
  readouts.v.textContent = `${state.v.toFixed(3)} m/s`; readouts.h.textContent = `${e.h.toFixed(3)} m`;
  readouts.pe.textContent = `${e.pe.toFixed(2)} J`; readouts.ke.textContent = `${e.ke.toFixed(2)} J`; readouts.me.textContent = `${e.me.toFixed(2)} J`; readouts.loss.textContent = `${state.heatLoss.toFixed(2)} J`;
  readouts.peBar.style.width = `${Math.min(100, e.pe / total0 * 100)}%`;
  readouts.keBar.style.width = `${Math.min(100, e.ke / total0 * 100)}%`;
  readouts.meBar.style.width = `${Math.min(100, e.me / total0 * 100)}%`;

  if (chart.data.labels.length > 180) { chart.data.labels.shift(); chart.data.datasets.forEach(d => d.data.shift()); }
  chart.data.labels.push(state.t.toFixed(1)); chart.data.datasets[0].data.push(e.pe); chart.data.datasets[1].data.push(e.ke); chart.data.datasets[2].data.push(e.me);
  chart.update('none');
}

function animate(ts) {
  if (!state.lastTime) state.lastTime = ts;
  let dt = (ts - state.lastTime) / 1000; state.lastTime = ts;
  if (state.slow) dt *= .35;
  dt = Math.min(dt, 0.03);
  if (state.running) physicsStep(dt);

  state.frameCount++; state.fpsClock += dt;
  if (state.fpsClock >= 0.5) { state.fps = Math.round(state.frameCount / state.fpsClock); state.frameCount = 0; state.fpsClock = 0; fpsBadge.textContent = `FPS: ${state.fps}`; }

  render(); updateDisplays(); requestAnimationFrame(animate);
}

startBtn.onclick = () => { state.running = true; statusBadge.textContent = 'Running'; };
pauseBtn.onclick = () => { state.running = false; statusBadge.textContent = 'Paused'; };
resetBtn.onclick = () => { state.running = false; statusBadge.textContent = 'Reset'; resetSimulation(); };
replayBtn.onclick = () => { resetSimulation(); state.running = true; statusBadge.textContent = 'Replay'; };
slowBtn.onclick = () => { state.slow = !state.slow; slowBtn.textContent = state.slow ? 'Slow Motion: ON' : 'Slow Motion'; };
controls.planet.onchange = () => { setPlanetGravity(); resetSimulation(); };
Object.values(controls).forEach(c => c.oninput = () => { updateLabels(); if (c !== controls.planet) resetSimulation(); });
window.addEventListener('resize', resizeCanvas);

updateLabels(); setPlanetGravity(); resizeCanvas(); resetSimulation(); requestAnimationFrame(animate);
