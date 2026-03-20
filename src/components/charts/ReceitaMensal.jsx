import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

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
      <p style={{ color: '#2563eb' }}>{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export function ReceitaMensal({ dados }) {
  const { dark } = useTheme();
  const melhorMes = Math.max(...dados.map((d) => d.receita));

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
        Receita por mês
      </h3>
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
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            tick={{
              fontSize: 11,
              fill: dark ? '#64748b' : '#94a3b8',
              fontFamily: 'Geist',
            }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip
            content={<CustomTooltip dark={dark} />}
            cursor={{ fill: dark ? '#ffffff08' : '#00000005' }}
          />
          <Bar dataKey="receita" radius={[6, 6, 0, 0]}>
            {dados.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.receita === melhorMes
                    ? '#2563eb'
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
