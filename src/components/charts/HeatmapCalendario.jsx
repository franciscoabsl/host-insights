import { useTheme } from '../../context/ThemeContext';
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getDay,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MESES_NOMES = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function MesCalendario({ ano, mes, diasOcupados, dark }) {
  const inicio = startOfMonth(new Date(ano, mes, 1));
  const fim = endOfMonth(inicio);
  const dias = eachDayOfInterval({ start: inicio, end: fim });
  const primeiroDia = getDay(inicio);

  return (
    <div className="flex flex-col gap-1">
      <p
        className="text-xs font-medium text-center mb-2"
        style={{
          color: dark ? '#94a3b8' : '#64748b',
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {MESES_NOMES[mes]}
      </p>
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
      >
        {DIAS_SEMANA.map((d, i) => (
          <div
            key={i}
            className="text-center"
            style={{
              fontSize: '8px',
              color: dark ? '#475569' : '#94a3b8',
              fontFamily: "'Geist', sans-serif",
            }}
          >
            {d}
          </div>
        ))}
        {Array.from({ length: primeiroDia }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {dias.map((dia) => {
          const key = format(dia, 'yyyy-MM-dd');
          const ocupado = diasOcupados.has(key);
          return (
            <div
              key={key}
              title={`${format(dia, 'dd/MM')}${ocupado ? ' — ocupado' : ' — livre'}`}
              className="rounded-sm aspect-square"
              style={{
                background: ocupado ? '#2563eb' : dark ? '#1e293b' : '#f1f5f9',
                minWidth: '10px',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function HeatmapCalendario({ reservas, diasOcupados }) {
  const { dark } = useTheme();

  if (!reservas.length) return null;

  const anos = [...new Set(reservas.map((r) => r.dataInicio.getFullYear()))];
  const mesesComDados = new Set(
    reservas.map(
      (r) => `${r.dataInicio.getFullYear()}-${r.dataInicio.getMonth()}`,
    ),
  );

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
          Calendário de ocupação
        </h3>
        <div
          className="flex items-center gap-3 text-xs"
          style={{ color: dark ? '#64748b' : '#94a3b8' }}
        >
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: '#2563eb' }}
            />
            <span>Ocupado</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                background: dark ? '#1e293b' : '#f1f5f9',
                border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
              }}
            />
            <span>Livre</span>
          </div>
        </div>
      </div>

      {anos.map((ano) => (
        <div key={ano}>
          {anos.length > 1 && (
            <p
              className="text-xs font-semibold mb-4"
              style={{
                color: dark ? '#64748b' : '#94a3b8',
                fontFamily: "'Geist Mono', monospace",
              }}
            >
              {ano}
            </p>
          )}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            }}
          >
            {Array.from({ length: 12 }, (_, m) => {
              const key = `${ano}-${m}`;
              if (!mesesComDados.has(key)) return null;
              return (
                <MesCalendario
                  key={key}
                  ano={ano}
                  mes={m}
                  diasOcupados={diasOcupados}
                  dark={dark}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
