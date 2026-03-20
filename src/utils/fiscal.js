const FAIXAS_IR_2025 = [
  { limite: 2259.2, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.0 },
];

export function calcularCarneLeao(baseCalculo) {
  if (baseCalculo <= 0) return 0;
  for (const faixa of FAIXAS_IR_2025) {
    if (baseCalculo <= faixa.limite) {
      return Math.max(0, baseCalculo * faixa.aliquota - faixa.deducao);
    }
  }
  return 0;
}

export function faixaIR(baseCalculo) {
  if (baseCalculo <= 2259.2) return { label: 'Isento', cor: '#22c55e' };
  if (baseCalculo <= 2826.65) return { label: '7,5%', cor: '#84cc16' };
  if (baseCalculo <= 3751.05) return { label: '15%', cor: '#eab308' };
  if (baseCalculo <= 4664.68) return { label: '22,5%', cor: '#f97316' };
  return { label: '27,5%', cor: '#ef4444' };
}

export function calcularFiscalMensal(porMes, reservas, config) {
  const {
    iptu = 0,
    condominio = 0,
    internet = 0,
    outrasFixes = 0,
    faxina = 0,
    lavanderiaFixa = 0,
    lavanderiaVariavel = false,
    lavanderiaPorReserva = {},
    energiaPorMes = {},
    manutencaoPorMes = {},
  } = config;

  const fixasDedutiveisBase =
    (parseFloat(iptu) || 0) + (parseFloat(condominio) || 0);
  const fixasNaoDedutiveisBase =
    (parseFloat(internet) || 0) + (parseFloat(outrasFixes) || 0);
  const faxinaValor = parseFloat(faxina) || 0;
  const lavanderiaFixaValor = parseFloat(lavanderiaFixa) || 0;

  const energiaFixaValor = parseFloat(config.energiaFixa || 0);
  const energiaTipoFixo = config.energiaTipoFixo || false;

  const resultado = porMes.map((mes) => {
    const reservasDoMes = reservas.filter((r) => {
      if (!r.dataInicio) return false;
      const mesReserva = r.dataInicio.toISOString().substring(0, 7);
      return mesReserva === mes.mes;
    });

    const qtdReservas = reservasDoMes.length;
    const energia = energiaTipoFixo
      ? energiaFixaValor
      : parseFloat(energiaPorMes[mes.mes] || 0);
    const manutencao = parseFloat(manutencaoPorMes[mes.mes] || 0);

    // Lavanderia do mês
    let lavanderiaTotal = 0;
    if (lavanderiaVariavel) {
      lavanderiaTotal = reservasDoMes.reduce((s, r) => {
        return s + parseFloat(lavanderiaPorReserva[r.codigo] || 0);
      }, 0);
    } else {
      lavanderiaTotal = lavanderiaFixaValor * qtdReservas;
    }

    const faxinaTotal = faxinaValor * qtdReservas;

    // Dedutíveis para IR
    const despesasDedutiveisIR = fixasDedutiveisBase;

    // Operacionais não dedutíveis
    const despesasOperacionais =
      fixasNaoDedutiveisBase +
      energia +
      faxinaTotal +
      lavanderiaTotal +
      manutencao;

    const receitaLiquida = mes.receita;
    const baseIR = Math.max(0, receitaLiquida - despesasDedutiveisIR);
    const carneLeao = calcularCarneLeao(baseIR);
    const lucroReal =
      receitaLiquida - despesasDedutiveisIR - despesasOperacionais - carneLeao;

    const faixa = faixaIR(baseIR);

    return {
      ...mes,
      qtdReservas,
      despesasDedutiveisIR,
      despesasOperacionais,
      energia,
      faxinaTotal,
      lavanderiaTotal,
      manutencao,
      baseIR: Math.round(baseIR * 100) / 100,
      carneLeao: Math.round(carneLeao * 100) / 100,
      lucroReal: Math.round(lucroReal * 100) / 100,
      faixaLabel: faixa.label,
      faixaCor: faixa.cor,
    };
  });

  const totalReceita = resultado.reduce((s, m) => s + m.receita, 0);
  const totalTaxaAirbnb = resultado.reduce((s, m) => s + m.taxasServico, 0);
  const totalDedutiveisIR = resultado.reduce(
    (s, m) => s + m.despesasDedutiveisIR,
    0,
  );
  const totalOperacionais = resultado.reduce(
    (s, m) => s + m.despesasOperacionais,
    0,
  );
  const totalBaseIR = resultado.reduce((s, m) => s + m.baseIR, 0);
  const totalCarneLeao = resultado.reduce((s, m) => s + m.carneLeao, 0);
  const totalLucroReal = resultado.reduce((s, m) => s + m.lucroReal, 0);
  const aliquotaEfetiva =
    totalReceita > 0 ? (totalCarneLeao / totalReceita) * 100 : 0;
  const margemLiquida =
    totalReceita > 0 ? (totalLucroReal / totalReceita) * 100 : 0;
  const custoOperacionalPct =
    totalReceita > 0 ? (totalOperacionais / totalReceita) * 100 : 0;

  return {
    porMesFiscal: resultado,
    resumoFiscal: {
      totalReceita: Math.round(totalReceita * 100) / 100,
      totalTaxaAirbnb: Math.round(totalTaxaAirbnb * 100) / 100,
      totalDedutiveisIR: Math.round(totalDedutiveisIR * 100) / 100,
      totalOperacionais: Math.round(totalOperacionais * 100) / 100,
      totalBaseIR: Math.round(totalBaseIR * 100) / 100,
      totalCarneLeao: Math.round(totalCarneLeao * 100) / 100,
      totalLucroReal: Math.round(totalLucroReal * 100) / 100,
      aliquotaEfetiva: Math.round(aliquotaEfetiva * 100) / 100,
      margemLiquida: Math.round(margemLiquida * 100) / 100,
      custoOperacionalPct: Math.round(custoOperacionalPct * 100) / 100,
    },
  };
}
