/**
 * Утилиты для работы с Telegram WebApp API
 */

import type { TelegramWebApp, TelegramUser } from '../types/telegram';

// Хранилище для хранения данных пользователя
let cachedTelegramUser: TelegramUser | null = null;
let cachedTelegramWebApp: TelegramWebApp | null = null;

/**
 * Получить экземпляр Telegram WebApp
 */
export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (cachedTelegramWebApp) {
    return cachedTelegramWebApp;
  }
  
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    cachedTelegramWebApp = window.Telegram.WebApp;
    return cachedTelegramWebApp;
  }
  return null;
};

/**
 * Инициализация Telegram WebApp
 */
export const initTelegramWebApp = (): void => {
  // Проверяем наличие объекта Telegram
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    cachedTelegramWebApp = tg;
    
    tg.ready();
    tg.expand();
    tg.backgroundColor = '#0F172A';
    console.log("Telegram WebApp initialized and ready!");

    // Установка цветовой схемы
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#0A0A0A');
    document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#FFFFFF');
    document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
    document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#FF6B35');
    document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#FF6B35');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#FFFFFF');
    
    // Сохраняем данные пользователя, если они доступны
    if (tg.initDataUnsafe?.user) {
      cachedTelegramUser = tg.initDataUnsafe.user;
      console.log("Telegram user data cached:", cachedTelegramUser);
    }
  } else {
    // Если объект Telegram недоступен сразу, пробуем получить его позже
    console.log("Telegram WebApp object not available immediately, will retry...");
    
    // Устанавливаем интервал для проверки доступности объекта
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        clearInterval(checkInterval);
        const tg = window.Telegram.WebApp;
        cachedTelegramWebApp = tg;
        
        tg.ready();
        tg.expand();
        tg.backgroundColor = '#0F172A';
        console.log("Telegram WebApp initialized and ready (delayed)!");

        // Установка цветовой схемы
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#0A0A0A');
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#FFFFFF');
        document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
        document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#FF6B35');
        document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#FF6B35');
        document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#FFFFFF');
        
        // Сохраняем данные пользователя, если они доступны
        if (tg.initDataUnsafe?.user) {
          cachedTelegramUser = tg.initDataUnsafe.user;
          console.log("Telegram user data cached:", cachedTelegramUser);
        }
      }
    }, 100);
    
    // Останавливаем проверку через 10 секунд
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);
  }
};

/**
 * Получить данные пользователя из Telegram
 */
export const getTelegramUser = (): TelegramUser | null => {
  // Возвращаем закэшированные данные, если они есть
  if (cachedTelegramUser) {
    return cachedTelegramUser;
  }
  
  // Пытаемся получить данные из объекта Telegram
  const tg = getTelegramWebApp();
  if (tg?.initDataUnsafe?.user) {
    cachedTelegramUser = tg.initDataUnsafe.user;
    return cachedTelegramUser;
  }
  
  return null;
};

/**
 * Тактильная отдача
 */
export const hapticFeedback = (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium'): void => {
  const tg = getTelegramWebApp();
  tg?.HapticFeedback?.impactOccurred(style);
};

/**
 * Уведомление
 */
export const notificationFeedback = (type: 'error' | 'success' | 'warning'): void => {
  const tg = getTelegramWebApp();
  tg?.HapticFeedback?.notificationOccurred(type);
};

/**
 * Отправка данных в Telegram
 */
export const sendDataToTelegram = (data: Record<string, unknown>): void => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.sendData(JSON.stringify(data));
  }
};

/**
 * Открыть ссылку
 */
export const openTelegramLink = (url: string): void => {
  const tg = getTelegramWebApp();
  tg?.openTelegramLink(url);
};

/**
 * Показать алерт
 */
export const showAlert = (message: string, callback?: () => void): void => {
  const tg = getTelegramWebApp();
  tg?.showAlert(message, callback);
};

/**
 * Показать подтверждение
 */
export const showConfirm = (message: string, callback?: (confirmed: boolean) => void): void => {
  const tg = getTelegramWebApp();
  tg?.showConfirm(message, callback);
};
