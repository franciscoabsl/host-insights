import {
  eachDayOfInterval,
  format,
  getDaysInMonth,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function detectarPeriodo(reservas) {
  const meses = new Set(reservas.map((r) => format(r.dataInicio, 'yyyy-MM')));
  const qtd = meses.size;
  if (qtd <= 1) return 'mensal';
  if (qtd <= 12) return 'anual';
  return 'multi-ano';
}

export function calcularResumo(reservas) {
  const receitaLiquida = reservas.reduce((s, r) => s + r.valor, 0);
  const ganhosBrutos = reservas.reduce((s, r) => s + r.ganhosBrutos, 0);
  const taxasServico = reservas.reduce((s, r) => s + r.taxaServico, 0);
  const taxasLimpeza = reservas.reduce((s, r) => s + r.taxaLimpeza, 0);
  const totalNoites = reservas.reduce((s, r) => s + r.noites, 0);
  const totalReservas = reservas.length;

  const antecedencias = reservas
    .filter((r) => r.dataReserva && r.dataInicio)
    .map((r) =>
      Math.round((r.dataInicio - r.dataReserva) / (1000 * 60 * 60 * 24)),
    );

  const antecedenciaMedia =
    antecedencias.length > 0
      ? Math.round(
          antecedencias.reduce((s, v) => s + v, 0) / antecedencias.length,
        )
      : 0;

  return {
    receitaLiquida,
    ganhosBrutos,
    taxasServico,
    taxasLimpeza,
    totalNoites,
    totalReservas,
    ticketMedioReserva: totalReservas > 0 ? receitaLiquida / totalReservas : 0,
    ticketMedioNoite: totalNoites > 0 ? receitaLiquida / totalNoites : 0,
    antecedenciaMedia,
  };
}

export function calcularPorMes(reservas) {
  const meses = {};

  for (const r of reservas) {
    const mes = format(r.dataInicio, 'yyyy-MM');
    if (!meses[mes]) {
      meses[mes] = {
        mes,
        label: format(r.dataInicio, 'MMM/yy', { locale: ptBR }),
        receita: 0,
        ganhosBrutos: 0,
        taxasServico: 0,
        taxasLimpeza: 0,
        noites: 0,
        reservas: 0,
        diasOcupados: new Set(),
      };
    }
    meses[mes].receita += r.valor;
    meses[mes].ganhosBrutos += r.ganhosBrutos;
    meses[mes].taxasServico += r.taxaServico;
    meses[mes].taxasLimpeza += r.taxaLimpeza;
    meses[mes].noites += r.noites;
    meses[mes].reservas += 1;

    // Marca dias ocupados
    if (r.dataInicio && r.dataFim) {
      const dias = eachDayOfInterval({
        start: r.dataInicio,
        end: new Date(r.dataFim - 1),
      });
      dias.forEach((d) => meses[mes].diasOcupados.add(format(d, 'yyyy-MM-dd')));
    }
  }

  return Object.values(meses)
    .sort((a, b) => a.mes.localeCompare(b.mes))
    .map((m) => {
      const inicio = startOfMonth(new Date(m.mes + '-01'));
      const totalDias = getDaysInMonth(inicio);
      const ocupados = m.diasOcupados.size;
      return {
        ...m,
        diasOcupados: ocupados,
        totalDias,
        taxaOcupacao: Math.round((ocupados / totalDias) * 100),
      };
    });
}

export function calcularHeatmap(reservas) {
  const diasOcupados = new Set();

  for (const r of reservas) {
    if (r.dataInicio && r.dataFim) {
      const dias = eachDayOfInterval({
        start: r.dataInicio,
        end: new Date(r.dataFim - 1),
      });
      dias.forEach((d) => diasOcupados.add(format(d, 'yyyy-MM-dd')));
    }
  }

  return diasOcupados;
}

export function calcularDistribuicaoDuracao(reservas) {
  const grupos = {
    '1-3 noites': 0,
    '4-7 noites': 0,
    '8-14 noites': 0,
    '15+ noites': 0,
  };

  for (const r of reservas) {
    if (r.noites <= 3) grupos['1-3 noites']++;
    else if (r.noites <= 7) grupos['4-7 noites']++;
    else if (r.noites <= 14) grupos['8-14 noites']++;
    else grupos['15+ noites']++;
  }

  return Object.entries(grupos).map(([name, value]) => ({ name, value }));
}

export function calcularDistribuicaoFinanceira(resumo) {
  return [
    { name: 'Ganho líquido', value: Math.round(resumo.receitaLiquida) },
    { name: 'Taxa serviço', value: Math.round(resumo.taxasServico) },
    { name: 'Taxa limpeza', value: Math.round(resumo.taxasLimpeza) },
  ];
}
