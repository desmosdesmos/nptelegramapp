import React, { useState, useEffect, useRef } from 'react';
import { WheelSpinResult } from '../types/wheel';
import { wheelPrizes } from '../data/wheelConfig';
import { hapticFeedback } from '../utils/telegram';

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
    const lastSpinDate = localStorage.getItem('wheel_last_spin_date');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastSpinDate === today) {
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
      switch (prize.rarity) {
        case 'common':
          fillColor = '#60A5FA'; // blue-400
          break;
        case 'rare':
          fillColor = '#34D399'; // green-400
          break;
        case 'epic':
          fillColor = '#A855F7'; // purple-500
          break;
        case 'legendary':
          fillColor = '#FBBF24'; // yellow-400
          break;
      }
      
      // Рисуем сектор
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      
      // Рисуем границу
      ctx.strokeStyle = '#1E293B'; // slate-800
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Рисуем текст
      ctx.save();
      ctx.rotate(startAngle + sectorAngle * Math.PI / 360);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Arial';
      
      // Поворачиваем текст к центру
      const textRadius = radius * 0.7;
      ctx.fillText(prize.icon, textRadius - 20, 5);
      
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
      setCanSpin(false);
      
      // Сохраняем результат
      localStorage.setItem('wheel_last_result', JSON.stringify(result));
      localStorage.setItem('wheel_last_spin_date', new Date().toISOString().split('T')[0]);
      
      // Обновляем серию
      const today = new Date().toISOString().split('T')[0];
      const lastSpinDate = localStorage.getItem('wheel_last_spin_date_prev');
      let newStreak = dailyStreak;
      
      if (!lastSpinDate || lastSpinDate !== today) {
        newStreak++;
        localStorage.setItem('wheel_daily_streak', newStreak.toString());
        setDailyStreak(newStreak);
        localStorage.setItem('wheel_last_spin_date_prev', today);
      }
      
      // Вызываем коллбэк
      onWin(result);
    }, 5000); // 5 секунд на анимацию
  };

  // Функция для получения случайного индекса приза с учетом редкости
  const getRandomPrizeIndex = (): number => {
    // Генерируем случайное число от 0 до 100
    const random = Math.random() * 100;

    // Определяем, к какому типу приза относится результат
    if (random < 99.99) {
      // 99.99% шанс на обычные призы (мелкие бонусы)
      const commonPrizes = wheelPrizes.filter(p => p.rarity === 'common');
      return wheelPrizes.indexOf(commonPrizes[Math.floor(Math.random() * commonPrizes.length)]);
    } else if (random < 99.99 + 3) {
      // 3% шанс на редкие призы (средние призы)
      const rarePrizes = wheelPrizes.filter(p => p.rarity === 'rare');
      return wheelPrizes.indexOf(rarePrizes[Math.floor(Math.random() * rarePrizes.length)]);
    } else if (random < 99.99 + 3 + 0) {
      // 0% шанс на эпические призы (дорогие призы)
      const epicPrizes = wheelPrizes.filter(p => p.rarity === 'epic');
      if (epicPrizes.length > 0) {
        return wheelPrizes.indexOf(epicPrizes[Math.floor(Math.random() * epicPrizes.length)]);
      }
    } else {
      // 0% шанс на легендарные призы
      const legendaryPrizes = wheelPrizes.filter(p => p.rarity === 'legendary');
      if (legendaryPrizes.length > 0) {
        return wheelPrizes.indexOf(legendaryPrizes[Math.floor(Math.random() * legendaryPrizes.length)]);
      }
    }

    // Если не удалось определить, возвращаем случайный обычный приз
    const commonPrizes = wheelPrizes.filter(p => p.rarity === 'common');
    return wheelPrizes.indexOf(commonPrizes[Math.floor(Math.random() * commonPrizes.length)]);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        ref={containerRef}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 max-w-md w-full border border-white/20 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Ежедневное колесо фортуны</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="relative flex flex-col items-center">
          {/* Колесо */}
          <div className="relative">
            <canvas 
              ref={canvasRef}
              className="rounded-full border-4 border-yellow-400 shadow-lg"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
              }}
            />
            
            {/* Указатель */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-400"></div>
            </div>
          </div>
          
          {/* Информация о серии */}
          <div className="mt-4 text-center">
            <p className="text-white/80">Дней подряд: <span className="font-bold text-yellow-400">{dailyStreak}</span></p>
          </div>
          
          {/* Кнопка вращения */}
          <button
            onClick={spinWheel}
            disabled={!canSpin || spinning}
            className={`mt-6 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              canSpin && !spinning
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-400 hover:to-yellow-500 transform hover:scale-105 active:scale-95'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {spinning ? 'Крутится...' : canSpin ? 'Крутить колесо!' : 'Попробуйте завтра'}
          </button>
          
          {/* Результат последнего вращения */}
          {lastResult && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-white/10 w-full text-center">
              <h3 className="text-lg font-bold text-white mb-2">Ваш приз:</h3>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{lastResult.prize.icon}</span>
                <span className="text-white font-medium">{lastResult.prize.name}</span>
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