import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function PreviewModal({ reservas, onConfirmar, onCancelar }) {
  const { dark } = useTheme();
  const [selecionadas, setSelecionadas] = useState(
    new Set(reservas.map((r) => r.codigo)),
  );

  const toggleReserva = (codigo) => {
    setSelecionadas((prev) => {
      const novo = new Set(prev);
      if (novo.has(codigo)) novo.delete(codigo);
      else novo.add(codigo);
      return novo;
    });
  };

  const toggleTodas = () => {
    if (selecionadas.size === reservas.length) {
      setSelecionadas(new Set());
    } else {
      setSelecionadas(new Set(reservas.map((r) => r.codigo)));
    }
  };

  const reservasFiltradas = reservas.filter((r) => selecionadas.has(r.codigo));
  const totalReceita = reservasFiltradas.reduce((s, r) => s + r.valor, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-3xl rounded-2xl flex flex-col"
        style={{
          background: dark ? '#0f172a' : '#ffffff',
          border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
          maxHeight: '85vh',
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: dark ? '#1e293b' : '#e2e8f0' }}
        >
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: dark ? '#f1f5f9' : '#0f172a' }}
            >
              Prévia dos dados
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: dark ? '#64748b' : '#94a3b8' }}
            >
              {reservas.length} reservas encontradas — revise e ajuste antes de
              gerar
            </p>
          </div>
          <button
            onClick={onCancelar}
            className="text-xl cursor-pointer bg-transparent border-0 leading-none"
            style={{ color: dark ? '#475569' : '#94a3b8' }}
          >
            ✕
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-sm">
            <thead
              className="sticky top-0"
              style={{ background: dark ? '#0f172a' : '#f8fafc' }}
            >
              <tr
                style={{
                  borderBottom: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
                }}
              >
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selecionadas.size === reservas.length}
                    onChange={toggleTodas}
                    className="cursor-pointer"
                  />
                </th>
                {['Hóspede', 'Check-in', 'Check-out', 'Noites', 'Valor'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: dark ? '#475569' : '#94a3b8' }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {reservas.map((r, i) => {
                const ativa = selecionadas.has(r.codigo);
                return (
                  <tr
                    key={r.codigo}
                    onClick={() => toggleReserva(r.codigo)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: `1px solid ${dark ? '#1e293b' : '#f1f5f9'}`,
                      background: !ativa
                        ? dark
                          ? '#ff000008'
                          : '#fff1f108'
                        : i % 2 === 0
                          ? 'transparent'
                          : dark
                            ? '#ffffff03'
                            : '#f8fafc50',
                      opacity: ativa ? 1 : 0.4,
                    }}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={ativa}
                        onChange={() => toggleReserva(r.codigo)}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer"
                      />
                    </td>
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: dark ? '#e2e8f0' : '#0f172a' }}
                    >
                      {r.hospede}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{
                        color: dark ? '#94a3b8' : '#64748b',
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    >
                      {r.dataInicio ? format(r.dataInicio, 'dd/MM/yyyy') : '-'}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{
                        color: dark ? '#94a3b8' : '#64748b',
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    >
                      {r.dataFim ? format(r.dataFim, 'dd/MM/yyyy') : '-'}
                    </td>
                    <td
                      className="px-4 py-3 text-center"
                      style={{ color: dark ? '#94a3b8' : '#64748b' }}
                    >
                      {r.noites}
                    </td>
                    <td
                      className="px-4 py-3 font-medium"
                      style={{
                        color: '#2563eb',
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    >
                      {formatCurrency(r.valor)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: dark ? '#1e293b' : '#e2e8f0' }}
        >
          <div
            className="text-sm"
            style={{ color: dark ? '#64748b' : '#94a3b8' }}
          >
            <span
              className="font-medium"
              style={{ color: dark ? '#f1f5f9' : '#0f172a' }}
            >
              {selecionadas.size}
            </span>{' '}
            de {reservas.length} reservas selecionadas ·{' '}
            <span className="font-medium" style={{ color: '#2563eb' }}>
              {formatCurrency(totalReceita)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancelar}
              className="text-sm px-4 py-2 rounded-lg cursor-pointer border-0"
              style={{
                background: dark ? '#1e293b' : '#f1f5f9',
                color: dark ? '#94a3b8' : '#64748b',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirmar(reservasFiltradas)}
              disabled={selecionadas.size === 0}
              className="text-sm px-4 py-2 rounded-lg font-medium cursor-pointer border-0 transition-opacity"
              style={{
                background: selecionadas.size === 0 ? '#94a3b8' : '#2563eb',
                color: '#ffffff',
                opacity: selecionadas.size === 0 ? 0.5 : 1,
              }}
            >
              Gerar Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
