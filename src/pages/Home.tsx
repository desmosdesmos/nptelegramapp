import React from 'react';
import { PageKey } from '../App';
import ScaleButton from '../components/ScaleButton';
import SparklesIcon from '../components/SparklesIcon';

interface HomeProps { onNavigate: (pageKey: PageKey) => void; }

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className='w-full h-[100dvh] overflow-hidden flex flex-col items-center text-center px-4 pt-4 pb-40 gap-3 bg-black text-white relative'>
      
      {/* CSS For Depth */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-[10%] left-[-25%] w-[80%] h-[80%] bg-blue-600/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[5%] right-[-25%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <div className='relative z-10 flex flex-col items-center justify-center text-center mt-4'>
        <h1 className='text-3xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent'>NP Auto Detail</h1>
        <div className='inline-flex items-center gap-1 py-0.5 px-3 mt-2 rounded-full backdrop-blur-md bg-white/10 border border-white/10'>
          <SparklesIcon className='w-3 h-3 text-white/70' />
          <p className='text-xs text-white/70 font-medium'>ЧИСТОТА НАЧИНАЕТСЯ ЗДЕСЬ</p>
        </div>
      </div>

      {/* Main CTA */}
      <div className='relative z-10 w-full max-w-sm mx-auto mt-4'>
        <ScaleButton>
          <button onClick={() => onNavigate('Booking')} className='w-full h-12 bg-gradient-to-r from-[#4c6ef5] to-[#9d4edd] text-white font-bold uppercase text-sm rounded-xl shadow-[0_0_20px_rgba(157,78,221,0.5)] animate-pulse'>
            Записаться онлайн
          </button>
        </ScaleButton>
      </div>

      {/* Bento Grid */}
      <div className='relative z-10 w-full max-w-sm mx-auto grid grid-cols-2 gap-3 mt-3 flex-1'>
        <ScaleButton>
          <div onClick={() => onNavigate('Services')} className='relative h-24 flex flex-col items-start justify-end p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
            <span className='absolute text-[5rem] opacity-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' style={{filter: 'grayscale(0)'}}>🫧</span>
            <p className='relative z-10 font-bold text-white text-sm'>Услуги</p>
          </div>
        </ScaleButton>

        <ScaleButton>
          <div onClick={() => onNavigate('Works')} className='relative h-24 flex flex-col items-start justify-end p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
            <span className='absolute text-[5rem] opacity-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' style={{filter: 'grayscale(0)'}}>📸</span>
            <p className='relative z-10 font-bold text-white text-sm'>Работы</p>
          </div>
        </ScaleButton>

        <ScaleButton>
          <div onClick={() => onNavigate('Reviews')} className='relative h-24 flex flex-col items-start justify-end p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
            <div className='absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full'>5.0</div>
            <span className='absolute text-[5rem] opacity-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-300' style={{filter: 'grayscale(0)'}}>⭐</span>
            <p className='relative z-10 font-bold text-white text-sm'>Отзывы</p>
          </div>
        </ScaleButton>

        <ScaleButton>
          <div onClick={() => onNavigate('Contacts')} className='relative h-24 flex flex-col items-start justify-end p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden'>
            <span className='absolute text-[5rem] opacity-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-400' style={{filter: 'grayscale(0)'}}>📞</span>
            <p className='relative z-10 font-bold text-white text-sm'>Контакты</p>
          </div>
        </ScaleButton>
      </div>
    </div>
  );
};

export default Home;
