import { useEffect, useState } from 'react';
import type { PageId, Theme } from './types';
import { AppLayout } from './layouts/AppLayout';
import { Prediction } from './pages/Prediction';

export default function App() {
  const [page, setPage] = useState<PageId>('prediction');
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      // fallback
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      // storage unavailable
    }
  }, [theme]);

  return (
    <AppLayout page={page} setPage={setPage} theme={theme} setTheme={setTheme}>
      <Prediction />
    </AppLayout>
  );
}
