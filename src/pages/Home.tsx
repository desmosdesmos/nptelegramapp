import React from 'react';
import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App';
import SparklesIcon from '../components/SparklesIcon';

interface HomeProps { onNavigate: (pageKey: PageKey) => void; }

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  
  const handlePress = (pageKey: PageKey) => {
    hapticFeedback('medium');
    onNavigate(pageKey);
  };

  // Shared spring physics class for all interactive elements on this page
  const springClass = 'transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90';

  // Specific class for cards to add their own background/border transitions
  const cardBaseClass = 'relative h-full flex flex-col items-start justify-end p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer group';

  return (
    <div className='w-full h-[100dvh] flex flex-col items-center px-4 pt-4 pb-32 gap-3 bg-black text-white relative overflow-hidden select-none'>
      
      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-[10%] left-[-25%] w-[80%] h-[80%] bg-blue-600/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[5%] right-[-25%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[150px]" />
      </div>

      {/* HEADER */}
      <div className='relative z-10 flex flex-col items-center justify-center text-center mt-2'>
        <h1 className='text-3xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'>NP Auto Detail</h1>
        <div className='inline-flex items-center gap-1 py-0.5 px-3 mt-2 rounded-2xl backdrop-blur-md bg-white/10 border border-white/10'>
          <SparklesIcon className='w-3 h-3 text-white/70' />
          <p className='text-xs text-white/70 font-medium'>Чистота начинается здесь</p>
        </div>
      </div>

      {/* MAIN CTA BUTTON with Spring Physics */}
      <div className='relative z-10 w-full max-w-sm mx-auto'>
        <button 
          onClick={() => handlePress('Booking')} 
          className={`w-full h-12 bg-gradient-to-r from-[#4c6ef5] to-[#9d4edd] text-white font-bold uppercase text-sm rounded-xl pulse-shadow hover:shadow-lg active:scale-90 ${springClass}`}
        >
          Записаться онлайн
        </button>
      </div>

      {/* GRID with Spring Physics */}
      <div className='relative z-10 w-full max-w-sm mx-auto grid grid-cols-2 gap-3 mt-1 flex-1 min-h-0'>
        
        <div onClick={() => handlePress('Services')} className={`${cardBaseClass} ${springClass}`}>
            <span className='absolute text-[4rem] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] transition-transform duration-500 group-active:scale-110 group-active:rotate-3' style={{filter: 'grayscale(0)'}}>🫧</span>
            <p className='relative z-10 font-bold text-white text-base drop-shadow-md'>Услуги</p>
        </div>

        <div onClick={() => handlePress('Works')} className={`${cardBaseClass} ${springClass}`}>
            <span className='absolute text-[4rem] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] transition-transform duration-500 group-active:scale-110 group-active:-rotate-3' style={{filter: 'grayscale(0)'}}>📸</span>
            <p className='relative z-10 font-bold text-white text-base drop-shadow-md'>Работы</p>
        </div>

        <div onClick={() => handlePress('Reviews')} className={`${cardBaseClass} ${springClass}`}>
            <div className='absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-20'>5.0</div>
            <span className='absolute text-[4rem] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-yellow-300 transition-transform duration-500 group-active:scale-110' style={{filter: 'grayscale(0)'}}>⭐</span>
            <p className='relative z-10 font-bold text-white text-base drop-shadow-md'>Отзывы</p>
        </div>

        <div onClick={() => handlePress('Contacts')} className={`${cardBaseClass} ${springClass}`}>
            <span className='absolute text-[4rem] opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] transition-transform duration-500 group-active:scale-110 group-active:rotate-6' style={{filter: 'grayscale(0)'}}>📞</span>
            <p className='relative z-10 font-bold text-white text-base drop-shadow-md'>Контакты</p>
        </div>
      </div>
    </div>
  );
};

export default Home;