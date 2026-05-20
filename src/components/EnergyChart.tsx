import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip } from 'chart.js';
import type { SimState } from '../lib/physics';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Tooltip);

export default function EnergyChart({ history }: { history: SimState[] }) {
  const labels = history.map((h) => h.t.toFixed(2));
  return (
    <Line
      data={{
        labels,
        datasets: [
          { label: 'PE', data: history.map((h) => h.pe), borderColor: '#22d3ee', tension: 0.3 },
          { label: 'KE', data: history.map((h) => h.ke), borderColor: '#f472b6', tension: 0.3 },
          { label: 'ME', data: history.map((h) => h.me), borderColor: '#fde047', tension: 0.3 },
        ],
      }}
      options={{ responsive: true, animation: false, plugins: { legend: { labels: { color: '#e2e8f0' } } }, scales: { x: { ticks: { color: '#94a3b8' } }, y: { ticks: { color: '#94a3b8' } } } }}
    />
  );
}
