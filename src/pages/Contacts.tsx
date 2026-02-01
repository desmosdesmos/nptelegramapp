import { hapticFeedback, openTelegramLink } from '../utils/telegram';
import { useState, useEffect } from 'react';
import { Users, Gift } from 'lucide-react';
import { getUserReferralStats } from '../api/referralApi';

interface ContactsProps {
  onNavigate: (page: string) => void;
}

const Contacts: React.FC<ContactsProps> = ({ onNavigate }) => {
  const [referralStats, setReferralStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralStats();
  }, []);

  const loadReferralStats = async () => {
    try {
      const stats = await getUserReferralStats();
      setReferralStats(stats);
    } catch (error) {
      console.error('Error loading referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramClick = () => {
    hapticFeedback('light');
    openTelegramLink('https://t.me/yanvtg');
  };

  const handleYandexMapsClick = () => {
    hapticFeedback('light');
    window.open('https://yandex.ru/maps/org/np_detail/173294910771/?ll=45.985120%2C51.545949&pt=45.9525%2C51.5336&utm_source=share&z=17', '_blank');
  };

  const handleTelegramChannelClick = () => {
    hapticFeedback('light');
    openTelegramLink('https://t.me/npdetailing');
  };

  const handlePhoneClick = () => {
    hapticFeedback('light');
    window.location.href = 'tel:+79063163114';
  };

  const handleReferralClick = () => {
    hapticFeedback('light');
    // Перенаправляем пользователя на страницу профиля, где он может увидеть полную информацию о реферальной программе
    onNavigate('Profile');
  };

  const contactItems = [
    {
      icon: '📍',
      title: 'Адрес',
      value: 'ГСК Микрон (Кировский район)',
      action: handleYandexMapsClick,
      actionLabel: 'Построить маршрут'
    },
    {
      icon: '📞',
      title: 'Телефон',
      value: '+7 (906) 316-31-14',
      action: handlePhoneClick,
      actionLabel: 'Позвонить'
    },
    {
      icon: '⏰',
      title: 'Режим работы',
      value: 'Пн - Вс: 09:00 - 19:00',
    },
    {
      icon: '💬',
      title: 'Telegram для связи',
      value: '@yanvtg',
      action: handleTelegramClick,
      actionLabel: 'Написать'
    },
    {
      icon: '👥',
      title: 'Реферальная программа',
      value: loading ? 'Загрузка...' : `${referralStats?.totalReferrals || 0} привлечено`,
      action: handleReferralClick,
      actionLabel: 'Подробнее'
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 pb-16 fade-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Контакты</h2>

        <div className="space-y-6">
          {/* Unified Contact Card */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="space-y-6">
              {contactItems.map(item => (
                <div key={item.title} className="flex items-start gap-4">
                  <span className="text-2xl mt-1">{item.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white/80 text-base">{item.title}</h3>
                    <p className="text-white/60 text-sm mt-1">{item.value}</p>
                    {item.action && (
                       <button onClick={item.action} className="mt-2 text-blue-400 font-semibold text-xs hover:underline">
                        {item.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Stats Summary */}
          {!loading && referralStats && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-white/10 backdrop-blur-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-white/80 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-xs">Привлечено</span>
                  </div>
                  <p className="text-xl font-bold text-white">{referralStats.totalReferrals}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-white/80 mb-1">
                    <Gift className="w-4 h-4" />
                    <span className="text-xs">Бонусов</span>
                  </div>
                  <p className="text-xl font-bold text-white">{referralStats.totalBonuses} ₽</p>
                </div>
              </div>
              <p className="text-center text-white/60 text-xs mt-3">
                Перейдите в профиль для подробной информации
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <button
              onClick={handleTelegramChannelClick}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 px-6 rounded-2xl text-lg"
            >
              Наш Telegram канал
            </button>

            <button
              onClick={handleYandexMapsClick}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold py-3 px-5 rounded-2xl"
            >
              Мы на Яндекс Картах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;