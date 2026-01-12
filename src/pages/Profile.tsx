import React, { useState } from 'react';
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

interface ProfileProps {
  onNavigate: (page: PageKey) => void;
}

// Mock data
const mockActiveOrder = {
  id: 'order-123',
  carModel: 'BMW X5',
  status: 'IN_PROGRESS', // 'ACCEPTED', 'IN_PROGRESS', 'READY'
  stages: [
    { id: 'accepted', name: 'Принят', icon: ClipboardText, completed: true },
    { id: 'in-progress', name: 'В работе', icon: Sparkle, completed: true },
    { id: 'ready', name: 'Готово', icon: CheckCircle, completed: false }
  ]
};

const mockHistory = [
  {
    id: 'visit-1',
    serviceName: 'Комплексная химчистка',
    date: '12 Окт 2024',
    price: 12000,
    icon: '🧹'
  },
  {
    id: 'visit-2',
    serviceName: 'Предпродажная подготовка',
    date: '5 Сен 2024',
    price: 8999,
    icon: '🚗'
  },
  {
    id: 'visit-3',
    serviceName: 'Полировка кузова',
    date: '20 Авг 2024',
    price: 15000,
    icon: '✨'
  },
  {
    id: 'visit-4',
    serviceName: 'Химчистка салона',
    date: '10 Июл 2024',
    price: 6999,
    icon: '🧽'
  }
];

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [activeOrder] = useState(mockActiveOrder);
  const [history] = useState(mockHistory);

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
      {activeOrder && (
        <div className="w-full p-5 mb-6 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-black/40 border border-indigo-500/30 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Car weight="duotone" className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold">Текущий заказ</h2>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Car weight="duotone" className="w-4 h-4" />
              <span className="font-medium">{activeOrder.carModel}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between relative">
            {activeOrder.stages.map((stage, index) => {
              const isCurrent = !stage.completed && (index === 0 || activeOrder.stages[index - 1]?.completed);
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
                  {index < activeOrder.stages.length - 1 && (
                    <div className={`
                      absolute top-4 h-0.5 w-1/3 z-[-1]
                      ${activeOrder.stages[index].completed ? 'bg-green-500/50' : 'bg-white/10'}
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
          {history.map((visit) => (
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
        <h2 className='text-xl font-semibold'>Ivan Ivanov</h2>
        <div className='flex items-center gap-2 mt-2 text-gray-400'>
          <Phone className='w-4 h-4' />
          <span>+7 999 123-45-67</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;