import { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

export function Upload({ onUpload, loading, erro }) {
  const { dark } = useTheme();
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    if (file && file.name.endsWith('.csv')) {
      onUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "'Geist', sans-serif",
        background: dark ? '#0f172a' : '#f8fafc',
        color: dark ? '#f1f5f9' : '#0f172a',
      }}
    >
      <header
        className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: dark ? '#1e293b' : '#e2e8f0' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">
            Host Insights
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: dark ? '#1e3a5f' : '#dbeafe',
              color: dark ? '#93c5fd' : '#1d4ed8',
            }}
          >
            beta
          </span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-lg w-full text-center mb-10">
          <h1
            className="text-4xl font-light tracking-tight mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Seus dados do Airbnb,
            <br />
            <span style={{ color: dark ? '#60a5fa' : '#2563eb' }}>
              transformados em insights.
            </span>
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: dark ? '#94a3b8' : '#64748b' }}
          >
            Faça upload do CSV exportado do Airbnb e visualize sua performance
            financeira e de ocupação em segundos. Seus dados nunca saem do seu
            dispositivo.
          </p>
        </div>

        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          className="max-w-lg w-full rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all"
          style={{
            borderColor: drag ? '#2563eb' : dark ? '#334155' : '#cbd5e1',
            background: drag
              ? dark
                ? '#1e3a5f22'
                : '#dbeafe44'
              : 'transparent',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />

          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{
                  borderColor: dark ? '#60a5fa' : '#2563eb',
                  borderTopColor: 'transparent',
                }}
              />
              <p
                className="text-sm"
                style={{ color: dark ? '#94a3b8' : '#64748b' }}
              >
                Processando dados...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: dark ? '#1e293b' : '#f1f5f9' }}
              >
                📂
              </div>
              <p className="text-sm font-medium">
                Arraste o CSV aqui ou clique para selecionar
              </p>
              <p
                className="text-xs"
                style={{ color: dark ? '#64748b' : '#94a3b8' }}
              >
                Airbnb → Anúncios → Relatórios → Exportar CSV
              </p>
            </div>
          )}
        </div>

        {erro && <p className="mt-4 text-sm text-red-500">{erro}</p>}

        <div
          className="mt-10 flex items-center gap-2 text-xs"
          style={{ color: dark ? '#475569' : '#94a3b8' }}
        >
          <span>🔒</span>
          <span>
            Processamento 100% local — seus dados nunca saem do dispositivo
          </span>
        </div>
      </main>
    </div>
  );
}
