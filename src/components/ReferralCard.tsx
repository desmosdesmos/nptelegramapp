import React, { useState } from 'react';
import { Copy, Share2, Users, Gift, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { shareReferralCode, copyReferralLink } from '../api/referralApi';
import { useReferral } from '../contexts/ReferralContext';

interface ReferralCardProps {
  className?: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ className = '' }) => {
  const { referralInfo, loading: contextLoading } = useReferral();
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopyLink = async () => {
    if (referralInfo?.referralLink) {
      const success = await copyReferralLink(referralInfo.referralLink);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleShareCode = () => {
    if (referralInfo?.referralCode) {
      shareReferralCode(referralInfo.referralCode);
    }
  };

  if (contextLoading) {
    return (
      <div className={`w-full p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 ${className}`}>
        <div className="animate-pulse">
          <h2 className="text-2xl font-bold text-white mb-2">Загрузка...</h2>
          <p className="text-white/80 mb-4">Ваша реферальная информация</p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="h-6 bg-white/30 rounded mb-2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl relative overflow-hidden ${className}`}>
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-yellow-300" />
          <h2 className="text-2xl font-bold text-white">Реферальная программа</h2>
        </div>
        <p className="text-white/80 mb-6">Приведи друга на комплексную химчистку и получи 300₽ на карту!</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{referralInfo?.totalReferrals || 0}</p>
            <p className="text-white/80 text-xs">Привлечено</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <Gift className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{referralInfo?.bookedReferrals || 0}</p>
            <p className="text-white/80 text-xs">Записалось</p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl p-4 mb-6">
          <p className="text-center text-lg font-bold text-white break-all">{referralInfo?.referralCode || 'Загрузка...'}</p>
          <p className="text-center text-white/70 text-sm mt-2">Ваш реферальный код</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white font-medium"
          >
            <Copy className="w-5 h-5" />
            {copied ? 'Скопировано!' : 'Копировать ссылку'}
          </button>
          <button
            onClick={handleShareCode}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white font-medium"
          >
            <Share2 className="w-5 h-5" />
            Поделиться
          </button>
        </div>

        {/* Кнопка для отображения деталей рефералов */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white font-medium"
        >
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          {showDetails ? 'Скрыть детали' : 'Показать рефералов (' + (referralInfo?.referrals?.length || 0) + ')'}
        </button>

        {/* Детали рефералов */}
        {showDetails && referralInfo?.referrals && (
          <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 max-h-60 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-3">Ваши рефералы:</h3>
            {referralInfo.referrals.length > 0 ? (
              <ul className="space-y-2">
                {referralInfo.referrals.map((referral: any, index: number) => (
                  <li key={index} className="bg-white/10 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-white">{referral.name || 'Неизвестный пользователь'}</span>
                      <span className="text-white">
                        {referral.status === 'completed' ? '✅' : '⏳'}
                        {referral.bonusAmount}₽
                      </span>
                    </div>
                    <div className="text-xs text-white/70 mt-1">
                      {referral.dateJoined ? new Date(referral.dateJoined).toLocaleDateString('ru-RU') : ''}
                      {referral.serviceType && ` • ${referral.serviceType}`}
                      {referral.referralCode && ` • ${referral.referralCode}`}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/70 text-center py-2">Пока нет рефералов</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralCard;