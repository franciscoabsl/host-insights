import { ThemeProvider, useTheme } from './context/ThemeContext';
import { useAirbnbData } from './hooks/useAirbnbData';
import { Upload } from './components/Upload';
import { Dashboard } from './components/Dashboard';
import { PreviewModal } from './components/PreviewModal';
import { ConfiguracaoWizard } from './components/ConfiguracaoWizard';
import { useState, useMemo } from 'react';
import { calcularPorMes } from './utils/calculos';

function AppContent() {
  const { dark } = useTheme();
  const {
    dados,
    preview,
    configuracao,
    loading,
    erro,
    processar,
    gerarDashboard,
    atualizarConfiguracao,
    cancelarPreview,
    resetar,
  } = useAirbnbData();

  const [tela, setTela] = useState('upload');

  const porMesPreview = useMemo(() => {
    if (!preview) return [];
    return calcularPorMes(preview);
  }, [preview]);

  if (dados) {
    return <Dashboard dados={dados} onReset={resetar} />;
  }

  return (
    <>
      <Upload
        onUpload={(file) => {
          processar(file).then(() => setTela('wizard'));
        }}
        loading={loading}
        erro={erro}
      />

      {preview && tela === 'wizard' && (
        <ConfiguracaoWizard
          reservas={preview}
          porMes={porMesPreview}
          config={configuracao}
          onChange={atualizarConfiguracao}
          onConcluir={() => setTela('preview')}
          onPular={() => setTela('preview')}
          dark={dark}
        />
      )}

      {preview && tela === 'preview' && (
        <PreviewModal
          reservas={preview}
          onConfirmar={gerarDashboard}
          onCancelar={cancelarPreview}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
