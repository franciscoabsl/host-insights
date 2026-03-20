import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function TabelaReservas({ reservas }) {
  const { dark } = useTheme();

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
      }}
    >
      <div
        className="px-6 py-4 border-b"
        style={{ borderColor: dark ? '#334155' : '#e2e8f0' }}
      >
        <h3
          className="text-sm font-medium"
          style={{
            color: dark ? '#94a3b8' : '#64748b',
            fontFamily: "'Geist', sans-serif",
          }}
        >
          Reservas
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          style={{ fontFamily: "'Geist', sans-serif" }}
        >
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
              }}
            >
              {[
                'Hóspede',
                'Check-in',
                'Check-out',
                'Noites',
                'Valor',
                'Antecedência',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider"
                  style={{ color: dark ? '#475569' : '#94a3b8' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservas.map((r, i) => {
              const antecedencia =
                r.dataReserva && r.dataInicio
                  ? Math.round(
                      (r.dataInicio - r.dataReserva) / (1000 * 60 * 60 * 24),
                    )
                  : null;
              return (
                <tr
                  key={r.codigo}
                  style={{
                    borderBottom:
                      i < reservas.length - 1
                        ? `1px solid ${dark ? '#1e293b' : '#f8fafc'}`
                        : 'none',
                    background:
                      i % 2 === 0
                        ? 'transparent'
                        : dark
                          ? '#ffffff05'
                          : '#f8fafc50',
                  }}
                >
                  <td
                    className="px-6 py-3 font-medium"
                    style={{ color: dark ? '#e2e8f0' : '#0f172a' }}
                  >
                    {r.hospede}
                  </td>
                  <td
                    className="px-6 py-3"
                    style={{
                      color: dark ? '#94a3b8' : '#64748b',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {r.dataInicio ? format(r.dataInicio, 'dd/MM/yyyy') : '-'}
                  </td>
                  <td
                    className="px-6 py-3"
                    style={{
                      color: dark ? '#94a3b8' : '#64748b',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {r.dataFim ? format(r.dataFim, 'dd/MM/yyyy') : '-'}
                  </td>
                  <td
                    className="px-6 py-3 text-center"
                    style={{ color: dark ? '#94a3b8' : '#64748b' }}
                  >
                    {r.noites}
                  </td>
                  <td
                    className="px-6 py-3 font-medium"
                    style={{
                      color: '#2563eb',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {formatCurrency(r.valor)}
                  </td>
                  <td
                    className="px-6 py-3"
                    style={{ color: dark ? '#94a3b8' : '#64748b' }}
                  >
                    {antecedencia !== null ? `${antecedencia} dias` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
