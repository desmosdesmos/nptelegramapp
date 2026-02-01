import { getUserReferralInfo } from '../api/referralApi';
import { getTotalReferralsCount, getBookedReferralsCount, getReferralsInfo } from './referral';
import { getTelegramUser } from './telegram';

// Глобальное состояние для реферальных данных
let referralState: any = null;
let listeners: Array<() => void> = [];

// Загрузка данных
export const loadReferralData = async () => {
  try {
    const data = await getUserReferralInfo();

    // Обновляем данные с учетом локальных значений
    const telegramUser = getTelegramUser();
    if (telegramUser) {
      const referralCode = `USER${String(telegramUser.id).slice(-6)}`;
      const localTotalReferrals = getTotalReferralsCount(referralCode);
      const localBookedReferrals = getBookedReferralsCount(referralCode);
      
      // Получаем информацию о рефералах
      const localReferrals = getReferralsInfo(referralCode);

      // Объединяем данные: используем локальные значения, если они больше
      const updatedData = {
        ...data,
        totalReferrals: Math.max(data.totalReferrals || 0, localTotalReferrals),
        bookedReferrals: Math.max(data.bookedReferrals || 0, localBookedReferrals),
        referrals: [...(data.referrals || []), ...localReferrals]
      };

      referralState = updatedData;
    } else {
      referralState = data;
    }
    
    // Уведомляем всех слушателей
    notifyListeners();
  } catch (error) {
    console.error('Error loading referral info:', error);
  }
};

// Получение текущего состояния
export const getReferralState = () => {
  return referralState;
};

// Добавление слушателя
export const addReferralListener = (listener: () => void) => {
  listeners.push(listener);
  // Возвращаем функцию для удаления слушателя
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

// Уведомление всех слушателей
const notifyListeners = () => {
  listeners.forEach(listener => {
    try {
      listener();
    } catch (error) {
      console.error('Error in referral listener:', error);
    }
  });
};

// Инициализация данных
loadReferralData();

// Функция для принудительного обновления состояния
export const forceReferralStateUpdate = () => {
  loadReferralData();
};