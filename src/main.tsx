import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { initTelegramWebApp } from './utils/telegram';

// Инициализируем Telegram WebApp и рендерим приложение
// Используем DOMContentLoaded для гарантии загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
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
});

// Также вызываем инициализацию сразу, если документ уже загружен
if (document.readyState === 'loading') {
  // Документ еще загружается, событие DOMContentLoaded будет вызвано позже
} else {
  // Документ уже загружен, вызываем инициализацию сразу
  initTelegramWebApp();

  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
}
