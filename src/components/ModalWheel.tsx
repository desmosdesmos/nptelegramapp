import React, { useState, useEffect } from 'react';
import WheelFortune from './WheelFortune';
import { getTelegramUser } from '../utils/telegram';

interface ModalWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalWheel: React.FC<ModalWheelProps> = ({ isOpen, onClose }) => {
  const [canSpin, setCanSpin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Проверяем, может ли пользователь крутить колесо
      const telegramUser = getTelegramUser();
      const isTester = telegramUser && telegramUser.username === 'yanvtg';

      if (isTester) {
        // Для тестера всегда можно крутить
        setCanSpin(true);
      } else {
        // Для обычных пользователей проверяем дату
        const lastSpinDate = localStorage.getItem('wheel_last_spin_date');
        const today = new Date().toISOString().split('T')[0];

        if (lastSpinDate === today) {
          setCanSpin(false);
        } else {
          setCanSpin(true);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mt-6">
          <WheelFortune
            onWin={async (result) => {
              // Здесь можно добавить дополнительную логику при выигрыше
              console.log('Wheel result:', result);
            }}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalWheel;