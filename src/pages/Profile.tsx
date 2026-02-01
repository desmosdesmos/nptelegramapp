import React, { useState } from 'react';
import { User, Phone, MessageCircle, Copy, Share2, Award } from 'lucide-react';
import { PageKey } from '../App';
import { getTelegramUser } from '../utils/telegram';
import ReferralCard from '../components/ReferralCard';

interface ProfileProps {
  onNavigate: (page: PageKey) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const telegramUser = getTelegramUser();

  const copyCode = () => {
    navigator.clipboard.writeText('NP2026');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  const shareCode = () => {
    const shareText = 'Промокод на 500₽ в NP: NP2026. Используй его при первой записи в @nptime_bot и получай скидку ❤️';

    if (navigator.share) {
      navigator.share({
        title: 'Промокод для автосервиса',
        text: shareText
        // Убрали url, чтобы отправлялся только текст
      }).catch(console.error);
    } else {
      // Fallback: just copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Текст промокода скопирован в буфер обмена!');
    }
  };

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

      {/* Old Promo Card - теперь как дополнительная информация */}
      <div className="w-full p-6 mb-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Подари другу 500₽</h2>
          <p className="text-white/80 mb-4">на комплексную химчистку салона, и получи себе бонусы на повторное посещение</p>

          <div className="bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl p-4 mb-6">
            <p className="text-center text-lg font-bold text-white">NP2026</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={copyCode}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white font-medium"
            >
              <Copy className="w-5 h-5" />
              {copied ? 'Скопировано!' : 'Скопировать'}
            </button>
            <button
              onClick={shareCode}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white font-medium"
            >
              <Share2 className="w-5 h-5" />
              Отправить
            </button>
          </div>
        </div>
      </div>

      {/* Referral Program Info */}
      <div className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
        <h3 className="text-xl font-bold text-white mb-3">Как работает реферальная программа?</h3>
        <ul className="space-y-2 text-white/80">
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Поделись своей реферальной ссылкой с друзьями</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Твой друг записывается на комплексную химчистку через твою ссылку</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>После оказания услуги ты получаешь 300₽ на карту</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 mt-1">✓</span>
            <span>Без ограничений - сколько приведёшь, столько и получишь</span>
          </li>
        </ul>
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