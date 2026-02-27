import { useState, useEffect } from 'react';
import { getUserRewards } from '../utils/rewardsSystem';

export const useDailySpinTimer = () => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [dailyStreak, setDailyStreak] = useState(0);

  useEffect(() => {
    const updateTimer = async () => {
      try {
        // Получаем награды с сервера, чтобы получить актуальное время последнего вращения
        const rewards = await getUserRewards();
        const lastSpin = rewards.lastSpinTime || 0;
        const now = Date.now();
        const nextSpinTime = lastSpin + 24 * 60 * 60 * 1000; // +24 часа
        const diff = nextSpinTime - now;

        // Обновляем dailyStreak из серверных данных
        setDailyStreak(rewards.dailyStreak || 0);

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
      } catch (error) {
        console.error('Error getting rewards in timer hook:', error);

        // Резервная логика на случай ошибки
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
      }
    };

    updateTimer();
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { timeLeft, canSpin, dailyStreak };
}