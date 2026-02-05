import React from 'react';
import { PageKey } from '../App';
import { ArrowLeft } from 'lucide-react';

interface WorksProps {
  onNavigate: (pageKey: PageKey) => void;
}

const Works: React.FC<WorksProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-black text-white p-6 pt-12">
      <button
        onClick={() => onNavigate('Home')}
        className='flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors self-start'
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Назад</span>
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center">Наши работы</h1>
      
      <div className="text-center py-20">
        <p className="text-xl text-white/70">Раздел временно недоступен</p>
      </div>
    </div>
  );
};

export default Works;