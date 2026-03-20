function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function gerarInsights(dados) {
  const { resumo, porMes, reservas, distribuicaoDuracao } = dados;
  const insights = [];

  if (porMes.length > 1) {
    // Melhor mês
    const melhor = porMes.reduce((a, b) => (a.receita > b.receita ? a : b));
    const mediaReceita = resumo.receitaLiquida / porMes.length;
    const pctAcima = Math.round(
      ((melhor.receita - mediaReceita) / mediaReceita) * 100,
    );
    insights.push({
      tipo: 'positivo',
      icone: '💰',
      titulo: 'Melhor mês',
      texto: `${melhor.label} foi seu melhor mês com ${formatCurrency(melhor.receita)} — ${pctAcima}% acima da média mensal.`,
    });

    // Pior mês
    const pior = porMes.reduce((a, b) => (a.receita < b.receita ? a : b));
    insights.push({
      tipo: 'atencao',
      icone: '📉',
      titulo: 'Mês mais fraco',
      texto: `${pior.label} teve a menor receita com ${formatCurrency(pior.receita)} e ${pior.taxaOcupacao}% de ocupação.`,
    });

    // Taxa de ocupação
    const mediaOcupacao = Math.round(
      porMes.reduce((s, m) => s + m.taxaOcupacao, 0) / porMes.length,
    );
    const mesesAcimaMeta = porMes.filter((m) => m.taxaOcupacao >= 70).length;
    insights.push({
      tipo: mediaOcupacao >= 70 ? 'positivo' : 'atencao',
      icone: '🎯',
      titulo: 'Taxa de ocupação',
      texto: `Sua ocupação média é ${mediaOcupacao}% — você atingiu a meta de 70% em ${mesesAcimaMeta} de ${porMes.length} meses.`,
    });
  }

  // Duração vs receita
  const totalReservas = distribuicaoDuracao.reduce((s, d) => s + d.value, 0);
  const curtasQtd =
    distribuicaoDuracao.find((d) => d.name === '1-3 noites')?.value || 0;
  const curtasPct = Math.round((curtasQtd / totalReservas) * 100);

  const receitaCurtas = reservas
    .filter((r) => r.noites <= 3)
    .reduce((s, r) => s + r.valor, 0);
  const receitaCurtasPct = Math.round(
    (receitaCurtas / resumo.receitaLiquida) * 100,
  );

  if (curtasPct > 30) {
    insights.push({
      tipo: curtasPct > receitaCurtasPct ? 'atencao' : 'neutro',
      icone: '⚡',
      titulo: 'Reservas curtas',
      texto: `Estadias de 1-3 noites representam ${curtasPct}% das reservas mas apenas ${receitaCurtasPct}% da receita. Estadias mais longas são mais rentáveis.`,
    });
  }

  // Antecedência
  if (resumo.antecedenciaMedia > 0) {
    insights.push({
      tipo: 'neutro',
      icone: '📅',
      titulo: 'Antecedência de reserva',
      texto: `Seus hóspedes reservam com média de ${resumo.antecedenciaMedia} dias de antecedência. ${resumo.antecedenciaMedia > 45 ? 'Você tem boa previsibilidade de agenda.' : 'Considere incentivar reservas com mais antecedência.'}`,
    });
  }

  // Hóspedes recorrentes
  const hospedesMap = {};
  for (const r of reservas) {
    hospedesMap[r.hospede] = (hospedesMap[r.hospede] || 0) + 1;
  }
  const recorrentes = Object.values(hospedesMap).filter((v) => v > 1).length;
  const taxaRetorno = Math.round(
    (recorrentes / Object.keys(hospedesMap).length) * 100,
  );

  insights.push({
    tipo: recorrentes > 0 ? 'positivo' : 'neutro',
    icone: '🔁',
    titulo: 'Hóspedes recorrentes',
    texto:
      recorrentes > 0
        ? `${recorrentes} hóspede${recorrentes > 1 ? 's retornaram' : ' retornou'} para uma nova estadia — taxa de retorno de ${taxaRetorno}%.`
        : 'Nenhum hóspede retornou ainda. Incentive avaliações positivas para aumentar a recorrência.',
  });

  return insights;
}
