import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer border-0"
      style={{ background: dark ? '#3b82f6' : '#e2e8f0' }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
        style={{ left: dark ? '26px' : '2px' }}
      />
    </button>
  );
}
