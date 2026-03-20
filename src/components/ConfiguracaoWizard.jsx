import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

function formatCurrency(v) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(v || 0);
}

function InputValor({ label, value, onChange, dark, placeholder = '0,00' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-medium"
        style={{
          color: dark ? '#94a3b8' : '#64748b',
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {label}
      </label>
      <div
        className="flex items-center gap-2 rounded-lg px-3 py-2 border"
        style={{
          background: dark ? '#0f172a' : '#f8fafc',
          borderColor: dark ? '#334155' : '#e2e8f0',
        }}
      >
        <span
          className="text-xs"
          style={{ color: dark ? '#475569' : '#94a3b8' }}
        >
          R$
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 outline-none text-sm"
          style={{
            color: dark ? '#f1f5f9' : '#0f172a',
            fontFamily: "'Geist Mono', monospace",
          }}
        />
      </div>
    </div>
  );
}

function Passo1({ config, onChange, dark }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: dark ? '#64748b' : '#94a3b8' }}
        >
          Dedutíveis para IR
        </p>
        <div className="grid grid-cols-2 gap-3">
          <InputValor
            label="IPTU mensal"
            value={config.iptu}
            onChange={(v) => onChange({ iptu: v })}
            dark={dark}
          />
          <InputValor
            label="Condomínio mensal"
            value={config.condominio}
            onChange={(v) => onChange({ condominio: v })}
            dark={dark}
          />
        </div>
      </div>
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: dark ? '#64748b' : '#94a3b8' }}
        >
          Outras despesas fixas mensais
        </p>
        <div className="grid grid-cols-2 gap-3">
          <InputValor
            label="Internet"
            value={config.internet}
            onChange={(v) => onChange({ internet: v })}
            dark={dark}
          />
          <InputValor
            label="Outras fixas"
            value={config.outrasFixes}
            onChange={(v) => onChange({ outrasFixes: v })}
            dark={dark}
          />
        </div>
      </div>
    </div>
  );
}

function Passo2({ config, onChange, dark }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: dark ? '#64748b' : '#94a3b8' }}
        >
          Faxina
        </p>
        <InputValor
          label="Valor fixo por hospedagem"
          value={config.faxina}
          onChange={(v) => onChange({ faxina: v })}
          dark={dark}
        />
      </div>
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: dark ? '#64748b' : '#94a3b8' }}
        >
          Lavanderia
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex gap-4">
            {[
              { label: 'Valor fixo por hospedagem', value: false },
              { label: 'Variável por reserva', value: true },
            ].map((op) => (
              <label
                key={op.label}
                className="flex items-center gap-2 cursor-pointer text-sm"
                style={{
                  color: dark ? '#e2e8f0' : '#0f172a',
                  fontFamily: "'Geist', sans-serif",
                }}
              >
                <input
                  type="radio"
                  checked={config.lavanderiaVariavel === op.value}
                  onChange={() => onChange({ lavanderiaVariavel: op.value })}
                />
                {op.label}
              </label>
            ))}
          </div>
          {!config.lavanderiaVariavel && (
            <InputValor
              label="Valor fixo por hospedagem"
              value={config.lavanderiaFixa}
              onChange={(v) => onChange({ lavanderiaFixa: v })}
              dark={dark}
            />
          )}
          {config.lavanderiaVariavel && (
            <p
              className="text-xs"
              style={{ color: dark ? '#64748b' : '#94a3b8' }}
            >
              Você informará o valor de cada reserva no próximo passo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Passo3({ config, onChange, porMes, dark }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4">
        {[
          { label: 'Valor fixo todo mês', value: true },
          { label: 'Variável por mês', value: false },
        ].map((op) => (
          <label
            key={op.label}
            className="flex items-center gap-2 cursor-pointer text-sm"
            style={{
              color: dark ? '#e2e8f0' : '#0f172a',
              fontFamily: "'Geist', sans-serif",
            }}
          >
            <input
              type="radio"
              checked={config.energiaTipoFixo === op.value}
              onChange={() => onChange({ energiaTipoFixo: op.value })}
            />
            {op.label}
          </label>
        ))}
      </div>

      {config.energiaTipoFixo ? (
        <InputValor
          label="Valor fixo mensal"
          value={config.energiaFixa}
          onChange={(v) => onChange({ energiaFixa: v })}
          dark={dark}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {porMes.map((mes) => (
            <InputValor
              key={mes.mes}
              label={mes.label}
              value={config.energiaPorMes[mes.mes] || ''}
              onChange={(v) =>
                onChange({
                  energiaPorMes: { ...config.energiaPorMes, [mes.mes]: v },
                })
              }
              dark={dark}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Passo4({ config, onChange, reservas, dark }) {
  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-xs"
        style={{
          color: dark ? '#64748b' : '#94a3b8',
          fontFamily: "'Geist', sans-serif",
        }}
      >
        Informe o valor da lavanderia para cada hospedagem. Deixe em branco se
        não houver.
      </p>
      <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
        <table
          className="w-full text-sm"
          style={{ fontFamily: "'Geist', sans-serif" }}
        >
          <thead
            className="sticky top-0"
            style={{ background: dark ? '#0f172a' : '#f8fafc' }}
          >
            <tr
              style={{
                borderBottom: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
              }}
            >
              {['Hóspede', 'Check-in', 'Noites', 'Lavanderia'].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-xs font-medium uppercase tracking-wider"
                  style={{ color: dark ? '#475569' : '#94a3b8' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservas.map((r, i) => (
              <tr
                key={r.codigo}
                style={{
                  borderBottom: `1px solid ${dark ? '#1e293b' : '#f8fafc'}`,
                }}
              >
                <td
                  className="px-3 py-2 font-medium"
                  style={{ color: dark ? '#e2e8f0' : '#0f172a' }}
                >
                  {r.hospede}
                </td>
                <td
                  className="px-3 py-2"
                  style={{
                    color: dark ? '#94a3b8' : '#64748b',
                    fontFamily: "'Geist Mono', monospace",
                  }}
                >
                  {r.dataInicio ? format(r.dataInicio, 'dd/MM/yyyy') : '-'}
                </td>
                <td
                  className="px-3 py-2 text-center"
                  style={{ color: dark ? '#94a3b8' : '#64748b' }}
                >
                  {r.noites}
                </td>
                <td className="px-3 py-2">
                  <div
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 border w-28"
                    style={{
                      background: dark ? '#0f172a' : '#f8fafc',
                      borderColor: dark ? '#334155' : '#e2e8f0',
                    }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: dark ? '#475569' : '#94a3b8' }}
                    >
                      R$
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={config.lavanderiaPorReserva[r.codigo] || ''}
                      onChange={(e) =>
                        onChange({
                          lavanderiaPorReserva: {
                            ...config.lavanderiaPorReserva,
                            [r.codigo]: e.target.value,
                          },
                        })
                      }
                      placeholder="0,00"
                      className="flex-1 bg-transparent border-0 outline-none text-xs w-full"
                      style={{
                        color: dark ? '#f1f5f9' : '#0f172a',
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PASSOS = [
  { titulo: 'Despesas fixas', subtitulo: 'IPTU, condomínio e outras' },
  { titulo: 'Por hospedagem', subtitulo: 'Faxina e lavanderia' },
  { titulo: 'Energia', subtitulo: 'Conta de luz por mês' },
  { titulo: 'Lavanderia', subtitulo: 'Valor por reserva' },
];

export function ConfiguracaoWizard({
  reservas,
  porMes,
  config,
  onChange,
  onConcluir,
  onPular,
  dark,
}) {
  const passos = config.lavanderiaVariavel ? PASSOS : PASSOS.slice(0, 3);
  const [passo, setPasso] = useState(0);
  const isUltimo = passo === passos.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-xl rounded-2xl flex flex-col"
        style={{
          background: dark ? '#0f172a' : '#ffffff',
          border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
          maxHeight: '85vh',
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: dark ? '#1e293b' : '#e2e8f0' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-base font-semibold"
              style={{ color: dark ? '#f1f5f9' : '#0f172a' }}
            >
              Configuração financeira
            </h2>
            <button
              onClick={onPular}
              className="text-xs cursor-pointer bg-transparent border-0"
              style={{ color: dark ? '#475569' : '#94a3b8' }}
            >
              pular tudo →
            </button>
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2">
            {passos.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
                    style={{
                      background:
                        i < passo
                          ? '#2563eb'
                          : i === passo
                            ? '#2563eb'
                            : dark
                              ? '#1e293b'
                              : '#f1f5f9',
                      color:
                        i <= passo ? '#ffffff' : dark ? '#475569' : '#94a3b8',
                    }}
                  >
                    {i < passo ? '✓' : i + 1}
                  </div>
                  <span
                    className="text-xs hidden md:block"
                    style={{
                      color:
                        i === passo
                          ? dark
                            ? '#f1f5f9'
                            : '#0f172a'
                          : dark
                            ? '#475569'
                            : '#94a3b8',
                    }}
                  >
                    {p.titulo}
                  </span>
                </div>
                {i < passos.length - 1 && (
                  <div
                    className="w-6 h-px"
                    style={{ background: dark ? '#1e293b' : '#e2e8f0' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p
            className="text-xs mb-4"
            style={{ color: dark ? '#64748b' : '#94a3b8' }}
          >
            {passos[passo].subtitulo}
          </p>
          {passo === 0 && (
            <Passo1 config={config} onChange={onChange} dark={dark} />
          )}
          {passo === 1 && (
            <Passo2 config={config} onChange={onChange} dark={dark} />
          )}
          {passo === 2 && (
            <Passo3
              config={config}
              onChange={onChange}
              porMes={porMes}
              dark={dark}
            />
          )}
          {passo === 3 && (
            <Passo4
              config={config}
              onChange={onChange}
              reservas={reservas}
              dark={dark}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t flex-shrink-0"
          style={{ borderColor: dark ? '#1e293b' : '#e2e8f0' }}
        >
          <button
            onClick={() => setPasso((p) => Math.max(0, p - 1))}
            disabled={passo === 0}
            className="text-sm px-4 py-2 rounded-lg cursor-pointer border-0"
            style={{
              background: dark ? '#1e293b' : '#f1f5f9',
              color:
                passo === 0
                  ? dark
                    ? '#334155'
                    : '#cbd5e1'
                  : dark
                    ? '#94a3b8'
                    : '#64748b',
              opacity: passo === 0 ? 0.5 : 1,
            }}
          >
            ← voltar
          </button>
          <button
            onClick={() => (isUltimo ? onConcluir() : setPasso((p) => p + 1))}
            className="text-sm px-4 py-2 rounded-lg font-medium cursor-pointer border-0"
            style={{ background: '#2563eb', color: '#ffffff' }}
          >
            {isUltimo ? 'Ver preview →' : 'próximo →'}
          </button>
        </div>
      </div>
    </div>
  );
}
