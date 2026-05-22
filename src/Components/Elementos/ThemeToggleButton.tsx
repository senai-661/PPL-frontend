import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ThemeToggleButtonProps = {
  className?: string;
};

export function ThemeToggleButton({ className = '' }: ThemeToggleButtonProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDarkTheme = isMounted && resolvedTheme === 'dark';
  const nextTheme = isDarkTheme ? 'light' : 'dark';
  const ariaLabel = isDarkTheme ? 'Ativar tema claro' : 'Ativar tema escuro';

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`theme-toggle inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 p-2 text-white backdrop-blur transition  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${className}`.trim()}
    >
      {isDarkTheme ? <Sun className="size-5" /> : <Moon className="size-5" />}
      <span className="sr-only">{isDarkTheme ? 'Tema claro' : 'Tema escuro'}</span>
    </button>
  );
}

