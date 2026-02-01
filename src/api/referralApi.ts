/**
 * API функции для реферальной системы
 */

import { ReferralInfo, ReferralStats } from '../types/referral';
import { getTelegramUser } from '../utils/telegram';

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

    const response = await fetch(`${API_BASE_URL}/referrals/${telegramUser.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'mock-token'}`
      }
    });

    if (!response.ok) {
      // Возвращаем mock-данные при ошибке
      console.warn(`Failed to fetch referral info: ${response.status} ${response.statusText}`);

      return {
        referralCode: `REF${Math.floor(Math.random() * 1000000)}`,
        referralLink: `https://t.me/npdetailing?start=REF${Math.floor(Math.random() * 1000000)}`,
        totalReferrals: Math.floor(Math.random() * 5),
        totalBonuses: Math.floor(Math.random() * 5) * 500,
        referrals: []
      };
    }

    return await response.json();
  } catch (error) {
    console.warn('Network error fetching referral info, returning mock data:', error);

    // Возвращаем mock-данные при сетевой ошибке
    return {
      referralCode: `REF${Math.floor(Math.random() * 1000000)}`,
      referralLink: `https://t.me/npdetailing?start=REF${Math.floor(Math.random() * 1000000)}`,
      totalReferrals: Math.floor(Math.random() * 5),
      totalBonuses: Math.floor(Math.random() * 5) * 500,
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
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'mock-token'}`
      }
    });

    if (!response.ok) {
      // Возвращаем mock-данные при ошибке
      console.warn(`Failed to fetch referral stats: ${response.status} ${response.statusText}`);

      return {
        totalReferrals: Math.floor(Math.random() * 5),
        totalBonuses: Math.floor(Math.random() * 5) * 500,
        monthlyReferrals: Math.floor(Math.random() * 3),
        pendingBonuses: 0
      };
    }

    return await response.json();
  } catch (error) {
    console.warn('Network error fetching referral stats, returning mock data:', error);

    // Возвращаем mock-данные при сетевой ошибке
    return {
      totalReferrals: Math.floor(Math.random() * 5),
      totalBonuses: Math.floor(Math.random() * 5) * 500,
      monthlyReferrals: Math.floor(Math.random() * 3),
      pendingBonuses: 0
    };
  }
};

/**
 * Поделиться реферальным кодом
 */
export const shareReferralCode = (referralCode: string) => {
  const shareText = `Привет! Воспользуйся моим промокодом "${referralCode}" при первой записи в @nptime_bot и получи скидку 500₽. А я получу бонус за рекомендацию ❤️`;

  if (navigator.share) {
    navigator.share({
      title: 'Промокод для автосервиса NP Detailing',
      text: shareText
    }).catch(console.error);
  } else {
    // Fallback: копируем текст в буфер обмена
    navigator.clipboard.writeText(shareText);
    alert('Текст с промокодом скопирован в буфер обмена!');
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
export const awardBonusForReferral = async (referrerId: string, referralId: string, bonusAmount: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/referrals/award-bonus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'mock-token'}`
      },
      body: JSON.stringify({
        referrerId,
        referralId,
        bonusAmount
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
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'mock-token'}`
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