import { useTheme } from '../../context/ThemeContext';

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function Card({ label, value, sub, accent }) {
  const { dark } = useTheme();
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
      }}
    >
      <p
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: dark ? '#64748b' : '#94a3b8' }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-semibold tracking-tight"
        style={{
          color: accent || (dark ? '#f1f5f9' : '#0f172a'),
          fontFamily: "'Geist', sans-serif",
        }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: dark ? '#475569' : '#94a3b8' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function ResumoCards({ resumo, periodo }) {
  const melhorLabel = periodo === 'mensal' ? 'este mês' : 'no período';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card
        label="Receita líquida"
        value={formatCurrency(resumo.receitaLiquida)}
        sub={melhorLabel}
        accent="#2563eb"
      />
      <Card
        label="Total de reservas"
        value={resumo.totalReservas}
        sub={`${resumo.totalNoites} noites`}
      />
      <Card
        label="Ticket médio"
        value={formatCurrency(resumo.ticketMedioReserva)}
        sub="por reserva"
      />
      <Card
        label="Ticket por noite"
        value={formatCurrency(resumo.ticketMedioNoite)}
        sub="média"
      />
      <Card
        label="Ganhos brutos"
        value={formatCurrency(resumo.ganhosBrutos)}
        sub="antes das taxas"
      />
      <Card
        label="Taxas Airbnb"
        value={formatCurrency(resumo.taxasServico)}
        sub={`${((resumo.taxasServico / resumo.ganhosBrutos) * 100).toFixed(1)}% da receita`}
      />
      <Card
        label="Taxa de limpeza"
        value={formatCurrency(resumo.taxasLimpeza)}
        sub="cobrada ao hóspede"
      />
      <Card
        label="Antecedência média"
        value={`${resumo.antecedenciaMedia} dias`}
        sub="entre reserva e check-in"
      />
    </div>
  );
}
