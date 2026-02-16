/**
 * API функции для реферальной системы
 */

import { ReferralInfo, ReferralStats } from '../types/referral';
import { getTelegramUser } from '../utils/telegram';
import { getTotalReferralsCount, getBookedReferralsCount } from '../utils/referral';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Получить информацию о реферальной программе пользователя
 */
export const getUserReferralInfo = async (): Promise<ReferralInfo> => {
  try {
    const telegramUser = getTelegramUser();
    if (!telegramUser) {
      throw new Error('Telegram user not found');
    }

    // Генерируем постоянный реферальный код на основе ID пользователя
    const referralCode = `USER${String(telegramUser.id).slice(-6)}`;
    const referralLink = `https://t.me/nptime_bot/app?start=${referralCode}`;

    const response = await fetch(`${API_BASE_URL}/referrals/${telegramUser.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token'
      }
    });

    if (!response.ok) {
      // Возвращаем mock-данные при ошибке
      console.warn(`Failed to fetch referral info: ${response.status} ${response.statusText}`);

      return {
        referralCode,
        referralLink,
        totalReferrals: 0,
        bookedReferrals: 0,
        totalBonuses: 0,
        referrals: []
      };
    }

    const data = await response.json();

    // Обновляем данные с постоянным кодом
    const result = {
      ...data,
      referralCode,
      referralLink
    };

    // Обновляем данные с учетом локальных значений
    const localTotalReferrals = getTotalReferralsCount(referralCode);
    const localBookedReferrals = getBookedReferralsCount(referralCode);

    // Получаем информацию о рефералах
    const { getReferralsInfo } = await import('../utils/referral');
    const localReferrals = getReferralsInfo(referralCode);

    // Объединяем данные: используем локальные значения, если они больше
    return {
      ...result,
      totalReferrals: Math.max(result.totalReferrals, localTotalReferrals),
      bookedReferrals: Math.max(result.bookedReferrals || 0, localBookedReferrals),
      referrals: [...(result.referrals || []), ...localReferrals]
    };
  } catch (error) {
    console.warn('Network error fetching referral info, returning mock data:', error);

    // Возвращаем mock-данные при сетевой ошибке
    const telegramUser = getTelegramUser();
    const referralCode = telegramUser ? `USER${String(telegramUser.id).slice(-6)}` : `USER${Math.floor(Math.random() * 1000000)}`;
    const referralLink = `https://t.me/nptime_bot/app?start=${referralCode}`;

    return {
      referralCode,
      referralLink,
      totalReferrals: 0,
      bookedReferrals: 0,
      totalBonuses: 0,
      referrals: []
    };
  }
};

/**
 * Получить статистику реферальной программы пользователя
 */
export const getUserReferralStats = async (): Promise<ReferralStats> => {
  try {
    const telegramUser = getTelegramUser();
    if (!telegramUser) {
      throw new Error('Telegram user not found');
    }

    const response = await fetch(`${API_BASE_URL}/referrals/${telegramUser.id}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token'
      }
    });

    if (!response.ok) {
      // Возвращаем mock-данные при ошибке
      console.warn(`Failed to fetch referral stats: ${response.status} ${response.statusText}`);

      return {
        totalReferrals: 0,
        bookedReferrals: 0,
        totalBonuses: 0,
        pendingBonuses: 0
      };
    }

    return await response.json();
  } catch (error) {
    console.warn('Network error fetching referral stats, returning mock data:', error);

    // Возвращаем mock-данные при сетевой ошибке
    return {
      totalReferrals: 0,
      bookedReferrals: 0,
      totalBonuses: 0,
      pendingBonuses: 0
    };
  }
};

/**
 * Поделиться реферальной ссылкой
 */
export const shareReferralCode = (referralCode: string) => {
  // Создаем ссылку на Telegram бота с реферальным кодом
  const referralLink = `https://t.me/nptime_bot/app?start=${referralCode}`;
  const shareText = `Привет! Переходи по моей ссылке для записи на комплексную химчистку и получай озонирование салона совершенно бесплатно! ❤️\n\nПосле перехода по ссылке нажми на кнопку "NP Fast" в чате с ботом.\n\n${referralLink}`;

  if (navigator.share) {
    navigator.share({
      title: 'Реферальная ссылка для NP Detailing',
      text: shareText
    }).catch(console.error);
  } else {
    // Fallback: копируем текст в буфер обмена
    navigator.clipboard.writeText(shareText);
    alert('Текст с реферальной информацией скопирован в буфер обмена!');
  }
};

/**
 * Копировать реферальную ссылку
 */
export const copyReferralLink = async (referralLink: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(referralLink);
    return true;
  } catch (err) {
    console.error('Failed to copy referral link: ', err);
    return false;
  }
};

/**
 * Начислить бонус за реферала
 */
export const awardBonusForReferral = async (referrerId: string, referralId: string, bonusAmount: number, serviceType?: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/referrals/award-bonus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token'
      },
      body: JSON.stringify({
        referrerId,
        referralId,
        bonusAmount,
        serviceType,
        rewardPaid: false // Пока не выплачен
      })
    });

    if (!response.ok) {
      console.error(`Failed to award bonus: ${response.status} ${response.statusText}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Network error awarding bonus:', error);
    return false;
  }
};

/**
 * Проверить, является ли реферал допустимым для начисления бонуса
 */
export const isValidReferralForBonus = async (referrerId: string, referralId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/referrals/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token'
      },
      body: JSON.stringify({
        referrerId,
        referralId
      })
    });

    if (!response.ok) {
      console.error(`Failed to validate referral: ${response.status} ${response.statusText}`);
      return false;
    }

    const result = await response.json();
    return result.isValid;
  } catch (error) {
    console.error('Network error validating referral:', error);
    return false;
  }
};