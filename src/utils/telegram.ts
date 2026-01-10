/**
 * Утилиты для работы с Telegram WebApp API
 */

import type { TelegramWebApp, TelegramUser } from '../types/telegram';

/**
 * Получить экземпляр Telegram WebApp
 */
export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

/**
 * Инициализация Telegram WebApp
 */
export const initTelegramWebApp = (): void => {
  const tg = getTelegramWebApp();
  if (tg) {
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
  }
};

/**
 * Получить данные пользователя из Telegram
 */
export const getTelegramUser = (): TelegramUser | null => {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe?.user || null;
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
