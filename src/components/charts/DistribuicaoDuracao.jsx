import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const CORES = ['#2563eb', '#3b82f6', '#93c5fd', '#dbeafe'];

const CustomTooltip = ({ active, payload, dark }) => {
  if (!active || !payload?.length) return null;
  const total = payload[0].payload.total;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-lg"
      style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        fontFamily: "'Geist', sans-serif",
      }}
    >
      <p className="font-medium mb-1">{payload[0].name}</p>
      <p style={{ color: payload[0].payload.fill }}>
        {payload[0].value} reservas
      </p>
      <p
        className="text-xs mt-0.5"
        style={{ color: dark ? '#64748b' : '#94a3b8' }}
      >
        {((payload[0].value / total) * 100).toFixed(1)}% do total
      </p>
    </div>
  );
};

export function DistribuicaoDuracao({ dados }) {
  const { dark } = useTheme();
  const total = dados.reduce((s, d) => s + d.value, 0);
  const dadosComTotal = dados.map((d, i) => ({ ...d, total, fill: CORES[i] }));

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
      }}
    >
      <h3
        className="text-sm font-medium mb-6"
        style={{
          color: dark ? '#94a3b8' : '#64748b',
          fontFamily: "'Geist', sans-serif",
        }}
      >
        Duração das estadias
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={dadosComTotal}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {dadosComTotal.map((entry, index) => (
              <Cell key={index} fill={CORES[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip dark={dark} />} />
          <Legend
            formatter={(value) => (
              <span
                style={{
                  fontSize: 12,
                  color: dark ? '#94a3b8' : '#64748b',
                  fontFamily: 'Geist',
                }}
              >
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
