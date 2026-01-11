import React from 'react';
import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App';
import ScaleButton from '../components/ScaleButton';
import SparklesIcon from '../components/SparklesIcon';

interface HomeProps { onNavigate: (pageKey: PageKey) => void; }

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  
  const handlePress = (pageKey: PageKey) => {
    hapticFeedback('medium');
    onNavigate(pageKey);
  };

  const cardClass = 'relative h-full flex flex-col items-start justify-end p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:scale-[0.96] active:bg-white/10 active:border-white/20 cursor-pointer';

  return (
    <div className='w-full h-[100dvh] flex flex-col items-center px-4 pt-4 pb-32 gap-3 bg-black text-white relative overflow-hidden'>
      
      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-[10%] left-[-25%] w-[80%] h-[80%] bg-blue-600/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[5%] right-[-25%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[150px]" />
      </div>

      {/* HEADER */}
      <div className='relative z-10 flex flex-col items-center justify-center text-center mt-4'>
        <h1 className='text-3xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'>NP Auto Detail</h1>
        <div className='inline-flex items-center gap-1 py-0.5 px-3 mt-2 rounded-2xl backdrop-blur-md bg-white/10 border border-white/10'>
          <SparklesIcon className='w-3 h-3 text-white/70' />
          <p className='text-xs text-white/70 font-medium'>ЧИСТОТА НАЧИНАЕТСЯ ЗДЕСЬ</p>
        </div>
      </div>

      {/* MAIN CTA */}
      <div className='relative z-10 w-full max-w-sm mx-auto mt-4'>
        <ScaleButton>
          <button onClick={() => handlePress('Booking')} className='w-full h-12 bg-gradient-to-r from-[#4c6ef5] to-[#9d4edd] text-white font-bold uppercase text-sm rounded-xl shadow-[0_0_20px_rgba(157,78,221,0.5)] animate-pulse active:scale-[0.97] transition-transform duration-150'>
            Записаться онлайн
          </button>
        </ScaleButton>
      </div>

      {/* COMPACT BENTO GRID */}
      <div className='relative z-10 w-full max-w-sm mx-auto grid grid-cols-2 gap-3 mt-3 flex-1 min-h-0'>
        
        <div onClick={() => handlePress('Services')} className={cardClass}>
          <span className='absolute text-[4rem] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]' style={{filter: 'grayscale(0)'}}>🫧</span>
          <p className='relative z-10 font-bold text-white text-base drop-shadow-md'>Услуги</p>
        </div>

        <div onClick={() => handlePress('Works')} className={cardClass}>
          <span className='absolute text-[4rem] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]' style={{filter: 'grayscale(0)'}}>📸</span>
          <p className='relative z-10 font-bold text-white text-base drop-shadow-md'>Работы</p>
        </div>

        <div onClick={() => handlePress('Reviews')} className={cardClass}>
          <div className='absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full'>5.0</div>
          <span className='absolute text-[4rem] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-yellow-300' style={{filter: 'grayscale(0)'}}>⭐</span>
          <p className='relative z-10 font-bold text-white text-base drop-shadow-md'>Отзывы</p>
        </div>

        <div onClick={() => handlePress('Contacts')} className={cardClass}>
          <span className='absolute text-[4rem] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]' style={{filter: 'grayscale(0)'}}>📞</span>
          <p className='relative z-10 font-bold text-white text-base drop-shadow-md'>Контакты</p>
        </div>
      </div>
    </div>
  );
};

export default Home;