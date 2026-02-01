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

  const svgRef = useRef<SVGSVGElement>(null);
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

  // Функция для расчета координат сектора
  const calculateSectorPath = (index: number, radius: number) => {
    const startAngle = (index * sectorAngle * Math.PI) / 180;
    const endAngle = ((index + 1) * sectorAngle * Math.PI) / 180;

    // Рассчитываем точки для сектора
    const x1 = 150 + radius * Math.cos(startAngle);
    const y1 = 150 + radius * Math.sin(startAngle);
    const x2 = 150 + radius * Math.cos(endAngle);
    const y2 = 150 + radius * Math.sin(endAngle);

    // Создаем путь для сектора
    return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  // Функция для определения цвета сектора в зависимости от редкости
  const getSectorColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '#2c3e50'; // Темно-серый для обычных призов
      case 'rare':
        return '#34495e'; // Средне-темный серый для редких
      case 'epic':
        return '#3c3c5a'; // Темно-фиолетовый для эпических
      case 'legendary':
        return '#5a3c5a'; // Темно-пурпурный для легендарных
      default:
        return '#2c3e50'; // Темно-серый по умолчанию
    }
  };

  // Функция для получения координат для размещения текста и иконки
  const getTextPosition = (index: number, offset: number) => {
    const angle = (index * sectorAngle + sectorAngle / 2) * Math.PI / 180;
    const x = 150 + offset * Math.cos(angle);
    const y = 150 + offset * Math.sin(angle);
    return { x, y };
  };

  // Рисуем колесо с помощью SVG
  const renderWheel = () => {
    return (
      <svg
        ref={svgRef}
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="rounded-full border border-transparent shadow-lg"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'transform 0.3s ease-out',
          background: 'radial-gradient(circle, #2c3e50 0%, #1a1a1a 70%)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.3)',
        }}
      >
        {/* Внешний обод с металлической текстурой */}
        <circle
          cx="150"
          cy="150"
          r="148"
          fill="none"
          stroke="url(#metalGradient)"
          strokeWidth="4"
          style={{
            filter: 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.7))'
          }}
        />

        {/* Градиент для металлического обода */}
        <defs>
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#aaa" />
            <stop offset="50%" stopColor="#eee" />
            <stop offset="100%" stopColor="#aaa" />
          </linearGradient>

          {/* Градиент для неонового свечения */}
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Сектора колеса */}
        {wheelPrizes.map((prize, index) => {
          const pathData = calculateSectorPath(index, 140);
          const color = getSectorColor(prize.rarity);

          // Получаем позиции для иконки и текста
          const iconPos = getTextPosition(index, 140 * 0.65);
          const textPos = getTextPosition(index, 140 * 0.45);

          // Рассчитываем угол для поворота текста
          const textAngle = index * sectorAngle + sectorAngle / 2;
          // Корректируем угол, чтобы текст был удобочитаем
          const correctedTextAngle = textAngle > 90 && textAngle < 270 ? textAngle + 180 : textAngle;

          return (
            <g key={index}>
              {/* Сектор */}
              <path
                d={pathData}
                fill={color}
                stroke="#00ffff" // Неоново-циановая граница
                strokeWidth="2"
                style={{
                  filter: 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.7))'
                }}
              />

              {/* Иконка в секторе */}
              <text
                x={iconPos.x}
                y={iconPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fill="white"
                fontWeight="bold"
              >
                {prize.icon}
              </text>

              {/* Название приза в секторе */}
              <text
                x={textPos.x}
                y={textPos.y}
                textAnchor="middle"
                fontSize="8"
                fill="white"
                fontWeight="normal"
                transform={`rotate(${correctedTextAngle}, ${textPos.x}, ${textPos.y})`}
              >
                {prize.name.length > 10 ? `${prize.name.substring(0, 10)}...` : prize.name}
              </text>
            </g>
          );
        })}

        {/* Центральное колесо (кнопка "Spin") */}
        <circle
          cx="150"
          cy="150"
          r="30"
          fill="#1a1a1a"
          stroke="#00ffff"
          strokeWidth="2"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.8))'
          }}
        />
        <text
          x="150"
          y="155"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill="#00ffff"
          fontWeight="bold"
        >
          NP
        </text>
      </svg>
    );
  };

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
    }, 4000); // 4 секунды на анимацию
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={containerRef}
        className="bg-[#0a0a0a] backdrop-filter backdrop-blur-20 bg-opacity-5 rounded-3xl p-6 max-w-md w-full border border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
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
            {renderWheel()}

            {/* Указатель */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#00ffff] shadow-[0_0_10px_2px_rgba(0,255,255,0.7)]"></div>
            </div>
          </div>

          {/* Информация о серии */}
          <div className="mt-4 text-center">
            <p className="text-white/80 font-system">Дней подряд: <span className="font-bold text-[#00ffff]">{dailyStreak}</span></p>
          </div>

          {/* Кнопка вращения */}
          <button
            onClick={spinWheel}
            disabled={!canSpin || spinning}
            className={`mt-6 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
              canSpin && !spinning
                ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] text-[#00ffff] border border-cyan-500/50 shadow-lg shadow-[#00ffff]/30 hover:shadow-[#00ffff]/50 transform hover:scale-105 active:scale-95'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            {spinning ? 'Крутится...' : canSpin ? 'Крутить колесо!' : 'Попробуйте завтра'}
          </button>

          {/* Результат последнего вращения */}
          {lastResult && (
            <div className="mt-6 p-4 bg-black/30 backdrop-filter backdrop-blur-20 bg-opacity-5 rounded-2xl border border-cyan-500/30 w-full text-center">
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