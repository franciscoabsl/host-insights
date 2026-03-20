import { ThemeProvider } from './context/ThemeContext';
import { useAirbnbData } from './hooks/useAirbnbData';
import { Upload } from './components/Upload';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { dados, loading, erro, processar, resetar } = useAirbnbData();

  if (dados) {
    return <Dashboard dados={dados} onReset={resetar} />;
  }

  return <Upload onUpload={processar} loading={loading} erro={erro} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
