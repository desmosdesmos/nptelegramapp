import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import { getTelegramUser } from '../utils/telegram';

interface WheelButtonProps {
  onOpenWheel: () => void;
}

const WheelButton: React.FC<WheelButtonProps> = ({ onOpenWheel }) => {
  const [canSpin, setCanSpin] = useState(false);

  useEffect(() => {
    const checkSpinAvailability = () => {
      // Получаем информацию о пользователе Telegram
      const telegramUser = getTelegramUser();
      const isTester = telegramUser && telegramUser.username === 'yanvtg';

      if (isTester) {
        // Для тестера всегда можно крутить
        setCanSpin(true);
      } else {
        // Для обычных пользователей: проверяем по lastSpinTime (как в таймере)
        const lastSpinStr = localStorage.getItem('lastSpinTime');
        const lastSpin = lastSpinStr ? parseInt(lastSpinStr, 10) : 0;
        const now = Date.now();
        const nextSpinTime = lastSpin + 24 * 60 * 60 * 1000;

        setCanSpin(now >= nextSpinTime);
      }
    };

    checkSpinAvailability();
    const interval = setInterval(checkSpinAvailability, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {canSpin && (
        <button
          onClick={onOpenWheel}
          className="fixed bottom-24 right-4 z-40 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 animate-bounce"
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