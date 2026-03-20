import { useState } from 'react';
import { parseCsvAirbnb } from '../utils/parseCsv';
import {
  detectarPeriodo,
  calcularResumo,
  calcularPorMes,
  calcularHeatmap,
  calcularDistribuicaoDuracao,
  calcularDistribuicaoFinanceira,
} from '../utils/calculos';

export function useAirbnbData() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const processar = async (file) => {
    setLoading(true);
    setErro(null);
    try {
      const reservas = await parseCsvAirbnb(file);

      if (reservas.length === 0) {
        throw new Error('Nenhuma reserva encontrada no arquivo.');
      }

      const periodo = detectarPeriodo(reservas);
      const resumo = calcularResumo(reservas);
      const porMes = calcularPorMes(reservas);
      const heatmap = calcularHeatmap(reservas);
      const distribuicaoDuracao = calcularDistribuicaoDuracao(reservas);
      const distribuicaoFinanceira = calcularDistribuicaoFinanceira(resumo);

      setDados({
        reservas,
        periodo,
        resumo,
        porMes,
        heatmap,
        distribuicaoDuracao,
        distribuicaoFinanceira,
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetar = () => setDados(null);

  return { dados, loading, erro, processar, resetar };
}
