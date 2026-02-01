import React, { useState, useEffect } from 'react';
import { Copy, Share2, Users, Gift, TrendingUp } from 'lucide-react';
import { getUserReferralInfo, shareReferralCode, copyReferralLink } from '../api/referralApi';

interface ReferralCardProps {
  className?: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ className = '' }) => {
  const [referralInfo, setReferralInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadReferralInfo();
  }, []);

  const loadReferralInfo = async () => {
    try {
      setLoading(true);
      const data = await getUserReferralInfo();
      setReferralInfo(data);
    } catch (error) {
      console.error('Error loading referral info:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
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

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <Users className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{referralInfo?.totalReferrals || 0}</p>
            <p className="text-white/80 text-xs">Привлечено</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <Gift className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{referralInfo?.totalBonuses || 0} ₽</p>
            <p className="text-white/80 text-xs">Выплачено</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <Gift className="w-6 h-6 text-white mx-auto mb-2" />
            <p className="text-xl font-bold text-white">{referralInfo?.pendingBonuses || 0} ₽</p>
            <p className="text-white/80 text-xs">Ожидает</p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl p-4 mb-6">
          <p className="text-center text-lg font-bold text-white break-all">{referralInfo?.referralCode || 'Загрузка...'}</p>
          <p className="text-center text-white/70 text-sm mt-2">Поделись этой ссылкой с друзьями</p>
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
      </div>
    </div>
  );
};

export default ReferralCard;