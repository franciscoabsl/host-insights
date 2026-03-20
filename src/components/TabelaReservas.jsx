import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

const PAGE_SIZE = 10;

export function TabelaReservas({ reservas }) {
  const { dark } = useTheme();
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.ceil(reservas.length / PAGE_SIZE);
  const inicio = (pagina - 1) * PAGE_SIZE;
  const paginadas = reservas.slice(inicio, inicio + PAGE_SIZE);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
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
        <span
          className="text-xs"
          style={{
            color: dark ? '#475569' : '#94a3b8',
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          {reservas.length} no total
        </span>
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
                'Valor líquido',
                'Antecedência',
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider"
                  style={{ color: dark ? '#475569' : '#94a3b8' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginadas.map((r, i) => {
              const antecedencia =
                r.dataReserva && r.dataInicio
                  ? Math.round(
                      (r.dataInicio - r.dataReserva) / (1000 * 60 * 60 * 24),
                    )
                  : null;
              const pctTaxa =
                r.ganhosBrutos > 0
                  ? ((r.taxaServico / r.ganhosBrutos) * 100).toFixed(1)
                  : null;

              return (
                <tr
                  key={r.codigo}
                  style={{
                    borderBottom:
                      i < paginadas.length - 1
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
                    className="px-5 py-3 font-medium"
                    style={{ color: dark ? '#e2e8f0' : '#0f172a' }}
                  >
                    {r.hospede}
                  </td>
                  <td
                    className="px-5 py-3"
                    style={{
                      color: dark ? '#94a3b8' : '#64748b',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {r.dataInicio ? format(r.dataInicio, 'dd/MM/yyyy') : '-'}
                  </td>
                  <td
                    className="px-5 py-3"
                    style={{
                      color: dark ? '#94a3b8' : '#64748b',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {r.dataFim ? format(r.dataFim, 'dd/MM/yyyy') : '-'}
                  </td>
                  <td
                    className="px-5 py-3 text-center"
                    style={{ color: dark ? '#94a3b8' : '#64748b' }}
                  >
                    {r.noites}
                  </td>
                  <td
                    className="px-5 py-3 font-medium"
                    style={{
                      color: '#2563eb',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {formatCurrency(r.valor)}
                  </td>
                  <td
                    className="px-5 py-3"
                    style={{ color: dark ? '#94a3b8' : '#64748b' }}
                  >
                    {antecedencia !== null ? (
                      <span className="flex items-center gap-1.5">
                        <span>{antecedencia} dias</span>
                        {antecedencia <= 7 && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{
                              background: dark ? '#854d0e22' : '#fef9c3',
                              color: '#b45309',
                            }}
                          >
                            última hora
                          </span>
                        )}
                        {antecedencia >= 90 && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{
                              background: dark ? '#14532d22' : '#f0fdf4',
                              color: '#15803d',
                            }}
                          >
                            antecipado
                          </span>
                        )}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div
          className="flex items-center justify-between px-5 py-3 border-t"
          style={{ borderColor: dark ? '#334155' : '#e2e8f0' }}
        >
          <span
            className="text-xs"
            style={{
              color: dark ? '#475569' : '#94a3b8',
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            {inicio + 1}–{Math.min(inicio + PAGE_SIZE, reservas.length)} de{' '}
            {reservas.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="px-3 py-1 rounded-lg text-xs cursor-pointer border-0 transition-all"
              style={{
                background: dark ? '#0f172a' : '#f1f5f9',
                color:
                  pagina === 1
                    ? dark
                      ? '#334155'
                      : '#cbd5e1'
                    : dark
                      ? '#94a3b8'
                      : '#64748b',
                opacity: pagina === 1 ? 0.5 : 1,
              }}
            >
              ← anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPagina(p)}
                className="w-7 h-7 rounded-lg text-xs cursor-pointer border-0 font-medium"
                style={{
                  background:
                    p === pagina ? '#2563eb' : dark ? '#0f172a' : '#f1f5f9',
                  color:
                    p === pagina ? '#ffffff' : dark ? '#64748b' : '#94a3b8',
                }}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="px-3 py-1 rounded-lg text-xs cursor-pointer border-0 transition-all"
              style={{
                background: dark ? '#0f172a' : '#f1f5f9',
                color:
                  pagina === totalPaginas
                    ? dark
                      ? '#334155'
                      : '#cbd5e1'
                    : dark
                      ? '#94a3b8'
                      : '#64748b',
                opacity: pagina === totalPaginas ? 0.5 : 1,
              }}
            >
              próxima →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
