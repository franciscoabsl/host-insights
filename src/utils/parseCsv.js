import Papa from 'papaparse';

export function parseCsvAirbnb(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        try {
          const rows = results.data;
          const reservas = extrairReservas(rows);
          resolve(reservas);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err),
    });
  });
}

function extrairReservas(rows) {
  const linhasReserva = rows.filter((r) => r['Tipo'] === 'Reserva');

  const agrupadas = {};

  for (const r of linhasReserva) {
    const cod = r['Código de Confirmação'];
    if (!cod) continue;

    if (!agrupadas[cod]) {
      agrupadas[cod] = {
        codigo: cod,
        dataReserva: parseData(r['Data da reserva']),
        dataInicio: parseData(r['Data de início']),
        dataFim: parseData(r['Data de término']),
        noites: parseInt(r['Noites']) || 0,
        hospede: r['Hóspede'] || '',
        anuncio: r['Anúncio'] || '',
        valor: 0,
        taxaServico: 0,
        taxaLimpeza: 0,
        ganhosBrutos: 0,
      };
    }

    // Soma os valores de todas as linhas do mesmo código
    agrupadas[cod].valor += parseFloat(r['Valor']) || 0;
    agrupadas[cod].taxaServico += parseFloat(r['Taxa de serviço']) || 0;
    agrupadas[cod].taxaLimpeza += parseFloat(r['Taxa de limpeza']) || 0;
    agrupadas[cod].ganhosBrutos += parseFloat(r['Ganhos brutos']) || 0;
  }

  // Arredonda para evitar floating point
  return Object.values(agrupadas)
    .map((r) => ({
      ...r,
      valor: Math.round(r.valor * 100) / 100,
      taxaServico: Math.round(r.taxaServico * 100) / 100,
      taxaLimpeza: Math.round(r.taxaLimpeza * 100) / 100,
      ganhosBrutos: Math.round(r.ganhosBrutos * 100) / 100,
    }))
    .sort((a, b) => a.dataInicio - b.dataInicio);
}

function parseData(str) {
  if (!str) return null;
  const [m, d, y] = str.split('/');
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
}
