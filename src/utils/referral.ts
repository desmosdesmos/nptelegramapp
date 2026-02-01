/**
 * Вспомогательные функции для работы с реферальной системой
 */

import { getTelegramUser } from './telegram';

/**
 * Получить реферальный код из URL параметров
 */
export const getReferralCodeFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  // Проверяем сначала параметр 'ref' (для веб-приложения), затем 'start' (для Telegram)
  return urlParams.get('ref') || urlParams.get('start');
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