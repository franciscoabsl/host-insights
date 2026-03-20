import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const CustomTooltip = ({ active, payload, label, dark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-lg"
      style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        fontFamily: "'Geist', sans-serif",
      }}
    >
      <p className="font-medium mb-1">{label}</p>
      <p style={{ color: '#2563eb' }}>{payload[0].value}% ocupação</p>
      <p
        className="text-xs mt-0.5"
        style={{ color: dark ? '#64748b' : '#94a3b8' }}
      >
        {payload[0].payload.diasOcupados}/{payload[0].payload.totalDias} dias
      </p>
    </div>
  );
};

export function OcupacaoMensal({ dados }) {
  const { dark } = useTheme();

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className="text-sm font-medium"
          style={{
            color: dark ? '#94a3b8' : '#64748b',
            fontFamily: "'Geist', sans-serif",
          }}
        >
          Taxa de ocupação por mês
        </h3>
        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: dark ? '#64748b' : '#94a3b8' }}
        >
          <span
            className="w-6 border-t-2 border-dashed"
            style={{ borderColor: '#f59e0b' }}
          />
          <span>meta 70%</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={dados} barCategoryGap="35%">
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke={dark ? '#1e3a5f33' : '#e2e8f033'}
          />
          <XAxis
            dataKey="label"
            tick={{
              fontSize: 11,
              fill: dark ? '#64748b' : '#94a3b8',
              fontFamily: 'Geist',
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
            tick={{
              fontSize: 11,
              fill: dark ? '#64748b' : '#94a3b8',
              fontFamily: 'Geist',
            }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            content={<CustomTooltip dark={dark} />}
            cursor={{ fill: dark ? '#ffffff08' : '#00000005' }}
          />
          <ReferenceLine
            y={70}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Bar dataKey="taxaOcupacao" radius={[6, 6, 0, 0]}>
            {dados.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.taxaOcupacao >= 70
                    ? '#2563eb'
                    : entry.taxaOcupacao >= 50
                      ? '#93c5fd'
                      : dark
                        ? '#334155'
                        : '#e2e8f0'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
