
import { ThemeProvider } from 'next-themes';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './css/index.css';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem={false}
    storageKey="openline-theme"
    disableTransitionOnChange
  >
    <App />
  </ThemeProvider>,
);
  
