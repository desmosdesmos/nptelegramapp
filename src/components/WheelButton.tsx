import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import { getTelegramUser } from '../utils/telegram';

interface WheelButtonProps {
  onOpenWheel: () => void;
}

const WheelButton: React.FC<WheelButtonProps> = ({ onOpenWheel }) => {
  const [canSpin, setCanSpin] = useState(false);
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState('');

  useEffect(() => {
    const checkSpinAvailability = () => {
      // Получаем информацию о пользователе Telegram
      const telegramUser = getTelegramUser();
      const isTester = telegramUser && telegramUser.username === 'yanvtg';

      if (isTester) {
        // Для тестера всегда можно крутить
        setCanSpin(true);
        setTimeUntilNextSpin('');
      } else {
        // Для обычных пользователей проверяем дату
        const lastSpinDate = localStorage.getItem('wheel_last_spin_date');
        const today = new Date().toISOString().split('T')[0];

        if (lastSpinDate === today) {
          // Узнаем, когда можно будет крутить снова
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);

          const timeDiff = tomorrow.getTime() - new Date().getTime();
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

          setTimeUntilNextSpin(`${hours}ч ${minutes}м`);
          setCanSpin(false);
        } else {
          setCanSpin(true);
          setTimeUntilNextSpin('');
        }
      }
    };

    checkSpinAvailability();
    // Проверяем каждую минуту
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