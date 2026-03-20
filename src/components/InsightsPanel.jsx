import { useTheme } from '../context/ThemeContext';

const CORES = {
  positivo: {
    light: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
    dark: { bg: '#052e16', border: '#166534', text: '#4ade80' },
  },
  atencao: {
    light: { bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
    dark: { bg: '#1c1505', border: '#854d0e', text: '#fbbf24' },
  },
  neutro: {
    light: { bg: '#f8fafc', border: '#e2e8f0', text: '#475569' },
    dark: { bg: '#1e293b', border: '#334155', text: '#94a3b8' },
  },
};

function InsightCard({ insight }) {
  const { dark } = useTheme();
  const cores = CORES[insight.tipo][dark ? 'dark' : 'light'];

  return (
    <div
      className="rounded-xl p-4 flex gap-3"
      style={{
        background: cores.bg,
        border: `1px solid ${cores.border}`,
        fontFamily: "'Geist', sans-serif",
      }}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{insight.icone}</span>
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-1"
          style={{ color: cores.text }}
        >
          {insight.titulo}
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: dark ? '#cbd5e1' : '#374151' }}
        >
          {insight.texto}
        </p>
      </div>
    </div>
  );
}

export function InsightsPanel({ insights }) {
  const { dark } = useTheme();

  if (!insights?.length) return null;

  return (
    <div
      className="rounded-xl p-6"
      style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
      }}
    >
      <h3
        className="text-sm font-medium mb-4"
        style={{
          color: dark ? '#94a3b8' : '#64748b',
          fontFamily: "'Geist', sans-serif",
        }}
      >
        Insights automáticos
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} />
        ))}
      </div>
    </div>
  );
}
