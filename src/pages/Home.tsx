import React from 'react';
import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App';
import ScaleButton from '../components/ScaleButton';
import SparklesIcon from '../components/SparklesIcon';
import { House, Calendar, User, Sparkles } from 'lucide-react';

interface HomeProps { onNavigate: (pageKey: PageKey) => void; }

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const handleNavigation = (pageKey: PageKey) => {
    hapticFeedback('light');
    onNavigate(pageKey);
  };

  return (
    <div className='w-full h-[100dvh] flex flex-col items-center px-4 pt-4 pb-20 gap-3 bg-black text-white relative overflow-hidden'>
      
      {/* COMPACT HEADER */}
      <div className='flex flex-col items-center justify-center text-center mt-2'>
        <h1 className='text-3xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'>NP Auto Detail</h1>
        <div className='inline-flex items-center gap-1 py-0.5 px-3 mt-2 rounded-2xl backdrop-blur-md bg-white/10 border border-white/10'>
          <SparklesIcon className='w-3 h-3 text-white/70' />
          <p className='text-xs text-white/70 font-medium'>Чистота начинается здесь</p>
        </div>
      </div>

      {/* COMPACT CTA BUTTON */}
      <div className='w-full max-w-sm mx-auto'>
        <ScaleButton>
          <button onClick={() => handleNavigation('Booking')} className='w-full h-14 bg-gradient-to-r from-[#4c6ef5] to-[#9d4edd] text-white font-bold uppercase text-sm rounded-xl shadow-[0_0_15px_rgba(157,78,221,0.4)] active:scale-95 transition-transform'>
            Записаться онлайн
          </button>
        </ScaleButton>
      </div>

      {/* RECTANGULAR GRID (Saves Space) */}
      <div className='w-full max-w-sm mx-auto grid grid-cols-2 gap-3 mt-1 flex-1'>
        <ScaleButton>
          <div onClick={() => handleNavigation('Services')} className='relative h-full min-h-[90px] flex flex-col items-center justify-center p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
            <span className='absolute text-[4rem] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>🫧</span>
            <p className='relative z-10 font-bold text-white text-sm mt-auto ml-auto'>Услуги</p>
          </div>
        </ScaleButton>

        <ScaleButton>
          <div onClick={() => handleNavigation('Works')} className='relative h-full min-h-[90px] flex flex-col items-center justify-center p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
            <span className='absolute text-[4rem] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>📸</span>
            <p className='relative z-10 font-bold text-white text-sm mt-auto ml-auto'>Работы</p>
          </div>
        </ScaleButton>

        <ScaleButton>
          <div onClick={() => handleNavigation('Reviews')} className='relative h-full min-h-[90px] flex flex-col items-center justify-center p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
            <span className='absolute text-[4rem] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>⭐</span>
            <p className='relative z-10 font-bold text-white text-sm mt-auto ml-auto'>Отзывы</p>
            <div className='absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full'>5.0</div>
          </div>
        </ScaleButton>

        <ScaleButton>
          <div onClick={() => handleNavigation('Contacts')} className='relative h-full min-h-[90px] flex flex-col items-center justify-center p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
            <span className='absolute text-[4rem] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>📞</span>
            <p className='relative z-10 font-bold text-white text-sm mt-auto ml-auto'>Контакты</p>
          </div>
        </ScaleButton>
      </div>

      {/* COMPACT DOCK */}
      <div className='w-[90%] max-w-xs bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/10 rounded-full px-4 py-3 flex justify-between items-center shadow-2xl z-50 mb-4'>
        <button onClick={() => handleNavigation('Home')} className='flex flex-col items-center gap-0.5 text-white'>
          <House className='w-5 h-5' />
          <span className='text-[9px] font-medium'>Главная</span>
        </button>
        <button onClick={() => handleNavigation('Services')} className='flex flex-col items-center gap-0.5 text-white/50 hover:text-white'>
          <Sparkles className='w-5 h-5' />
          <span className='text-[9px] font-medium'>Услуги</span>
        </button>
        <button onClick={() => handleNavigation('Booking')} className='flex flex-col items-center gap-0.5 text-white/50 hover:text-white'>
          <Calendar className='w-5 h-5' />
          <span className='text-[9px] font-medium'>Запись</span>
        </button>
        <button onClick={() => handleNavigation('Profile')} className='flex flex-col items-center gap-0.5 text-white/50 hover:text-white'>
          <User className='w-5 h-5' />
          <span className='text-[9px] font-medium'>Профиль</span>
        </button>
      </div>
    </div>
  );
};

export default Home;