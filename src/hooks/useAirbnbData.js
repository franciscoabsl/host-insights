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
import { gerarInsights } from '../utils/insights';

export function useAirbnbData() {
  const [dados, setDados] = useState(null);
  const [preview, setPreview] = useState(null);
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
      setPreview(reservas);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const gerarDashboard = (reservasFiltradas) => {
    const periodo = detectarPeriodo(reservasFiltradas);
    const resumo = calcularResumo(reservasFiltradas);
    const porMes = calcularPorMes(reservasFiltradas);
    const heatmap = calcularHeatmap(reservasFiltradas);
    const distribuicaoDuracao = calcularDistribuicaoDuracao(reservasFiltradas);
    const distribuicaoFinanceira = calcularDistribuicaoFinanceira(resumo);

    const dadosCompletos = {
      reservas: reservasFiltradas,
      periodo,
      resumo,
      porMes,
      heatmap,
      distribuicaoDuracao,
      distribuicaoFinanceira,
    };

    const insights = gerarInsights(dadosCompletos);
    setDados({ ...dadosCompletos, insights });
    setPreview(null);
  };

  const cancelarPreview = () => setPreview(null);

  const resetar = () => {
    setDados(null);
    setPreview(null);
  };

  return {
    dados,
    preview,
    loading,
    erro,
    processar,
    gerarDashboard,
    cancelarPreview,
    resetar,
  };
}
