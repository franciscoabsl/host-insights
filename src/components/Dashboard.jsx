import { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { Secao } from './Secao';
import { NavegacaoDashboard } from './NavegacaoDashboard';
import { ResumoCards } from './cards/ResumoCards';
import { ReceitaMensal } from './charts/ReceitaMensal';
import { OcupacaoMensal } from './charts/OcupacaoMensal';
import { DistribuicaoFinanceira } from './charts/DistribuicaoFinanceira';
import { DistribuicaoDuracao } from './charts/DistribuicaoDuracao';
import { HeatmapCalendario } from './charts/HeatmapCalendario';
import { TabelaReservas } from './TabelaReservas';
import { InsightsPanel } from './InsightsPanel';
import { SecaoFiscal } from './SecaoFiscal';
import { useSecoes } from '../hooks/useSecoes';

function formatPeriodo(reservas) {
  if (!reservas.length) return '';
  const datas = reservas.map((r) => r.dataInicio).filter(Boolean);
  const min = new Date(Math.min(...datas));
  const max = new Date(Math.max(...datas));
  const fmt = (d) =>
    d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  if (
    min.getMonth() === max.getMonth() &&
    min.getFullYear() === max.getFullYear()
  ) {
    return fmt(min);
  }
  return `${fmt(min)} — ${fmt(max)}`;
}

export function Dashboard({ dados, onReset }) {
  const { dark } = useTheme();
  const { secoes, toggle } = useSecoes();
  const dashboardRef = useRef();

  const handleExportPdf = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf()
      .set({
        margin: 10,
        filename: `host-insights-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(dashboardRef.current)
      .save();
  };

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: "'Geist', sans-serif",
        background: dark ? '#0f172a' : '#f8fafc',
        color: dark ? '#f1f5f9' : '#0f172a',
      }}
    >
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          borderColor: dark ? '#1e293b' : '#e2e8f0',
          background: dark ? '#0f172a' : '#f8fafc',
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold tracking-tight">
                Host Insights
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: dark ? '#1e293b' : '#e2e8f0',
                  color: dark ? '#64748b' : '#94a3b8',
                }}
              >
                {formatPeriodo(dados.reservas)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExportPdf}
                className="text-sm px-4 py-2 rounded-lg font-medium cursor-pointer border-0"
                style={{ background: '#2563eb', color: '#ffffff' }}
              >
                Exportar PDF
              </button>
              <ThemeToggle />
              <button
                onClick={onReset}
                className="text-sm cursor-pointer bg-transparent border-0"
                style={{ color: dark ? '#475569' : '#94a3b8' }}
              >
                Novo arquivo
              </button>
            </div>
          </div>

          <div className="pb-3">
            <NavegacaoDashboard secoes={secoes} onToggle={toggle} />
          </div>
        </div>
      </header>

      <main
        ref={dashboardRef}
        className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-4"
      >
        {/* Resumo — sempre visível */}
        <ResumoCards resumo={dados.resumo} periodo={dados.periodo} />

        {/* Financeiro */}
        <Secao
          id="financeiro"
          titulo="Financeiro"
          icone="💰"
          aberto={secoes.financeiro}
          onToggle={() => toggle('financeiro')}
        >
          <div className="flex flex-col gap-4">
            {dados.porMes.length > 1 && <ReceitaMensal dados={dados.porMes} />}
            <DistribuicaoFinanceira dados={dados.distribuicaoFinanceira} />
          </div>
        </Secao>

        {/* Ocupação */}
        <Secao
          id="ocupacao"
          titulo="Ocupação"
          icone="🏠"
          aberto={secoes.ocupacao}
          onToggle={() => toggle('ocupacao')}
        >
          <div className="flex flex-col gap-4">
            {dados.porMes.length > 1 && <OcupacaoMensal dados={dados.porMes} />}
            <HeatmapCalendario
              reservas={dados.reservas}
              diasOcupados={dados.heatmap}
            />
          </div>
        </Secao>

        {/* Reservas */}
        <Secao
          id="reservas"
          titulo="Reservas"
          icone="📋"
          aberto={secoes.reservas}
          onToggle={() => toggle('reservas')}
        >
          <div className="flex flex-col gap-4">
            <DistribuicaoDuracao dados={dados.distribuicaoDuracao} />
            <TabelaReservas reservas={dados.reservas} />
          </div>
        </Secao>

        {/* Insights */}
        <Secao
          id="insights"
          titulo="Insights automáticos"
          icone="💡"
          aberto={secoes.insights}
          onToggle={() => toggle('insights')}
        >
          <InsightsPanel insights={dados.insights} />
        </Secao>

        {/* Fiscal */}
        <Secao
          id="fiscal"
          titulo="Análise fiscal — Carnê-Leão"
          icone="🧾"
          aberto={secoes.fiscal}
          onToggle={() => toggle('fiscal')}
        >
          <SecaoFiscal
            porMes={dados.porMes}
            reservas={dados.reservas}
            configuracao={dados.configuracao}
          />
        </Secao>
      </main>
    </div>
  );
}
