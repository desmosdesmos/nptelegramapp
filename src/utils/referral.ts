/**
 * Вспомогательные функции для работы с реферальной системой
 */

import { getTelegramUser } from './telegram';

/**
 * Получить реферальный код из URL параметров
 */
export const getReferralCodeFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  // Проверяем параметр 'start' (для Telegram бота)
  return urlParams.get('start');
};

/**
 * Проверить, является ли текущий пользователь рефералом
 * (перешел по реферальной ссылке)
 */
export const isReferralVisit = (): boolean => {
  return getReferralCodeFromUrl() !== null;
};

/**
 * Сохранить информацию о реферере для текущего пользователя
 */
export const saveReferrerInfo = (referrerCode: string): void => {
  const telegramUser = getTelegramUser();
  if (!telegramUser) {
    console.error('Telegram user not found');
    return;
  }

  // Сохраняем информацию о реферере в localStorage
  // В реальном приложении это должно происходить на сервере
  const referrerData = {
    referrerCode,
    referrerUserId: telegramUser.id,
    timestamp: Date.now()
  };

  localStorage.setItem(`referrer_${telegramUser.id}`, JSON.stringify(referrerData));
};

/**
 * Получить сохраненную информацию о реферере
 */
export const getSavedReferrerInfo = () => {
  const telegramUser = getTelegramUser();
  if (!telegramUser) {
    return null;
  }

  const savedData = localStorage.getItem(`referrer_${telegramUser.id}`);
  return savedData ? JSON.parse(savedData) : null;
};

/**
 * Проверить, был ли пользователь зарегистрирован по реферальной ссылке
 */
export const wasRegisteredViaReferral = (): boolean => {
  return getSavedReferrerInfo() !== null;
};

/**
 * Проверить, является ли услуга, которую выбрал пользователь, 
 * квалифицирующей для начисления реферального бонуса
 */
export const isQualifyingService = (serviceType: string): boolean => {
  // В данном случае, только комплексная химчистка дает право на бонус
  return serviceType.toLowerCase().includes('комплексн') && 
         serviceType.toLowerCase().includes('химчистк');
};

/**
 * Проверить, является ли реферальный код действительным
 */
export const isValidReferralCode = (code: string): boolean => {
  // Проверяем, соответствует ли код формату USER + 6 цифр
  const referralCodePattern = /^USER\d{6}$/;
  return referralCodePattern.test(code);
};

/**
 * Проверить, является ли пользователь новым рефералом (первый визит по реферальной ссылке)
 */
export const isNewReferral = (): boolean => {
  const telegramUser = getTelegramUser();
  if (!telegramUser) {
    return false;
  }

  // Проверяем, есть ли уже сохраненная информация о реферере для этого пользователя
  const storageKey = `referrer_${telegramUser.id}_visited`;
  const hasVisited = localStorage.getItem(storageKey);

  if (!hasVisited) {
    // Помечаем, что пользователь уже посещал приложение
    localStorage.setItem(storageKey, 'true');
    return true;
  }

  return false;
};

/**
 * Обновить счетчик привлеченных пользователей
 */
export const incrementTotalReferrals = (referrerCode: string): void => {
  // В реальном приложении это будет вызов API для обновления счетчика на сервере
  // Для демонстрации будем использовать localStorage

  const countKey = `referral_total_count_${referrerCode}`;
  const currentCount = parseInt(localStorage.getItem(countKey) || '0', 10);
  localStorage.setItem(countKey, (currentCount + 1).toString());
};

/**
 * Обновить счетчик оформленных записей
 */
export const incrementBookedReferrals = (referrerCode: string): void => {
  // В реальном приложении это будет вызов API для обновления счетчика на сервере
  // Для демонстрации будем использовать localStorage

  const countKey = `referral_booked_count_${referrerCode}`;
  const currentCount = parseInt(localStorage.getItem(countKey) || '0', 10);
  localStorage.setItem(countKey, (currentCount + 1).toString());
};

/**
 * Получить значение счетчика привлеченных пользователей
 */
export const getTotalReferralsCount = (referrerCode: string): number => {
  const countKey = `referral_total_count_${referrerCode}`;
  return parseInt(localStorage.getItem(countKey) || '0', 10);
};

/**
 * Получить значение счетчика оформленных записей
 */
export const getBookedReferralsCount = (referrerCode: string): number => {
  const countKey = `referral_booked_count_${referrerCode}`;
  return parseInt(localStorage.getItem(countKey) || '0', 10);
};