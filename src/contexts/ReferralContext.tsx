import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getReferralState, addReferralListener, loadReferralData } from '../utils/referralState';

interface ReferralContextType {
  referralInfo: any;
  loading: boolean;
  refreshReferralInfo: () => void;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const ReferralProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [referralInfo, setReferralInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Обновляем данные при изменении глобального состояния
  useEffect(() => {
    // Устанавливаем начальное состояние
    const initialState = getReferralState();
    if (initialState) {
      setReferralInfo(initialState);
      setLoading(false);
    } else {
      // Если данных еще нет, ждем их загрузки
      const interval = setInterval(() => {
        const state = getReferralState();
        if (state) {
          setReferralInfo(state);
          setLoading(false);
          clearInterval(interval);
        }
      }, 100);
    }

    // Добавляем слушатель для обновлений
    const unsubscribe = addReferralListener(() => {
      setReferralInfo(getReferralState());
    });

    // Подписываемся на кастомное событие для обновления данных
    const handleCustomUpdate = () => {
      loadReferralData();
    };

    window.addEventListener('referralUpdate', handleCustomUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('referralUpdate', handleCustomUpdate);
    };
  }, []);

  const refreshReferralInfo = () => {
    loadReferralData();
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