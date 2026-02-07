import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import { getTelegramUser } from '../utils/telegram';

interface WheelButtonProps {
  onOpenWheel: () => void;
}

const WheelButton: React.FC<WheelButtonProps> = ({ onOpenWheel }) => {
  const [canSpin, setCanSpin] = useState(false);

  useEffect(() => {
    try {
      const checkSpinAvailability = () => {
        let isTester = false;
        try {
          const telegramUser = getTelegramUser();
          isTester = telegramUser !== null && telegramUser?.username === 'yanvtg';
        } catch (e) {
          console.warn('Telegram user not available, defaulting to non-tester');
        }

        if (isTester) {
          setCanSpin(true);
        } else {
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
    } catch (e) {
      console.error('WheelButton useEffect failed:', e);
      setCanSpin(true); // Критический fallback: всегда показываем кнопку при ошибке
    }
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