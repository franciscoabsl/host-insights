import { useState, useEffect } from 'react';

const SECOES_PADRAO = {
  financeiro: true,
  ocupacao: true,
  reservas: false,
  insights: true,
  fiscal: false,
};

export function useSecoes() {
  const [secoes, setSecoes] = useState(() => {
    try {
      const salvo = localStorage.getItem('host-insights-secoes');
      return salvo ? JSON.parse(salvo) : SECOES_PADRAO;
    } catch {
      return SECOES_PADRAO;
    }
  });

  useEffect(() => {
    localStorage.setItem('host-insights-secoes', JSON.stringify(secoes));
  }, [secoes]);

  const toggle = (id) => {
    setSecoes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return { secoes, toggle };
}
