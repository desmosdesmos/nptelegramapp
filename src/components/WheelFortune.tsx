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
  const [hoveredSector, setHoveredSector] = useState<number | null>(null);

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

    // Если не попали в заданные вероятности, возвращаем самый распространенный приз (10 бонусов)
    const defaultPrizeIndex = wheelPrizes.findIndex(p => p.id === 'points-10');
    return defaultPrizeIndex !== -1 ? defaultPrizeIndex : 0;
  };

  // Функция для расчета координат сектора
  const calculateSectorPath = (index: number, radius: number) => {
    const startAngle = (index * sectorAngle * Math.PI) / 180;
    const endAngle = ((index + 1) * sectorAngle * Math.PI) / 180;

    const x1 = 150 + radius * Math.cos(startAngle);
    const y1 = 150 + radius * Math.sin(startAngle);
    const x2 = 150 + radius * Math.cos(endAngle);
    const y2 = 150 + radius * Math.sin(endAngle);

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
    const radius = 140;

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
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)',
        }}
      >
        {/* Внешний обод с мягким металлическим эффектом */}
        <circle
          cx="150"
          cy="150"
          r="148"
          fill="none"
          stroke="url(#metalGradient)"
          strokeWidth="1"
          strokeOpacity="0.2"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.3))'
          }}
        />

        {/* Градиент для мягкого металлического обода */}
        <defs>
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#666" />
            <stop offset="50%" stopColor="#aaa" />
            <stop offset="100%" stopColor="#666" />
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
          const pathData = calculateSectorPath(index, radius);
          const color = getSectorColor(prize.rarity);

          // Получаем позицию для подписи
          const labelPos = getTextPosition(index, radius * 0.52);

          return (
            <g key={index}>
              {/* Сектор */}
              <path
                d={pathData}
                fill={hoveredSector === index ? '#3c3c5a' : color}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="0.5"
                style={{
                  filter: 'drop-shadow(0 0 3px rgba(0, 255, 255, 0.1))',
                  transition: 'fill 0.3s ease'
                }}
                onMouseEnter={() => setHoveredSector(index)}
                onMouseLeave={() => setHoveredSector(null)}
              />

              {/* Подпись приза в секторе - без иконок, только текст */}
              <text
                x={labelPos.x}
                y={labelPos.y + 10}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="500"
                letterSpacing="0.05em"
                opacity="0.95"
              >
                {prize.name}
              </text>
            </g>
          );
        })}

        {/* Центральное колесо (кнопка "SPIN") */}
        <circle
          cx="150"
          cy="150"
          r="32"
          fill="url(#centerGradient)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(0, 255, 255, 0.5))'
          }}
        />
        
        {/* Пульсирующее светящееся кольцо вокруг центра */}
        <circle
          cx="150"
          cy="150"
          r="34"
          fill="none"
          stroke="#00ffff"
          strokeWidth="2"
          strokeOpacity="0.2"
          style={{
            animation: spinning ? 'pulse 2s infinite' : 'none',
            filter: 'drop-shadow(0 0 12px rgba(0, 255, 255, 0.6))'
          }}
        />
        
        <defs>
          <radialGradient id="centerGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e0e0e0" />
            <stop offset="40%" stopColor="#c0c0c0" />
            <stop offset="70%" stopColor="#808080" />
            <stop offset="100%" stopColor="#202020" />
          </radialGradient>
          
          {/* Анимация пульсации */}
          <style>{`
            @keyframes pulse {
              0% { stroke-opacity: 0.2; }
              50% { stroke-opacity: 0.6; }
              100% { stroke-opacity: 0.2; }
            }
          `}</style>
        </defs>
        
        <text
          x="150"
          y="155"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill="#00ffff"
          fontWeight="bold"
          stroke="#000"
          strokeWidth="1"
          letterSpacing="0.05em"
        >
          SPIN
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
        className="bg-[#0a0a0a] backdrop-filter backdrop-blur-20 bg-opacity-5 rounded-3xl p-6 max-w-md w-full border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
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

            {/* Указатель (изящный треугольник с закругленными углами) */}
            <div className="absolute top-[-14px] left-1/2 transform -translate-x-1/2 z-20">
              <svg width="28" height="14" viewBox="0 0 28 14" className="overflow-visible">
                <polygon
                  points="14,0 28,7 14,14 0,7"
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  style={{
                    filter: 'drop-shadow(0 0 6px #00ffff), drop-shadow(0 0 12px rgba(0, 255, 255, 0.5))'
                  }}
                />
              </svg>
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
                ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] text-[#00ffff] border border-cyan-500/30 shadow-lg shadow-[#00ffff]/20 hover:shadow-[#00ffff]/40 transform hover:scale-105 active:scale-95'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
            }`}
          >
            {spinning ? 'Крутится...' : canSpin ? 'Крутить колесо!' : 'Попробуйте завтра'}
          </button>

          {/* Результат последнего вращения */}
          {lastResult && (
            <div className="mt-6 p-4 bg-black/30 backdrop-filter backdrop-blur-20 bg-opacity-5 rounded-2xl border border-cyan-500/20 w-full text-center">
              <h3 className="text-lg font-bold text-white mb-2">Ваш приз:</h3>
              <div className="flex items-center justify-center gap-2">
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