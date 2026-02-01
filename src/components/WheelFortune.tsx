import React, { useState, useEffect, useRef } from 'react';
import { WheelSpinResult } from '../types/wheel';
import { wheelPrizes, prizeProbabilities } from '../data/wheelConfig';
import { hapticFeedback, getTelegramUser } from '../utils/telegram';

interface WheelFortuneProps {
  onWin: (result: WheelSpinResult) => void;
  onClose: () => void;
}

const WheelFortune: React.FC<WheelFortuneProps> = ({ onWin, onClose }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastResult, setLastResult] = useState<WheelSpinResult | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [dailyStreak, setDailyStreak] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Количество секторов на колесе
  const numSectors = wheelPrizes.length;
  // Угол каждого сектора
  const sectorAngle = 360 / numSectors;
  

  // Проверяем, можно ли крутить сегодня
  useEffect(() => {
    // Получаем информацию о пользователе Telegram
    const telegramUser = getTelegramUser();
    const isTester = telegramUser && telegramUser.username === 'yanvtg';

    const lastSpinDate = localStorage.getItem('wheel_last_spin_date');
    const today = new Date().toISOString().split('T')[0];

    if (!isTester && lastSpinDate === today) {
      setCanSpin(false);
      // Показываем результат последнего вращения
      const lastResultStr = localStorage.getItem('wheel_last_result');
      if (lastResultStr) {
        setLastResult(JSON.parse(lastResultStr));
      }
    } else {
      setCanSpin(true);
    }

    // Загружаем серию дней
    const streak = parseInt(localStorage.getItem('wheel_daily_streak') || '0', 10);
    setDailyStreak(streak);
  }, []);

  // Рисуем колесо
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const diameter = 300;
    const radius = diameter / 2;
    
    // Устанавливаем размеры холста
    canvas.width = diameter;
    canvas.height = diameter;
    
    // Очищаем холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Сохраняем состояние
    ctx.save();
    
    // Перемещаем центр в центр холста
    ctx.translate(radius, radius);
    
    // Рисуем секторы
    for (let i = 0; i < numSectors; i++) {
      const prize = wheelPrizes[i];
      const startAngle = (i * sectorAngle * Math.PI) / 180;
      const endAngle = ((i + 1) * sectorAngle * Math.PI) / 180;

      // Выбираем цвет в зависимости от редкости
      let fillColor = '#8B5CF6'; // purple-500 по умолчанию
      let strokeColor = '#1E293B'; // slate-800 по умолчанию
      switch (prize.rarity) {
        case 'common':
          fillColor = '#3B82F6'; // blue-500
          strokeColor = '#1E40AF'; // blue-800
          break;
        case 'rare':
          fillColor = '#10B981'; // emerald-500
          strokeColor = '#065F46'; // emerald-800
          break;
        case 'epic':
          fillColor = '#8B5CF6'; // violet-500
          strokeColor = '#5B21B6'; // violet-800
          break;
        case 'legendary':
          fillColor = '#F59E0B'; // amber-500
          strokeColor = '#92400E'; // amber-800
          break;
      }

      // Рисуем сектор
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Рисуем градиентную границу для имитации металлического отблеска
      ctx.strokeStyle = `linear-gradient(${startAngle}rad, ${strokeColor}, #ffffff)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Добавляем тонкий внутренний отблеск для имитации металлической текстуры
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.95, startAngle, endAngle);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Рисуем текст
      ctx.save();
      ctx.rotate(startAngle + sectorAngle * Math.PI / 360);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px Arial';

      // Поворачиваем текст к центру
      const textRadius = radius * 0.65;

      // Рисуем иконку
      ctx.font = 'bold 20px Arial';
      ctx.shadowColor = '#3B82F6'; // Electric Blue
      ctx.shadowBlur = 5;
      ctx.fillText(prize.icon, textRadius * Math.cos(-Math.PI/2), textRadius * Math.sin(-Math.PI/2) - 10);

      // Рисуем название приза
      ctx.font = 'bold 10px Arial';
      ctx.shadowColor = '#3B82F6'; // Electric Blue
      ctx.shadowBlur = 3;
      const maxWidth = radius * 0.4; // Максимальная ширина текста

      // Функция для разбиения текста на строки
      const wrapText = (text: string, maxWidth: number): string[] => {
        const lines = [];
        const words = text.split(' ');

        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + ' ' + word).width;

          if (width < maxWidth) {
            currentLine += ' ' + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }

        lines.push(currentLine);
        return lines;
      };

      const lines = wrapText(prize.name, maxWidth);

      // Рисуем каждую строку текста
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], textRadius * Math.cos(-Math.PI/2), textRadius * Math.sin(-Math.PI/2) + (i * 12));
      }

      ctx.restore();
    }
    
    // Восстанавливаем состояние
    ctx.restore();
    
    // Рисуем центральный круг
    ctx.beginPath();
    ctx.arc(radius, radius, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#1E293B'; // slate-800
    ctx.fill();
    
  }, [rotation]);

  const spinWheel = () => {
    if (!canSpin || spinning) return;
    
    hapticFeedback('medium');
    
    setSpinning(true);
    setLastResult(null);
    
    // Добавляем случайное количество оборотов (3-6) плюс смещение для нужного сектора
    const extraRotations = 3 + Math.floor(Math.random() * 4);
    const winningIndex = getRandomPrizeIndex();
    const targetRotation = rotation + (extraRotations * 360) + (360 - (winningIndex * sectorAngle));
    
    setRotation(targetRotation);
    
    // Анимация вращения
    setTimeout(() => {
      // Выбираем приз
      const prize = wheelPrizes[winningIndex];
      const result: WheelSpinResult = {
        prize,
        sectorIndex: winningIndex,
        timestamp: Date.now()
      };

      setLastResult(result);
      setSpinning(false);

      // Получаем информацию о пользователе Telegram
      const telegramUser = getTelegramUser();
      const isTester = telegramUser && telegramUser.username === 'yanvtg';

      if (isTester) {
        // Для тестера не ограничиваем вращение
        setCanSpin(true);
      } else {
        // Для обычных пользователей ограничиваем
        setCanSpin(false);

        // Сохраняем дату вращения для обычных пользователей
        localStorage.setItem('wheel_last_spin_date', new Date().toISOString().split('T')[0]);
      }

      // Сохраняем результат
      localStorage.setItem('wheel_last_result', JSON.stringify(result));

      // Обновляем серию для обычных пользователей
      if (!isTester) {
        const today = new Date().toISOString().split('T')[0];
        const lastSpinDate = localStorage.getItem('wheel_last_spin_date_prev');
        let newStreak = dailyStreak;

        if (!lastSpinDate || lastSpinDate !== today) {
          newStreak++;
          localStorage.setItem('wheel_daily_streak', newStreak.toString());
          setDailyStreak(newStreak);
          localStorage.setItem('wheel_last_spin_date_prev', today);
        }
      }

      // Вызываем коллбэк
      onWin(result);
    }, 5000); // 5 секунд на анимацию
  };

  // Функция для получения случайного индекса приза с учетом заданных вероятностей
  const getRandomPrizeIndex = (): number => {
    // Получаем список призов с заданными вероятностями
    const specificPrizes = Object.keys(prizeProbabilities);

    // Генерируем случайное число от 0 до 100
    const random = Math.random() * 100;

    // Проверяем, соответствует ли результат какому-либо конкретному призу
    let cumulativeProbability = 0;

    for (const prizeId of specificPrizes) {
      const probability = prizeProbabilities[prizeId as keyof typeof prizeProbabilities];
      cumulativeProbability += probability;

      if (random <= cumulativeProbability) {
        // Нашли приз, которому соответствует случайное число
        const prizeIndex = wheelPrizes.findIndex(p => p.id === prizeId);
        if (prizeIndex !== -1) {
          return prizeIndex;
        }
      }
    }

    // Если не попали в заданные вероятности, выбираем случайный приз из оставшихся
    // или возвращаем самый распространенный приз (10 баллов)
    const defaultPrizeIndex = wheelPrizes.findIndex(p => p.id === 'points-10');
    return defaultPrizeIndex !== -1 ? defaultPrizeIndex : 0;
  };

  // Добавляем стили для анимации блика
  useEffect(() => {
    // Создаем CSS-анимацию для блика
    const style = document.createElement('style');
    style.textContent = `
      @keyframes sweep {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={containerRef}
        className="bg-[#1a1a1a] backdrop-filter backdrop-blur-20 bg-opacity-5 rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white font-system">Ежедневное колесо фортуны</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="relative flex flex-col items-center">
          {/* Колесо */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="rounded-full border border-transparent shadow-lg"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 5s cubic-bezier(0.15, 0, 0.15, 1)' : 'none',
                boxShadow: 'inset 0 0 20px rgba(59, 130, 246, 0.3)',
              }}
            />

            {/* Указатель */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#3B82F6]"></div>
            </div>

            {/* Эффект блика при вращении */}
            {spinning && (
              <div
                className="absolute top-1/2 left-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-y-1/2 animate-spin"
                style={{
                  animation: 'sweep 1s linear infinite',
                  transformOrigin: 'left center',
                  width: '100%',
                  height: '2px',
                  top: '50%',
                  left: '0',
                  transform: 'translateY(-50%) rotate(0deg)',
                }}
              ></div>
            )}
          </div>

          {/* Информация о серии */}
          <div className="mt-4 text-center">
            <p className="text-white/80 font-system">Дней подряд: <span className="font-bold text-[#3B82F6]">{dailyStreak}</span></p>
          </div>

          {/* Кнопка вращения */}
          <button
            onClick={spinWheel}
            disabled={!canSpin || spinning}
            className={`mt-6 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
              canSpin && !spinning
                ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] text-[#3B82F6] border border-white/20 shadow-lg shadow-[#3B82F6]/20 hover:shadow-[#3B82F6]/40 transform hover:scale-105 active:scale-95'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
            style={{
              backgroundImage: canSpin && !spinning ? 'radial-gradient(circle, #333 0%, #000 70%)' : undefined,
            }}
          >
            {spinning ? 'Крутится...' : canSpin ? 'Крутить колесо!' : 'Попробуйте завтра'}
          </button>

          {/* Результат последнего вращения */}
          {lastResult && (
            <div className="mt-6 p-4 bg-white/5 backdrop-filter backdrop-blur-20 bg-opacity-5 rounded-2xl border border-white/10 w-full text-center">
              <h3 className="text-lg font-bold text-white mb-2">Ваш приз:</h3>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl">{lastResult.prize.icon}</span>
                <span className="text-white font-medium text-xl">{lastResult.prize.name}</span>
              </div>
              <p className="text-white/80 text-sm mt-1">{lastResult.prize.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WheelFortune;