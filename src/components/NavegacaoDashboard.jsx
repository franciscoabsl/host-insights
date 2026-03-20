import { useTheme } from '../context/ThemeContext';

const ITENS = [
  { id: 'financeiro', label: 'Financeiro', icone: '💰' },
  { id: 'ocupacao', label: 'Ocupação', icone: '🏠' },
  { id: 'reservas', label: 'Reservas', icone: '📋' },
  { id: 'insights', label: 'Insights', icone: '💡' },
  { id: 'fiscal', label: 'Fiscal', icone: '🧾' },
];

export function NavegacaoDashboard({ secoes, onToggle }) {
  const { dark } = useTheme();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="flex items-center gap-1 overflow-x-auto pb-1"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {ITENS.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer border-0 transition-all"
          style={{
            background: secoes[item.id]
              ? dark
                ? '#1e3a5f'
                : '#dbeafe'
              : dark
                ? '#1e293b'
                : '#f1f5f9',
            color: secoes[item.id]
              ? dark
                ? '#93c5fd'
                : '#1d4ed8'
              : dark
                ? '#64748b'
                : '#94a3b8',
          }}
        >
          <span style={{ fontSize: '12px' }}>{item.icone}</span>
          {item.label}
          <span
            onClick={(e) => {
              e.stopPropagation();
              onToggle(item.id);
            }}
            className="ml-0.5 opacity-60 hover:opacity-100"
            title={secoes[item.id] ? 'Recolher' : 'Expandir'}
          >
            {secoes[item.id] ? '−' : '+'}
          </span>
        </button>
      ))}
    </div>
  );
}
