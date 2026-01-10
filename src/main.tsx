import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { initTelegramWebApp } from './utils/telegram';

// Рендерим приложение после небольшой задержки, чтобы дать Telegram Web App API время на инициализацию
setTimeout(() => {
  // Инициализируем Telegram WebApp
  initTelegramWebApp();

  // Рендерим приложение
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
}, 100);
