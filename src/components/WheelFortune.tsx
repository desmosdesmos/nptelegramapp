import React, { useState, useRef } from 'react';
import { WheelSpinResult } from '../types/wheel';
import { prizeProbabilities } from '../data/wheelConfig';
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

  const containerRef = useRef<HTMLDivElement>(null);

  // Жёсткий список из 6 призов для гарантированного отображения
  const fixedPrizes = [
    { id: 'points-10', name: '10 бонусов' },
    { id: 'points-100', name: '100 бонусов' },
    { id: 'free-ozonation', name: 'Озонация' },
    { id: 'free-full-cleaning', name: 'Комплекс' },
    { id: 'free-pre-sale', name: 'Скидка 30%' },
    { id: 'points-1000', name: '1000 бонусов' }
  ];

  const numSectors = fixedPrizes.length;
  const sectorAngle = 360 / numSectors;
  const radius = 140;


  // Генерация clip-path для сектора
  const getClipPath = (index: number) => {
    const startAngle = (index * sectorAngle * Math.PI) / 180;
    const endAngle = ((index + 1) * sectorAngle * Math.PI) / 180;

    const x1 = 150 + radius * Math.cos(startAngle);
    const y1 = 150 + radius * Math.sin(startAngle);
    const x2 = 150 + radius * Math.cos(endAngle);
    const y2 = 150 + radius * Math.sin(endAngle);

    return `polygon(50% 50%, ${x1}px ${y1}px, ${x2}px ${y2}px)`;
  };

  // Рисуем колесо с помощью CSS (без SVG)
  const renderWheelCSS = () => {
    return (
      <div className="relative w-[300px] h-[300px]">
        {/* Подсветочное пятно */}
        <div 
          className="absolute inset-0 rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
            transform: 'translateZ(-10px)',
          }}
        />

        {/* Колесо — контейнер для секторов */}
        <div 
          className="absolute inset-0 rounded-full border border-white/10"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'transform 0.3s ease-out',
            background: 'transparent',
            boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 240, 255, 0.2)',
          }}
        >
          {/* Сектора */}
          {fixedPrizes.map((prize, index) => {
            const color = index % 2 === 0 ? '#1c1c1e' : 'rgba(20, 20, 30, 0.7)';
            const displayName =
              prize.id === 'points-10' ? '10₽' :
              prize.id === 'points-100' ? '100₽' :
              prize.id === 'points-1000' ? '1000₽' :
              prize.id === 'free-pre-sale' ? 'Скидка 30%' :
              prize.id === 'free-ozonation' ? 'Озонация' :
              prize.id === 'free-full-cleaning' ? 'Комплекс' :
              prize.name;

            const textAngleDeg = index * sectorAngle + sectorAngle / 2;
            const isBottomHalf = textAngleDeg > 180;
            // Встроенные вычисления позиции текста
            const offset = radius * 0.65;
            const x = 150 + offset * Math.cos((textAngleDeg * Math.PI) / 180);
            const y = 150 + offset * Math.sin((textAngleDeg * Math.PI) / 180);

            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 w-0 h-0"
                style={{
                  clipPath: getClipPath(index),
                  backgroundColor: hoveredSector === index ? '#2a2a2e' : color,
                  border: '0.8px solid rgba(255, 255, 255, 0.1)',
                  filter: 'drop-shadow(0 0 3px rgba(0, 240, 255, 0.05))',
                  transform: 'translate(-50%, -50%)',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={() => setHoveredSector(index)}
                onMouseLeave={() => setHoveredSector(null)}
              >
                {/* Текст внутри сектора */}
                <div
                  className="absolute whitespace-nowrap"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.98)',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                    transform: isBottomHalf
                      ? `rotate(${textAngleDeg - 180}deg) scale(-1, -1)`
                      : `rotate(${textAngleDeg}deg)`,
                    transformOrigin: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  {displayName}
                </div>
              </div>
            );
          })}
        </div>

        {/* Центральная кнопка (The Hub) */}
        <div
          className="absolute top-1/2 left-1/2 w-18 h-18 rounded-full bg-gradient-to-br from-[#3a3a4a] to-[#1a1a2a] border border-white/10 flex items-center justify-center cursor-pointer z-10"
          style={{
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.4))',
          }}
          onClick={spinning || !canSpin ? undefined : spinWheel}
        >
          <div className="text-white font-bold text-lg">SPIN</div>
        </div>

        {/* Неоновое пульсирующее кольцо вокруг центра */}
        <div
          className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full border-2 border-cyan-400 opacity-60 animate-pulse"
          style={{
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.7)',
          }}
        />

        {/* Указатель (The Pointer) */}
        <div 
          className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 z-20"
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

    const extraRotations = 3 + Math.floor(Math.random() * 4);
    const winningIndex = getRandomPrizeIndex();
    
    const calibrationOffset = -144;
    const targetRotation = calibrationOffset - winningIndex * sectorAngle;
    const normalizedRotation = ((targetRotation % 360) + 360) % 360;
    const finalRotation = normalizedRotation + extraRotations * 360;

    setRotation(finalRotation);

    setTimeout(() => {
      const prize = fixedPrizes[winningIndex]; // используем fixedPrizes для consistency
      const result: WheelSpinResult = {
        prize: {
          ...prize,
          type: prize.id.startsWith('points') ? 'points' : 'free_service',
          value: prize.id === 'points-10' ? 10 : prize.id === 'points-100' ? 100 : prize.id === 'points-1000' ? 1000 : prize.id,
          rarity: 'common',
          description: prize.name,
          icon: ''
        },
        sectorIndex: winningIndex,
        timestamp: Date.now()
      };

      setLastResult(result);
      setSpinning(false);
      setShowFullResult(true);

      // Сохраняем результат
      localStorage.setItem('wheel_last_result', JSON.stringify(result));

      // Добавляем награду
      if (result.prize.type === 'points') {
        const points = typeof result.prize.value === 'number' ? result.prize.value : 0;
        addPoints(points);
      } else if (result.prize.type === 'free_service') {
        addPrize({
          id: result.prize.id,
          name: result.prize.name,
          type: result.prize.type,
          description: result.prize.description
        });
      }

      const telegramUser = getTelegramUser();
      const isTester = telegramUser && telegramUser.username === 'yanvtg';

      if (isTester) {
        setCanSpin(true);
      } else {
        setCanSpin(false);
        localStorage.setItem('wheel_last_spin_date', new Date().toISOString().split('T')[0]);
      }

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

      onWin(result);
    }, 4000);
  };

  const getRandomPrizeIndex = (): number => {
    const specificPrizes = Object.keys(prizeProbabilities);
    const random = Math.random() * 100;
    let cumulativeProbability = 0;

    for (const prizeId of specificPrizes) {
      const probability = prizeProbabilities[prizeId as keyof typeof prizeProbabilities];
      cumulativeProbability += probability;

      if (random <= cumulativeProbability) {
        const prizeIndex = fixedPrizes.findIndex(p => p.id === prizeId);
        return prizeIndex !== -1 ? prizeIndex : 0;
      }
    }

    return 0;
  };

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
          {/* Колесо (CSS) */}
          {renderWheelCSS()}

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

          {/* Результат последнего вращения */}
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