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

  const seen = new Set();
  const unicas = [];

  for (const r of linhasReserva) {
    const cod = r['Código de Confirmação'];
    if (cod && !seen.has(cod)) {
      seen.add(cod);
      unicas.push({
        codigo: cod,
        dataReserva: parseData(r['Data da reserva']),
        dataInicio: parseData(r['Data de início']),
        dataFim: parseData(r['Data de término']),
        noites: parseInt(r['Noites']) || 0,
        hospede: r['Hóspede'] || '',
        anuncio: r['Anúncio'] || '',
        valor: parseFloat(r['Valor']) || 0,
        taxaServico: parseFloat(r['Taxa de serviço']) || 0,
        taxaLimpeza: parseFloat(r['Taxa de limpeza']) || 0,
        ganhosBrutos: parseFloat(r['Ganhos brutos']) || 0,
      });
    }
  }

  return unicas.sort((a, b) => a.dataInicio - b.dataInicio);
}

function parseData(str) {
  if (!str) return null;
  const [m, d, y] = str.split('/');
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
}
