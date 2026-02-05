import React from 'react';
import { motion } from 'framer-motion';
import { PageKey } from '../App';
import { ArrowLeft } from 'lucide-react';

interface WorkItem {
  id: string;
  carModel: string;
  carImage: string;
  postUrl: string;
  brandColor?: string;
  logoPngUrl?: string;
}

interface WorksProps {
  onNavigate: (pageKey: PageKey) => void;
}

const Works: React.FC<WorksProps> = ({ onNavigate }) => {
  // Упрощенные данные для работы
  const workItems: WorkItem[] = [
    {
      id: '1',
      carModel: 'Toyota Isis',
      carImage: '',
      brandColor: '#E60000', // Toyota red
      postUrl: 'https://t.me/npdetailing/28',
      logoPngUrl: ''
    },
    {
      id: '2',
      carModel: 'Mitsubishi Lancer X',
      carImage: '',
      brandColor: '#FF0000', // Mitsubishi red
      postUrl: 'https://t.me/npdetailing/50',
      logoPngUrl: ''
    },
    {
      id: '3',
      carModel: 'Opel Astra H',
      carImage: '',
      brandColor: '#000000', // Opel black
      postUrl: 'https://t.me/npdetailing/65',
      logoPngUrl: ''
    },
    {
      id: '4',
      carModel: 'Lada Largus',
      carImage: '',
      brandColor: '#FF0000', // Lada red
      postUrl: 'https://t.me/npdetailing/10',
      logoPngUrl: ''
    },
    {
      id: '5',
      carModel: 'Volkswagen Polo',
      carImage: '',
      brandColor: '#008000', // Volkswagen green
      postUrl: 'https://t.me/npdetailing/33',
      logoPngUrl: ''
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const openPost = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-12 pb-44">
      <button
        onClick={() => onNavigate('Home')}
        className='flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors self-start'
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Назад</span>
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center">Наши работы</h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {workItems.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            className="relative flex flex-col justify-between h-72 overflow-hidden rounded-2xl bg-gray-900 border border-white/10 backdrop-blur-sm cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            onClick={() => openPost(item.postUrl)}
          >
            {/* Упрощенная область для логотипа */}
            <div className="flex-grow flex items-center justify-center p-4 relative z-10">
              <div className="w-32 h-32 flex items-center justify-center text-xl font-bold text-white/50 bg-gray-700/50 rounded-full">
                {item.carModel.split(' ')[0]}
              </div>
            </div>

            {/* Футер с размытым фоном */}
            <div className="relative z-20 p-4 bg-white/10 backdrop-blur-md border-t border-white/20">
              <h3 className="text-lg font-bold text-white text-center">{item.carModel}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 text-center">
        <p className="text-white/60 mb-4">Больше работ смотрите в нашем Telegram канале</p>
        <button
          onClick={() => window.open('https://t.me/npdetailing', '_blank')}
          className="px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
        >
          Перейти в канал
        </button>
      </div>
    </div>
  );
};

export default Works;