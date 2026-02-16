import React, { useState, useEffect } from 'react';
import { User, Phone, MessageCircle, Award } from 'lucide-react';
import { PageKey } from '../App';
import { getTelegramUser } from '../utils/telegram';
import ReferralCard from '../components/ReferralCard';
import { getPoints, getPrizes } from '../utils/rewardsSystem';

interface ProfileProps {
  onNavigate: (page: PageKey) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [timerData, setTimerData] = useState({ timeLeft: null as { hours: number; minutes: number; seconds: number } | null, canSpin: true });

  useEffect(() => {
    const initializeTimer = async () => {
      // Так как хук нельзя вызвать асинхронно, будем использовать его напрямую
      const rewards = await import('../utils/rewardsSystem').then(mod => mod.getUserRewards());
      const lastSpin = rewards.lastSpinTime || 0;
      const now = Date.now();
      const nextSpinTime = lastSpin + 24 * 60 * 60 * 1000; // +24 часа
      const diff = nextSpinTime - now;

      if (diff <= 0) {
        setTimerData({ timeLeft: null, canSpin: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimerData({ timeLeft: { hours, minutes, seconds }, canSpin: false });
      }
    };

    initializeTimer();
  }, []);

  const { timeLeft, canSpin } = timerData;
  const [phoneCopied, setPhoneCopied] = useState(false);
  const [points, setPoints] = useState<number>(0);
  const [prizes, setPrizes] = useState<Array<{ id: string; name: string; type: string; description?: string; timestamp: number }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const telegramUser = getTelegramUser();

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setLoading(true);
        
        // Принудительно обновляем кэш данных с сервера при открытии профиля
        const rewardsModule = await import('../utils/rewardsSystem');
        await rewardsModule.getUserRewards(); // Это обновит кэш
        
        // Затем получаем обновленные данные
        const pointsData = await getPoints();
        const prizesData = await getPrizes();
        setPoints(pointsData);
        setPrizes(prizesData);
      } catch (error) {
        console.error('Error loading rewards:', error);
        setPoints(0);
        setPrizes([]);
      } finally {
        setLoading(false);
      }
    };

    // Также обновляем данные рефералов при открытии профиля
    const referralCardElement = document.querySelector('.referral-card');
    if (referralCardElement) {
      // Если компонент уже загружен, вызываем обновление
      window.dispatchEvent(new CustomEvent('referralUpdate'));
    }

    loadRewards();
  }, []);

  const handleTelegramClick = () => {
    // Open Telegram with a predefined message
    window.open('https://t.me/yanvtg', '_blank');
  };

  const handlePhoneClick = () => {
    const phoneNumber = '+79063163114';
    navigator.clipboard.writeText(phoneNumber);
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2000);
  };

  return (
    <div className='w-full min-h-screen flex flex-col p-6 pt-12 pb-44 bg-black text-white'>
      <button
        onClick={() => onNavigate('Home')}
        className='flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors self-start'
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className='font-medium'>Назад</span>
      </button>

      <h1 className='text-3xl font-bold mb-8'>Профиль</h1>

      {/* Daily Spin Timer */}
      {timeLeft && (
        <div className="mb-6 text-center text-sm text-gray-400">
          Следующая рулетка через:
          <span className="font-mono font-medium text-white ml-1">
            {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>
      )}
      {!timeLeft && canSpin && (
        <div className="mb-6 text-center text-sm text-green-400">
          🎯 Сегодня можно крутить рулетку!
        </div>
      )}

      {/* User Profile Card */}
      <div className="w-full p-5 mb-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {telegramUser?.photo_url ? (
            <img
              src={telegramUser.photo_url}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{telegramUser?.first_name || 'Пользователь'} {telegramUser?.last_name || ''}</h2>
              <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-black rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" /> Gold Client
              </span>
            </div>
            <p className="text-white/60">{'+7 (XXX) XXX-XX-XX'}</p>
          </div>
        </div>
      </div>

      {/* Referral Card */}
      <ReferralCard className="mb-8" />


      {/* Referral Program Info */}
      <div className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
        <h3 className="text-xl font-bold text-white mb-3">Как работает реферальная программа?</h3>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Твоя реферальная ссылка генерируется автоматически</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Поделись ей с друзьями - когда они перейдут и запишутся на комплексную химчистку, ты получишь 300₽</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Бонусы начисляются автоматически после оказания услуги</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Нет нужды вводить промокоды - всё происходит автоматически</span>
          </li>
        </ul>
      </div>

      {/* Мои награды */}
      <div className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Мои награды</h3>

        {/* Бонусы */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-white">Бонусы</h4>
            {loading ? (
              <span className="text-2xl font-bold text-[#00ffff]">Загрузка...</span>
            ) : (
              <span className="text-2xl font-bold text-[#00ffff]">{points} ₽</span>
            )}
          </div>
          <p className="text-white/70 text-sm">Накопленные бонусы можно использовать для оплаты услуг</p>
          <p className="text-white/50 text-xs mt-1">Можно списать на детейлинг-услуги до 50%</p>
        </div>

        {/* Призы */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Призы</h4>
          {loading ? (
            <p className="text-white/60 italic">Загрузка призов...</p>
          ) : prizes.length === 0 ? (
            <p className="text-white/60 italic">Пока нет призов. Крутите колесо фортуны ежедневно!</p>
          ) : (
            <div className="space-y-3">
              {prizes.map((prize, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">🎁</span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{prize.name}</div>
                      {prize.description && (
                        <div className="text-white/70 text-sm">{prize.description}</div>
                      )}
                    </div>
                  </div>
                  <span className="text-white/60 text-sm">
                    {new Date(prize.timestamp).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contacts Section */}
      <div className="w-full">
        <h3 className="text-lg font-semibold mb-4">Связаться с нами</h3>
        <div className="space-y-4">
          <button
            onClick={handleTelegramClick}
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-blue-400" />
            <span>Написать в Telegram</span>
          </button>
          <button
            onClick={handlePhoneClick}
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <Phone className="w-6 h-6 text-green-400" />
            <span>{phoneCopied ? 'Номер телефона скопирован!' : 'Позвонить'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;