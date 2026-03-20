import { ThemeProvider } from './context/ThemeContext';
import { useAirbnbData } from './hooks/useAirbnbData';
import { Upload } from './components/Upload';
import { Dashboard } from './components/Dashboard';
import { PreviewModal } from './components/PreviewModal';

function AppContent() {
  const {
    dados,
    preview,
    loading,
    erro,
    processar,
    gerarDashboard,
    cancelarPreview,
    resetar,
  } = useAirbnbData();

  if (dados) {
    return <Dashboard dados={dados} onReset={resetar} />;
  }

  return (
    <>
      <Upload onUpload={processar} loading={loading} erro={erro} />
      {preview && (
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
