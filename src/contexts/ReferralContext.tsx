import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserReferralInfo } from '../api/referralApi';
import { getTotalReferralsCount, getBookedReferralsCount, getReferralsInfo } from '../utils/referral';
import { getTelegramUser } from '../utils/telegram';

interface ReferralContextType {
  referralInfo: any;
  loading: boolean;
  refreshReferralInfo: () => void;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [referralInfo, setReferralInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadReferralInfo = async () => {
    try {
      setLoading(true);
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

        setReferralInfo(updatedData);
      } else {
        setReferralInfo(data);
      }
    } catch (error) {
      console.error('Error loading referral info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем данные при инициализации
  useEffect(() => {
    loadReferralInfo();

    // Добавляем слушатель для изменений в localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('referral_')) {
        loadReferralInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Добавим подписку на кастомное событие для обновления данных
  useEffect(() => {
    const handleCustomUpdate = () => {
      loadReferralInfo();
    };
    
    window.addEventListener('referralUpdate', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('referralUpdate', handleCustomUpdate);
    };
  }, []);

  const refreshReferralInfo = () => {
    loadReferralInfo();
  };

  return (
    <ReferralContext.Provider value={{ referralInfo, loading, refreshReferralInfo }}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};