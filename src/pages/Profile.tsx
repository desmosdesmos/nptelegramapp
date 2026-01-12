import React, { useState, useEffect } from 'react';
import { User, Phone, ArrowLeft, ChevronRight } from 'lucide-react';
import { PageKey } from '../App';
import { ServiceIcon } from '../utils/iconMapper';
import {
  ClipboardText,
  Sparkle,
  CheckCircle,
  Car,
  Calendar,
  Clock
} from 'phosphor-react';
import {
  getCustomerProfile,
  getCustomerIdFromTelegram,
  CustomerProfile,
  ActiveOrder,
  VisitHistoryItem
} from '../api/adminApi';

interface ProfileProps {
  onNavigate: (page: PageKey) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        setLoading(true);
        const customerId = getCustomerIdFromTelegram();
        if (!customerId) {
          throw new Error('Не удалось получить ID клиента');
        }

        const profile = await getCustomerProfile(customerId);
        setCustomerProfile(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        console.error('Error fetching customer profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerProfile();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-white/70">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-black text-white p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold mt-4">Ошибка загрузки данных</h2>
          <p className="text-white/70 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-indigo-600 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Повторить попытку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen flex flex-col p-6 pt-12 pb-44 bg-black text-white'>
      <button
        onClick={() => onNavigate('Home')}
        className='flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors self-start'
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Назад</span>
      </button>

      <h1 className='text-3xl font-bold mb-8'>Профиль</h1>

      {/* Active Order Status Widget */}
      {customerProfile?.activeOrder && (
        <div className="w-full p-5 mb-6 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-black/40 border border-indigo-500/30 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Car weight="duotone" className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold">Текущий заказ</h2>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Car weight="duotone" className="w-4 h-4" />
              <span className="font-medium">{customerProfile.activeOrder.carModel}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between relative">
            {customerProfile.activeOrder.stages.map((stage, index) => {
              const isCurrent = !stage.completed && (index === 0 || customerProfile.activeOrder.stages[index - 1]?.completed);
              const isCompleted = stage.completed;
              const Icon = stage.icon;

              return (
                <div key={stage.id} className="flex flex-col items-center flex-1">
                  <div className="flex items-center justify-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCurrent
                        ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.7)] animate-pulse'
                        : isCompleted
                          ? 'bg-green-500/30 border border-green-500/50'
                          : 'bg-white/10 border border-white/20'
                      }
                    `}>
                      <Icon weight="duotone" className={`w-4 h-4 ${isCurrent ? 'text-white' : isCompleted ? 'text-green-400' : 'text-white/50'}`} />
                    </div>
                  </div>
                  <span className={`
                    text-xs mt-1 text-center truncate w-full
                    ${isCurrent ? 'text-indigo-300 font-medium' : isCompleted ? 'text-green-400' : 'text-white/50'}
                  `}>
                    {stage.name}
                  </span>

                  {/* Connector line */}
                  {index < customerProfile.activeOrder.stages.length - 1 && (
                    <div className={`
                      absolute top-4 h-0.5 w-1/3 z-[-1]
                      ${customerProfile.activeOrder.stages[index].completed ? 'bg-green-500/50' : 'bg-white/10'}
                      ${index === 0 ? 'left-[calc(33.33%+16px)]' : 'left-[calc(66.66%+16px)]'}
                    `}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visit History */}
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Calendar weight="duotone" className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Ваши посещения</h2>
        </div>

        <div className="space-y-3">
          {customerProfile?.visitHistory.map((visit) => (
            <div
              key={visit.id}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => console.log('View visit details', visit.id)}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center flex-shrink-0">
                <ServiceIcon title={visit.serviceName} size="md" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{visit.serviceName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Clock weight="duotone" className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{visit.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-purple-400 whitespace-nowrap">
                  {visit.price.toLocaleString('ru-RU')}&nbsp;₽
                </span>
                <ChevronRight className="w-4 h-4 text-white/50 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center text-center'>
        <div className='w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4'>
          <User className='w-12 h-12 text-white/50' />
        </div>
        <h2 className='text-xl font-semibold'>{customerProfile?.name || 'Имя не указано'}</h2>
        <div className='flex items-center gap-2 mt-2 text-gray-400'>
          <Phone className='w-4 h-4' />
          <span>{customerProfile?.phone || 'Телефон не указан'}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;