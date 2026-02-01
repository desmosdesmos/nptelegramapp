import React, { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';

interface WheelButtonProps {
  onOpenWheel: () => void;
}

const WheelButton: React.FC<WheelButtonProps> = ({ onOpenWheel }) => {
  const [canSpin, setCanSpin] = useState(false);
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState('');

  useEffect(() => {
    const checkSpinAvailability = () => {
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
    };

    checkSpinAvailability();
    // Проверяем каждую минуту
    const interval = setInterval(checkSpinAvailability, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onOpenWheel}
      disabled={!canSpin}
      className={`fixed bottom-24 right-4 z-40 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
        canSpin
          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 animate-bounce'
          : 'bg-gray-600'
      }`}
    >
      <div className="relative">
        <Gift className="w-8 h-8 text-black" />
        {!canSpin && timeUntilNextSpin && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {timeUntilNextSpin}
          </div>
        )}
      </div>
    </button>
  );
};

export default WheelButton;