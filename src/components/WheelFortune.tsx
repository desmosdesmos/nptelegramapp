import React, { useState, useEffect, useRef } from 'react';
import { WheelSpinResult } from '../types/wheel';
import { wheelPrizes, prizeProbabilities } from '../data/wheelConfig';
import { hapticFeedback, getTelegramUser } from '../utils/telegram';
import { addPoints, addPrize } from '../utils/rewardsSystem';

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
  const [showFullResult, setShowFullResult] = useState(false);

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


  // Функция для получения координат для размещения текста и иконки
  const getTextPosition = (index: number, offset: number) => {
    const angle = (index * sectorAngle + sectorAngle / 2) * Math.PI / 180;
    const x = 150 + offset * Math.cos(angle);
    const y = 150 + offset * Math.sin(angle);
    return { x, y };
  };

  // Рисуем колесо с помощью SVG в стиле iOS 16+
  const renderWheel = () => {
    const radius = 140;

    return (
      <svg
        ref={svgRef}
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="rounded-full border border-white/10"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'transform 0.3s ease-out',
          background: 'radial-gradient(circle, #1a1a2e 0%, #0d0d1a 70%)',
          boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(100, 181, 246, 0.15)',
        }}
      >
        {/* Внешний обод с мягким градиентом */}
        <circle
          cx="150"
          cy="150"
          r="148"
          fill="none"
          stroke="url(#softBorderGradient)"
          strokeWidth="1"
          strokeOpacity="0.3"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(100, 181, 246, 0.1))'
          }}
        />

        {/* Градиент для мягкого обода */}
        <defs>
          <linearGradient id="softBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a4a6a" />
            <stop offset="50%" stopColor="#3a3a5a" />
            <stop offset="100%" stopColor="#2a2a4a" />
          </linearGradient>

          {/* Мягкий градиент для центра */}
          <radialGradient id="centerGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#e0e0f0" />
            <stop offset="70%" stopColor="#b0b0d0" />
            <stop offset="100%" stopColor="#606080" />
          </radialGradient>
        </defs>

        {/* Сектора колеса с мягкими цветами */}
        {wheelPrizes.map((prize, index) => {
          const pathData = calculateSectorPath(index, radius);
          // Мягкие цвета вместо резких
          const color = prize.rarity === 'common' ? '#3a3a5a' :
                       prize.rarity === 'rare' ? '#4a4a6a' :
                       prize.rarity === 'epic' ? '#5a5a8a' :
                       '#6a6ab0';

          // Получаем позицию для подписи
          const labelPos = getTextPosition(index, radius * 0.58);
          const adjustedY = labelPos.y + (numSectors === 6 ? 14 : 10);

          return (
            <g key={index}>
              {/* Сектор с мягким переходом */}
              <path
                d={pathData}
                fill={hoveredSector === index ? '#7a7ac0' : color}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="0.3"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(100, 181, 246, 0.05))',
                  transition: 'fill 0.3s ease'
                }}
                onMouseEnter={() => setHoveredSector(index)}
                onMouseLeave={() => setHoveredSector(null)}
              />

              {/* Подпись приза - мягкий белый цвет */}
              <text
                x={labelPos.x}
                y={adjustedY}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(255, 255, 255, 0.85)"
                fontWeight="500"
                letterSpacing="0.03em"
                opacity="0.9"
              >
                {prize.name}
              </text>
            </g>
          );
        })}

        {/* Центральное колесо (кнопка "NP") */}
        <circle
          cx="150"
          cy="150"
          r="32"
          fill="url(#centerGradient)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="0.8"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(100, 181, 246, 0.2))'
          }}
        />

        {/* Мягкое кольцо вокруг центра */}
        <circle
          cx="150"
          cy="150"
          r="34"
          fill="none"
          stroke="rgba(100, 181, 246, 0.3)"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          style={{
            animation: spinning ? 'pulse 2s infinite' : 'none',
            filter: 'drop-shadow(0 0 8px rgba(100, 181, 246, 0.1))'
          }}
        />

        {/* Анимация пульсации */}
        <style>{`
          @keyframes pulse {
            0% { stroke-opacity: 0.2; }
            50% { stroke-opacity: 0.4; }
            100% { stroke-opacity: 0.2; }
          }
        `}</style>

        <text
          x="150"
          y="155"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="14"
          fill="rgba(255, 255, 255, 0.95)"
          fontWeight="600"
          stroke="rgba(0, 0, 0, 0.2)"
          strokeWidth="0.5"
          letterSpacing="0.05em"
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
    setShowFullResult(false);

    // Добавляем случайное количество оборотов (3-6) плюс смещение для нужного сектора
    const extraRotations = 3 + Math.floor(Math.random() * 4);
    const winningIndex = getRandomPrizeIndex();
    
    // ФИНАЛЬНАЯ КАЛИБРОВКА: на основе всех тестов
    // При normalizedRotation = 0° показывается "Предпродажка" (индекс 4)
    // Значит, нужно смещение: 0° → индекс 4, поэтому для индекса 0 нужно: 0° - 4*36° = -144°
    const calibrationOffset = -144;
    const targetRotation = calibrationOffset - winningIndex * sectorAngle;
    
    // Нормализуем и добавляем обороты
    const normalizedRotation = ((targetRotation % 360) + 360) % 360;
    const finalRotation = normalizedRotation + extraRotations * 360;

    setRotation(finalRotation);

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
      setShowFullResult(true); // Показываем полноэкранный результат

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

      // Добавляем награду в систему
      if (result.prize.type === 'points') {
        let points = 0;
        if (typeof result.prize.value === 'string') {
          points = parseInt(result.prize.value.replace('points-', ''), 10);
        } else if (typeof result.prize.value === 'number') {
          points = result.prize.value;
        }
        addPoints(points);
      } else if (result.prize.type === 'free_service') {
        addPrize({
          id: result.prize.id,
          name: result.prize.name,
          type: result.prize.type,
          description: result.prize.description
        });
      }

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

  // Компонент для полноэкранного результата
  const FullScreenResult = () => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] rounded-3xl p-8 max-w-md w-full border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-6">
            <span className="text-4xl font-bold text-white">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Поздравляем!</h2>
          <p className="text-cyan-300 mb-6">Вы выиграли:</p>
        </div>
        
        <div className="mb-8">
          <div className="text-5xl font-bold text-[#00ffff] mb-4">
            {lastResult?.prize.name}
          </div>
          <p className="text-white/80 text-lg">
            {lastResult?.prize.description}
          </p>
        </div>

        <button
          onClick={() => setShowFullResult(false)}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Продолжить
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={containerRef}
        className="bg-black/20 backdrop-filter backdrop-blur-32 bg-opacity-70 rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-xl shadow-white/5 backdrop-saturate-150"
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
            className={`mt-6 px-6 py-3.5 rounded-2xl font-medium text-base transition-all duration-300 ${
              canSpin && !spinning
                ? 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/15 hover:border-white/30 transform hover:scale-105 active:scale-95'
                : 'bg-black/30 text-white/50 cursor-not-allowed'
            }`}
          >
            {spinning ? 'Крутится...' : canSpin ? 'Крутить колесо!' : 'Попробуйте завтра'}
          </button>

          {/* Результат последнего вращения (для старых браузеров/резерв) */}
          {lastResult && !showFullResult && (
            <div className="mt-6 mb-8 p-4 bg-black/30 backdrop-filter backdrop-blur-20 bg-opacity-5 rounded-2xl border border-cyan-500/20 w-full text-center">
              <h3 className="text-lg font-bold text-white mb-2">Ваш приз:</h3>
              <div className="flex items-center justify-center gap-2">
                <span className="text-white font-medium text-xl">{lastResult.prize.name}</span>
              </div>
              <p className="text-white/80 text-sm mt-1">{lastResult.prize.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Полноэкранный результат */}
      {showFullResult && <FullScreenResult />}
    </div>
  );
};

export default WheelFortune;