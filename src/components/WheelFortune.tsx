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

  // Функция для получения координат для размещения текста (от центра к краю)
  const getTextPosition = (index: number, offset: number) => {
    const angle = (index * sectorAngle + sectorAngle / 2) * Math.PI / 180;
    const x = 150 + offset * Math.cos(angle);
    const y = 150 + offset * Math.sin(angle);
    return { x, y };
  };

  // Рисуем колесо с помощью SVG в стиле Futuristic Automotive Dashboard
  const renderWheel = () => {
    const radius = 140;

    return (
      <div className="relative">
        {/* Подсветочное пятно под колесом (плавающий эффект) */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
            transform: 'translateZ(-10px)',
          }}
        />

        <svg
          ref={svgRef}
          width="300"
          height="300"
          viewBox="0 0 300 300"
          className="rounded-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'transform 0.3s ease-out',
            background: 'transparent',
            boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 240, 255, 0.2)',
          }}
        >
          {/* Внешний металлический обод (4px) */}
          <circle
            cx="150"
            cy="150"
            r="148"
            fill="none"
            stroke="url(#metalGradient)"
            strokeWidth="4"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.3))'
            }}
          />

          {/* Градиент для металлического обода */}
          <defs>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a4a4a" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#4a4a4a" />
            </linearGradient>

            {/* Неоновое свечение для указателя */}
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Сектора колеса (стеклянные лепестки) */}
          {wheelPrizes.map((prize, index) => {
            const pathData = calculateSectorPath(index, radius);
            // Чередуем цвета: Deep Carbon и Semi-Transparent Black
            const color = index % 2 === 0 ? '#1c1c1e' : 'rgba(0, 0, 0, 0.5)';
            
            // Короткое название для отображения
            let displayName = prize.name;
            if (prize.id === 'points-10') displayName = '10';
            if (prize.id === 'points-100') displayName = '100';
            if (prize.id === 'points-1000') displayName = '1000';
            if (prize.id === 'free-pre-sale') displayName = 'Скидка';
            if (prize.id === 'ozone') displayName = 'Озон';

            // Получаем позицию для подписи (от центра к краю)
            const labelPos = getTextPosition(index, radius * 0.65);
            // Угол для поворота текста (чтобы шел от центра к краю)
            const textAngle = (index * sectorAngle + sectorAngle / 2) * (Math.PI / 180);

            return (
              <g key={index}>
                {/* Сектор с тонкой обводкой (эффект стеклянных лепестков) */}
                <path
                  d={pathData}
                  fill={hoveredSector === index ? '#2a2a2e' : color}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="0.8"
                  style={{
                    filter: 'drop-shadow(0 0 3px rgba(0, 240, 255, 0.05))',
                    transition: 'fill 0.3s ease'
                  }}
                  onMouseEnter={() => setHoveredSector(index)}
                  onMouseLeave={() => setHoveredSector(null)}
                />

                {/* Текст внутри сектора (от центра к краю) */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  fontSize="12"
                  fill="white"
                  fontWeight="700"
                  letterSpacing="0.02em"
                  opacity="0.95"
                  transform={`rotate(${textAngle * 180 / Math.PI} ${labelPos.x} ${labelPos.y})`}
                  className="font-sans font-bold"
                >
                  {displayName}
                </text>
              </g>
            );
          })}

          {/* Центральная кнопка (The Hub) - плоская, утопленная */}
          <circle
            cx="150"
            cy="150"
            r="36"
            fill="url(#hubGradient)"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.4))',
            }}
          />

          {/* Неоновое пульсирующее кольцо вокруг центра */}
          <circle
            cx="150"
            cy="150"
            r="40"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2"
            strokeOpacity="0.6"
            style={{
              animation: spinning ? 'pulse 2s infinite' : 'none',
              filter: 'drop-shadow(0 0 20px rgba(0, 240, 255, 0.7))',
            }}
          />

          {/* Градиент для центральной кнопки */}
          <defs>
            <radialGradient id="hubGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#3a3a4a" />
              <stop offset="40%" stopColor="#2a2a3a" />
              <stop offset="70%" stopColor="#1a1a2a" />
              <stop offset="100%" stopColor="#0d0d1a" />
            </radialGradient>

            {/* Анимация пульсации */}
            <style>{`
              @keyframes pulse {
                0% { stroke-opacity: 0.3; filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.4)); }
                50% { stroke-opacity: 0.8; filter: drop-shadow(0 0 30px rgba(0, 240, 255, 0.8)); }
                100% { stroke-opacity: 0.3; filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.4)); }
              }
            `}</style>
          </defs>

          {/* Текст "SPIN" в центре (металлический) */}
          <text
            x="150"
            y="155"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="16"
            fill="url(#metalTextGradient)"
            fontWeight="700"
            letterSpacing="0.05em"
            className="font-sans font-bold"
          >
            SPIN
          </text>

          {/* Градиент для металлического текста */}
          <defs>
            <linearGradient id="metalTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e0e0" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#c0c0c0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Указатель (The Pointer) - перевернутый треугольник с неоновым свечением */}
        <div 
          className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 z-30"
          style={{
            filter: 'drop-shadow(0 8px 15px rgba(0, 240, 255, 0.6))',
          }}
        >
          <svg width="32" height="16" viewBox="0 0 32 16" className="overflow-visible">
            <polygon
              points="16,0 32,8 16,16 0,8"
              fill="#00f0ff"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />
          </svg>
        </div>
      </div>
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

          {/* Результат последнего вращения (резерв) */}
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

        {/* Полноэкранный результат */}
        {showFullResult && <FullScreenResult />}
      </div>
    </div>
  );
};

export default WheelFortune;