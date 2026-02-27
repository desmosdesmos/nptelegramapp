import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';

interface WheelButtonProps {
  onOpenWheel: () => void;
}

const WheelButton: React.FC<WheelButtonProps> = ({ onOpenWheel }) => {
  const [canSpin, setCanSpin] = useState(false);

  useEffect(() => {
    const checkSpinAvailability = async () => {
      try {
        // Получаем награды с сервера, чтобы получить актуальное время последнего вращения
        const rewardsModule = await import('../utils/rewardsSystem');
        const rewards = await rewardsModule.getUserRewards();

        const lastSpin = rewards.lastSpinTime || 0;
        const now = Date.now();
        const nextSpinTime = lastSpin + 24 * 60 * 60 * 1000;

        const available = now >= nextSpinTime;
        setCanSpin(available);
        
        // Также сохраняем в localStorage для синхронизации
        if (!available) {
          localStorage.setItem('lastSpinTime', String(lastSpin));
        }
      } catch (rewardsError) {
        console.error('Error getting rewards in WheelButton:', rewardsError);

        // Резервная логика на случай ошибки
        const lastSpinStr = localStorage.getItem('lastSpinTime');
        const lastSpin = lastSpinStr ? parseInt(lastSpinStr, 10) : 0;
        const now = Date.now();
        const nextSpinTime = lastSpin + 24 * 60 * 60 * 1000;

        setCanSpin(now >= nextSpinTime);
      }
    };

    // Проверяем сразу
    checkSpinAvailability();
    
    // Проверяем каждую минуту
    const interval = setInterval(checkSpinAvailability, 60000);

    // Добавляем слушатель события для обновления состояния при вращении из других вкладок/компонентов
    const handleSpinUpdate = () => {
      checkSpinAvailability();
    };

    window.addEventListener('lastSpinTimeUpdated', handleSpinUpdate);
    window.addEventListener('storage', handleSpinUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('lastSpinTimeUpdated', handleSpinUpdate);
      window.removeEventListener('storage', handleSpinUpdate);
    };
  }, []);

  return (
    <>
      {canSpin && (
        <button
          onClick={onOpenWheel}
          className="absolute bottom-24 right-4 z-40 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 animate-bounce"
        >
          <div className="relative">
            <Gift className="w-8 h-8 text-black" />
          </div>
        </button>
      )}
    </>
  );
};

export default WheelButton;