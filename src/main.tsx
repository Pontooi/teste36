import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Registro do Service Worker para permitir que o app funcione offline e seja instalado no celular
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.info('Service Worker registration skipped or restricted:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
