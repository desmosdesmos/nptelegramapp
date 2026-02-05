import { useState, useEffect } from 'react';

export const useDailySpinTimer = () => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [canSpin, setCanSpin] = useState(true);

  useEffect(() => {
    const updateTimer = () => {
      const lastSpinStr = localStorage.getItem('lastSpinTime');
      const lastSpin = lastSpinStr ? parseInt(lastSpinStr, 10) : 0;
      const now = Date.now();
      const nextSpinTime = lastSpin + 24 * 60 * 60 * 1000; // +24 часа
      const diff = nextSpinTime - now;

      if (diff <= 0) {
        setCanSpin(true);
        setTimeLeft(null);
      } else {
        setCanSpin(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return { timeLeft, canSpin };
};