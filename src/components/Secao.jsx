import { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export function Secao({
  id,
  titulo,
  icone,
  aberto,
  onToggle,
  children,
  defaultAberto = true,
}) {
  const { dark } = useTheme();
  const ref = useRef();

  return (
    <div
      id={id}
      ref={ref}
      className="rounded-xl overflow-hidden"
      style={{
        background: dark ? '#1e293b' : '#ffffff',
        border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        fontFamily: "'Geist', sans-serif",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 cursor-pointer bg-transparent border-0 text-left"
        style={{
          borderBottom: aberto
            ? `1px solid ${dark ? '#334155' : '#e2e8f0'}`
            : 'none',
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '16px' }}>{icone}</span>
          <span
            className="text-sm font-medium"
            style={{ color: dark ? '#f1f5f9' : '#0f172a' }}
          >
            {titulo}
          </span>
        </div>
        <span
          className="text-xs transition-transform duration-200"
          style={{
            color: dark ? '#475569' : '#94a3b8',
            transform: aberto ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}
        >
          ▼
        </span>
      </button>

      {aberto && <div className="p-6">{children}</div>}
    </div>
  );
}
