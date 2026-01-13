import React from 'react';
import { motion } from 'framer-motion';
import { PageKey } from '../App';
import { Car, ArrowLeft } from 'lucide-react';

interface WorkItem {
  id: string;
  carModel: string;
  carImage: string;
  postUrl: string;
}

interface WorksProps {
  onNavigate: (pageKey: PageKey) => void;
}

const Works: React.FC<WorksProps> = ({ onNavigate }) => {
  // Real data for work items with better images
  const workItems: WorkItem[] = [
    {
      id: '1',
      carModel: 'Toyota Isis',
      carImage: 'https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      postUrl: 'https://t.me/npdetailing/28'
    },
    {
      id: '2',
      carModel: 'Mitsubishi Lancer X',
      carImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      postUrl: 'https://t.me/npdetailing/50'
    },
    {
      id: '3',
      carModel: 'Opel Astra H',
      carImage: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      postUrl: 'https://t.me/npdetailing/65'
    },
    {
      id: '4',
      carModel: 'Lada Largus',
      carImage: 'https://images.unsplash.com/photo-1599818542445-ef32dbe7b063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      postUrl: 'https://t.me/npdetailing/10'
    },
    {
      id: '5',
      carModel: 'Volkswagen Polo',
      carImage: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      postUrl: 'https://t.me/npdetailing/33'
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
            className="relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl cursor-pointer hover:-translate-y-1 transition-transform duration-300 shadow-lg"
            onClick={() => openPost(item.postUrl)}
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={item.carImage}
                alt={item.carModel}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Car className="w-5 h-5 text-cyan-300" />
                </div>
                <h3 className="text-lg font-bold text-white drop-shadow-lg">{item.carModel}</h3>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute bottom-4 right-4">
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
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