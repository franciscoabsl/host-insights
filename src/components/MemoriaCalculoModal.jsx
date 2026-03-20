import { useTheme } from '../context/ThemeContext';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function Linha({ label, value, tipo = 'normal', destaque = false }) {
  const { dark } = useTheme();

  const cores = {
    normal: dark ? '#e2e8f0' : '#0f172a',
    deducao: '#ef4444',
    resultado: '#2563eb',
    total: '#22c55e',
    formula: dark ? '#94a3b8' : '#64748b',
  };

  return (
    <div
      className="flex items-center justify-between py-2"
      style={{
        borderBottom: `1px solid ${dark ? '#1e293b' : '#f1f5f9'}`,
        background: destaque
          ? dark
            ? '#1e3a5f22'
            : '#dbeafe33'
          : 'transparent',
        padding: destaque ? '8px 12px' : '8px 0',
        borderRadius: destaque ? '8px' : 0,
        marginTop: destaque ? '4px' : 0,
      }}
    >
      <span
        className="text-sm"
        style={{
          color: cores[tipo],
          fontFamily: "'Geist', sans-serif",
          fontWeight: destaque ? 600 : 400,
        }}
      >
        {label}
      </span>
      {value !== undefined && (
        <span
          className="text-sm font-medium"
          style={{ color: cores[tipo], fontFamily: "'Geist Mono', monospace" }}
        >
          {typeof value === 'string' ? value : formatCurrency(value)}
        </span>
      )}
    </div>
  );
}

function Separador() {
  const { dark } = useTheme();
  return (
    <div className="flex justify-end py-1">
      <div
        className="w-48 border-t"
        style={{ borderColor: dark ? '#334155' : '#cbd5e1' }}
      />
    </div>
  );
}

export function MemoriaCalculoModal({ mes, onFechar }) {
  const { dark } = useTheme();

  if (!mes) return null;

  const aliquotaPct =
    mes.faixaLabel === 'Isento' ? 0 : parseFloat(mes.faixaLabel);
  const deducaoFaixa =
    {
      Isento: 0,
      '7,5%': 169.44,
      '15%': 381.44,
      '22,5%': 662.77,
      '27,5%': 896.0,
    }[mes.faixaLabel] || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl flex flex-col"
        style={{
          background: dark ? '#0f172a' : '#ffffff',
          border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: dark ? '#1e293b' : '#e2e8f0' }}
        >
          <div>
            <h2
              className="text-base font-semibold"
              style={{ color: dark ? '#f1f5f9' : '#0f172a' }}
            >
              Memória de cálculo
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: dark ? '#64748b' : '#94a3b8' }}
            >
              Carnê-Leão — {mes.label}
            </p>
          </div>
          <button
            onClick={onFechar}
            className="text-xl cursor-pointer bg-transparent border-0 leading-none"
            style={{ color: dark ? '#475569' : '#94a3b8' }}
          >
            ✕
          </button>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-5 flex flex-col gap-1">
          {/* Base de cálculo */}
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: dark ? '#64748b' : '#94a3b8' }}
          >
            1. Base de cálculo
          </p>
          <Linha label="Receita líquida do mês" value={mes.receita} />
          {mes.despesasDedutiveisIR > 0 && (
            <Linha
              label="(-) IPTU + Condomínio"
              value={-mes.despesasDedutiveisIR}
              tipo="deducao"
            />
          )}
          {/* <Separador /> */}
          <Linha
            label="(=) Base de cálculo IR"
            value={mes.baseIR}
            tipo="resultado"
            destaque
          />

          <div className="mt-4 mb-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: dark ? '#64748b' : '#94a3b8' }}
            >
              2. Faixa aplicável
            </p>
            <div
              className="rounded-lg px-4 py-3"
              style={{
                background: mes.faixaCor + '18',
                border: `1px solid ${mes.faixaCor}44`,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color: mes.faixaCor }}
                >
                  Faixa {mes.faixaLabel}
                </span>
                {mes.faixaLabel !== 'Isento' && (
                  <span
                    className="text-xs"
                    style={{ color: dark ? '#94a3b8' : '#64748b' }}
                  >
                    Dedução fixa: {formatCurrency(deducaoFaixa)}
                  </span>
                )}
              </div>
              {mes.faixaLabel !== 'Isento' && (
                <p
                  className="text-xs mt-1"
                  style={{ color: dark ? '#64748b' : '#94a3b8' }}
                >
                  {mes.faixaLabel === '27,5%'
                    ? 'Base de cálculo acima de R$ 4.664,68'
                    : `Base de cálculo entre R$ ${{ '7,5%': '2.259,21 a 2.826,65', '15%': '2.826,66 a 3.751,05', '22,5%': '3.751,06 a 4.664,68' }[mes.faixaLabel]}`}
                </p>
              )}
            </div>
          </div>

          {/* Cálculo */}
          {mes.faixaLabel !== 'Isento' && (
            <>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2 mt-2"
                style={{ color: dark ? '#64748b' : '#94a3b8' }}
              >
                3. Cálculo
              </p>
              <Linha
                label={`${formatCurrency(mes.baseIR)} × ${mes.faixaLabel}`}
                value={mes.baseIR * (aliquotaPct / 100)}
                tipo="normal"
              />
              <Linha
                label="(-) Dedução da faixa"
                value={-deducaoFaixa}
                tipo="deducao"
              />
              {/* <Separador /> */}
            </>
          )}

          <Linha
            label="(=) Carnê-Leão devido"
            value={mes.carneLeao}
            tipo="total"
            destaque
          />

          {mes.faixaLabel === 'Isento' && (
            <p
              className="text-xs mt-2 text-center"
              style={{ color: dark ? '#64748b' : '#94a3b8' }}
            >
              Base de cálculo abaixo do limite de isenção (R$ 2.259,20)
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t"
          style={{ borderColor: dark ? '#1e293b' : '#e2e8f0' }}
        >
          <p
            className="text-xs text-center"
            style={{ color: dark ? '#475569' : '#94a3b8' }}
          >
            Tabela progressiva IR 2025 · Valores estimados para fins de
            planejamento
          </p>
        </div>
      </div>
    </div>
  );
}
