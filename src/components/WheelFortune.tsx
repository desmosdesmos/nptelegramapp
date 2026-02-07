import React, { useState, useRef } from 'react';
import { WheelSpinResult } from '../types/wheel';
import { wheelPrizes, prizeProbabilities } from '../data/wheelConfig';
import { hapticFeedback, getTelegramUser } from '../utils/telegram';
import { addPoints, addPrize } from '../utils/rewardsSystem';

interface WheelFortuneProps {
  onWin: (result: WheelSpinResult) => Promise<void> | void;
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

  const numSectors = wheelPrizes.length;
  const sectorAngle = 360 / numSectors;
  const radius = 140;

  const getTextPosition = (index: number, offset: number) => {
    const angle = (index * sectorAngle + sectorAngle / 2) * Math.PI / 180;
    const x = 150 + offset * Math.cos(angle);
    const y = 150 + offset * Math.sin(angle);
    return { x, y };
  };

  const calculateSectorPath = (index: number, radius: number) => {
    const startAngle = (index * sectorAngle * Math.PI) / 180;
    const endAngle = ((index + 1) * sectorAngle * Math.PI) / 180;

    const x1 = 150 + radius * Math.cos(startAngle);
    const y1 = 150 + radius * Math.sin(startAngle);
    const x2 = 150 + radius * Math.cos(endAngle);
    const y2 = 150 + radius * Math.sin(endAngle);

    return `M 150 150 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  const renderWheel = () => {
    return (
      <div className="relative">
        {/* Подсветочное пятно */}
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
            className="rounded-full border border-white/10"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'transform 0.3s ease-out',
              background: 'transparent',
              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 240, 255, 0.2)',
            }}
          >
          {/* Внешний металлический обод */}
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

          <defs>
            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a4a4a" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#4a4a4a" />
            </linearGradient>

            <radialGradient id="hubGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#3a3a4a" />
              <stop offset="40%" stopColor="#2a2a3a" />
              <stop offset="70%" stopColor="#1a1a2a" />
              <stop offset="100%" stopColor="#0d0d1a" />
            </radialGradient>

            <linearGradient id="metalTextGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e0e0" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#c0c0c0" />
            </linearGradient>
          </defs>

          {/* Сектора */}
          {wheelPrizes.map((_, index) => {
            const pathData = calculateSectorPath(index, radius);
            const color = index % 2 === 0 ? '#1c1c1e' : 'rgba(20, 20, 30, 0.7)';
            
            // Жёсткие названия для всех 6 секторов
            const displayName = [
              '10₽',
              '100₽',
              'Озонация',
              'Комплекс',
              'Скидка 30%',
              '1000₽'
            ][index] || 'Приз';

            const labelPos = getTextPosition(index, radius * 0.65);
            const textAngleDeg = index * sectorAngle + sectorAngle / 2;
            const transformString = `rotate(${textAngleDeg} ${labelPos.x} ${labelPos.y})`;

            return (
              <g key={index}>
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
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fill="rgba(255, 255, 255, 0.98)"
                  fontWeight="700"
                  letterSpacing="0.02em"
                  opacity="1"
                  transform={transformString}
                  className="font-sans font-bold"
                  style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}
                >
                  {displayName}
                </text>
              </g>
            );
          })}

          {/* Центральная кнопка */}
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

          <style>{`
            @keyframes pulse {
              0% { stroke-opacity: 0.3; filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.4)); }
              50% { stroke-opacity: 0.8; filter: drop-shadow(0 0 30px rgba(0, 240, 255, 0.8)); }
              100% { stroke-opacity: 0.3; filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.4)); }
            }
          `}</style>
        </svg>

        {/* Указатель */}
        <div 
          className="absolute top-[-16px] left-1/2 transform -translate-x-1/2 z-30"
          style={{
            filter: 'drop-shadow(0 8px 15px rgba(0, 240, 255, 0.6))',
          }}
        >
          <svg width="32" height="16" viewBox="0 0 32 16">
            <polygon points="16,0 32,8 16,16 0,8" fill="#00f0ff" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </svg>
        </div>
      </div>
    );
  };

  const spinWheel = async () => {
    if (!canSpin || spinning) return;
    hapticFeedback('medium');
    setSpinning(true);
    setLastResult(null);

    // Немедленно устанавливаем canSpin в false и сохраняем время вращения
    const now = Date.now();
    localStorage.setItem('lastSpinTime', String(now));
    setCanSpin(false);

    // Вызываем событие для обновления состояния в других компонентах
    const storageEvent = new StorageEvent('storage', {
      key: 'lastSpinTime',
      oldValue: null,
      newValue: String(now),
      url: window.location.href,
      storageArea: localStorage
    });
    window.dispatchEvent(storageEvent);

    const extraRotations = 3 + Math.floor(Math.random() * 4);
    const winningIndex = getRandomPrizeIndex();
    const calibrationOffset = -144;
    const targetRotation = calibrationOffset - winningIndex * sectorAngle;
    const normalizedRotation = ((targetRotation % 360) + 360) % 360;
    const finalRotation = normalizedRotation + extraRotations * 360;
    setRotation(finalRotation);

    setTimeout(async () => {
      const prize = wheelPrizes[winningIndex];
      const result: WheelSpinResult = {
        prize,
        sectorIndex: winningIndex,
        timestamp: Date.now()
      };

      setLastResult(result);
      setSpinning(false);

      localStorage.setItem('wheel_last_result', JSON.stringify(result));

      if (prize.type === 'points') {
        const points = typeof prize.value === 'number' ? prize.value : 0;
        await addPoints(points);
      } else if (prize.type === 'free_service') {
        await addPrize({
          id: prize.id,
          name: prize.name,
          type: prize.type,
          description: prize.description
        });
      }

      // Убираем специальное поведение для тестеров - теперь все пользователи имеют одинаковые условия
      const today = new Date().toISOString().split('T')[0];
      const lastSpinDate = localStorage.getItem('wheel_last_spin_date_prev');
      let newStreak = dailyStreak;
      if (!lastSpinDate || lastSpinDate !== today) {
        newStreak++;
        localStorage.setItem('wheel_daily_streak', newStreak.toString());
        setDailyStreak(newStreak);
        localStorage.setItem('wheel_last_spin_date_prev', today);
      }

      await onWin(result);
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
        return wheelPrizes.findIndex(p => p.id === prizeId);
      }
    }
    return 0;
  };


  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {!lastResult && (
        <div
          ref={containerRef}
          className="bg-black/20 backdrop-filter backdrop-blur-32 bg-opacity-70 rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-xl shadow-white/5 backdrop-saturate-150"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white font-system">Ежедневное колесо фортуны</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white text-xl">✕</button>
          </div>

          <div className="relative flex flex-col items-center">
            {renderWheel()}
            <div className="mt-4 text-center">
              <p className="text-white/80 font-system">Дней подряд: <span className="font-bold text-[#00ffff]">{dailyStreak}</span></p>
            </div>

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

            {lastResult ? (
              <div className="mt-6 mb-8 p-4 bg-black/30 backdrop-filter backdrop-blur-20 bg-opacity-5 rounded-2xl border border-cyan-500/20 w-full text-center">
                <h3 className="text-lg font-bold text-white mb-2">Ваш приз:</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-white font-medium text-xl">{(lastResult as WheelSpinResult).prize.name}</span>
                </div>
                <p className="text-white/80 text-sm mt-1">{(lastResult as WheelSpinResult).prize.description}</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {lastResult && <FullScreenResult result={lastResult} onClose={() => {
        onClose(); // Закрываем модальное окно
      }} />}
    </div>
  );
};

interface FullScreenResultProps {
  result: WheelSpinResult;
  onClose: () => void;
}

const FullScreenResult: React.FC<FullScreenResultProps> = ({ result, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-2xl flex items-center justify-center z-50 p-4 animate-fade-in-up">
      <div className="bg-gradient-to-br from-gray-900 to-black/90 rounded-3xl p-8 max-w-md w-full border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 text-center relative overflow-hidden">
        {/* Декоративный элемент */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

        <div className="mb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 mb-6 shadow-lg">
            <span className="text-5xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 font-system">
            Поздравляем!
          </h2>
          <p className="text-cyan-300/80 font-system text-sm tracking-wide">Вы выиграли:</p>
        </div>

        <div className="mb-8 relative z-10">
          <div
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            style={{
              textShadow: '0 2px 10px rgba(0, 240, 255, 0.3)',
            }}
          >
            {result.prize.name}
          </div>
          <p className="text-white/80 text-lg font-system leading-relaxed">
            {result.prize.description}
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold rounded-full text-lg hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg w-full"
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 240, 255, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.1)'
          }}
        >
          Вернуться в приложение
        </button>
      </div>
    </div>
  );
};









export default WheelFortune;