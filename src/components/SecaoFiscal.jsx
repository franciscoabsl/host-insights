import { useTheme } from '../context/ThemeContext';
import { calcularFiscalMensal, faixaIR } from '../utils/fiscal';
import { useState } from 'react';
import { MemoriaCalculoModal } from './MemoriaCalculoModal';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatPct(value) {
  return `${(value || 0).toFixed(1)}%`;
}

function DreLinha({ label, value, tipo = 'normal', indent = false }) {
  const { dark } = useTheme();
  const cores = {
    normal: dark ? '#e2e8f0' : '#0f172a',
    deducao: '#ef4444',
    resultado: '#2563eb',
    lucro: '#22c55e',
    subtotal: dark ? '#94a3b8' : '#64748b',
  };

  return (
    <div
      className="flex items-center justify-between py-2"
      style={{ borderBottom: `1px solid ${dark ? '#1e293b' : '#f1f5f9'}` }}
    >
      <span
        className="text-sm"
        style={{
          color: cores[tipo],
          fontFamily: "'Geist', sans-serif",
          paddingLeft: indent ? '1rem' : 0,
          fontWeight: tipo === 'resultado' || tipo === 'lucro' ? 600 : 400,
        }}
      >
        {label}
      </span>
      <span
        className="text-sm font-medium"
        style={{ color: cores[tipo], fontFamily: "'Geist Mono', monospace" }}
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
}

export function SecaoFiscal({ porMes, reservas, configuracao }) {
  const [mesSelecionado, setMesSelecionado] = useState(null);
  const { dark } = useTheme();

  const { porMesFiscal, resumoFiscal } = calcularFiscalMensal(
    porMes,
    reservas,
    configuracao,
  );

  const temConfiguracao =
    configuracao.iptu ||
    configuracao.condominio ||
    configuracao.internet ||
    configuracao.faxina ||
    configuracao.lavanderiaFixa ||
    Object.values(configuracao.energiaPorMes || {}).some(Boolean);

  return (
    <div
      className="flex flex-col gap-6"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      {!temConfiguracao && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{
            background: dark ? '#1e293b' : '#fffbeb',
            border: `1px solid ${dark ? '#334155' : '#fde68a'}`,
            color: dark ? '#94a3b8' : '#92400e',
          }}
        >
          Configure as despesas no modal de upload para ver os cálculos fiscais
          completos. Os valores abaixo consideram apenas a receita sem deduções.
        </div>
      )}

      {/* Cards de indicadores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Carnê-Leão',
            value: formatCurrency(resumoFiscal.totalCarneLeao),
            cor: '#ef4444',
          },
          {
            label: 'Alíquota efetiva',
            value: formatPct(resumoFiscal.aliquotaEfetiva),
            cor: '#f97316',
          },
          {
            label: 'Margem líquida',
            value: formatPct(resumoFiscal.margemLiquida),
            cor: '#22c55e',
          },
          {
            label: 'Lucro real total',
            value: formatCurrency(resumoFiscal.totalLucroReal),
            cor: '#2563eb',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{
              background: dark ? '#1e293b' : '#ffffff',
              border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
            }}
          >
            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: dark ? '#475569' : '#94a3b8' }}
            >
              {card.label}
            </p>
            <p className="text-xl font-semibold" style={{ color: card.cor }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* DRE */}
      <div
        className="rounded-xl p-6"
        style={{
          background: dark ? '#1e293b' : '#ffffff',
          border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        }}
      >
        <h3
          className="text-sm font-medium mb-4"
          style={{ color: dark ? '#94a3b8' : '#64748b' }}
        >
          Demonstrativo de resultado — DRE simplificado
        </h3>
        <div className="flex flex-col">
          <DreLinha
            label="(+) Receita bruta total"
            value={resumoFiscal.totalReceita}
            tipo="normal"
          />
          <DreLinha
            label="(-) Taxa de serviço Airbnb"
            value={-resumoFiscal.totalTaxaAirbnb}
            tipo="deducao"
            indent
          />
          <DreLinha
            label="(=) Receita líquida"
            value={resumoFiscal.totalReceita - resumoFiscal.totalTaxaAirbnb}
            tipo="resultado"
          />
          <DreLinha
            label="(-) Despesas dedutíveis IR (IPTU + Condomínio)"
            value={-resumoFiscal.totalDedutiveisIR}
            tipo="deducao"
            indent
          />
          <DreLinha
            label="(=) Base de cálculo IR"
            value={resumoFiscal.totalBaseIR}
            tipo="resultado"
          />
          <DreLinha
            label="(-) Carnê-Leão estimado"
            value={-resumoFiscal.totalCarneLeao}
            tipo="deducao"
            indent
          />
          <DreLinha
            label="(=) Resultado após IR"
            value={resumoFiscal.totalBaseIR - resumoFiscal.totalCarneLeao}
            tipo="resultado"
          />
          <DreLinha
            label="(-) Demais despesas operacionais"
            value={-resumoFiscal.totalOperacionais}
            tipo="deducao"
            indent
          />
          <DreLinha
            label="(=) Lucro operacional real"
            value={resumoFiscal.totalLucroReal}
            tipo="lucro"
          />
        </div>
      </div>

      {/* Tabela mensal */}
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
            style={{ color: dark ? '#94a3b8' : '#64748b' }}
          >
            Resumo mensal completo
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
                  background: dark ? '#0f172a' : '#f8fafc',
                  borderBottom: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                }}
              >
                {[
                  'Mês',
                  'Receita',
                  'Ded. IR',
                  'Base IR',
                  'Faixa',
                  'Carnê-Leão',
                  'Custo Op.',
                  'Lucro real',
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: dark ? '#475569' : '#94a3b8' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {porMesFiscal.map((mes, i) => (
                <tr
                  key={mes.mes}
                  style={{
                    borderBottom:
                      i < porMesFiscal.length - 1
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
                    className="px-4 py-3 font-medium"
                    style={{
                      color: dark ? '#e2e8f0' : '#0f172a',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {mes.label}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: '#2563eb',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {formatCurrency(mes.receita)}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: dark ? '#94a3b8' : '#64748b',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {formatCurrency(mes.despesasDedutiveisIR)}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: dark ? '#94a3b8' : '#64748b',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {formatCurrency(mes.baseIR)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: mes.faixaCor + '22',
                        color: mes.faixaCor,
                      }}
                    >
                      {mes.faixaLabel}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 font-medium cursor-pointer"
                    style={{
                      color: '#ef4444',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                    onClick={() => setMesSelecionado(mes)}
                    title="Clique para ver a memória de cálculo"
                  >
                    <span className="flex items-center gap-1 hover:underline">
                      {formatCurrency(mes.carneLeao)}
                      <span className="text-xs opacity-50">↗</span>
                    </span>
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{
                      color: dark ? '#94a3b8' : '#64748b',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {formatCurrency(mes.despesasOperacionais)}
                  </td>
                  <td
                    className="px-4 py-3 font-medium"
                    style={{
                      color: mes.lucroReal >= 0 ? '#22c55e' : '#ef4444',
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {formatCurrency(mes.lucroReal)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr
                style={{
                  borderTop: `2px solid ${dark ? '#334155' : '#e2e8f0'}`,
                }}
              >
                <td
                  className="px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: dark ? '#64748b' : '#94a3b8' }}
                >
                  Total
                </td>
                <td
                  className="px-4 py-3 font-semibold"
                  style={{
                    color: '#2563eb',
                    fontFamily: "'Geist Mono', monospace",
                  }}
                >
                  {formatCurrency(resumoFiscal.totalReceita)}
                </td>
                <td
                  className="px-4 py-3 font-semibold"
                  style={{
                    color: dark ? '#94a3b8' : '#64748b',
                    fontFamily: "'Geist Mono', monospace",
                  }}
                >
                  {formatCurrency(resumoFiscal.totalDedutiveisIR)}
                </td>
                <td
                  className="px-4 py-3 font-semibold"
                  style={{
                    color: dark ? '#94a3b8' : '#64748b',
                    fontFamily: "'Geist Mono', monospace",
                  }}
                >
                  {formatCurrency(resumoFiscal.totalBaseIR)}
                </td>
                <td className="px-4 py-3" />
                <td
                  className="px-4 py-3 font-semibold"
                  style={{
                    color: '#ef4444',
                    fontFamily: "'Geist Mono', monospace",
                  }}
                >
                  {formatCurrency(resumoFiscal.totalCarneLeao)}
                </td>
                <td
                  className="px-4 py-3 font-semibold"
                  style={{
                    color: dark ? '#94a3b8' : '#64748b',
                    fontFamily: "'Geist Mono', monospace",
                  }}
                >
                  {formatCurrency(resumoFiscal.totalOperacionais)}
                </td>
                <td
                  className="px-4 py-3 font-semibold"
                  style={{
                    color:
                      resumoFiscal.totalLucroReal >= 0 ? '#22c55e' : '#ef4444',
                    fontFamily: "'Geist Mono', monospace",
                  }}
                >
                  {formatCurrency(resumoFiscal.totalLucroReal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      {mesSelecionado && (
        <MemoriaCalculoModal
          mes={mesSelecionado}
          onFechar={() => setMesSelecionado(null)}
        />
      )}
    </div>
  );
}
