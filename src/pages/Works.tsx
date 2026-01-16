import React from 'react';
import { motion } from 'framer-motion';
import { PageKey } from '../App';
import { Car, ArrowLeft } from 'lucide-react';
import { ToyotaLogo, MitsubishiLogo, OpelLogo, VolkswagenLogo, LadaLogo } from '../components/BrandLogos';

interface WorkItem {
  id: string;
  carModel: string;
  carImage: string;
  postUrl: string;
  brandColor?: string;
}

interface WorksProps {
  onNavigate: (pageKey: PageKey) => void;
}

const Works: React.FC<WorksProps> = ({ onNavigate }) => {
  // Real data for work items with brand colors and text
  const workItems: WorkItem[] = [
    {
      id: '1',
      carModel: 'Toyota Isis',
      carImage: '',
      brandColor: '#E60000', // Toyota red
      postUrl: 'https://t.me/npdetailing/28'
    },
    {
      id: '2',
      carModel: 'Mitsubishi Lancer X',
      carImage: '',
      brandColor: '#FF0000', // Mitsubishi red
      postUrl: 'https://t.me/npdetailing/50'
    },
    {
      id: '3',
      carModel: 'Opel Astra H',
      carImage: '',
      brandColor: '#000000', // Opel black
      postUrl: 'https://t.me/npdetailing/65'
    },
    {
      id: '4',
      carModel: 'Lada Largus',
      carImage: '',
      brandColor: '#FF0000', // Lada red
      postUrl: 'https://t.me/npdetailing/10'
    },
    {
      id: '5',
      carModel: 'Volkswagen Polo',
      carImage: '',
      brandColor: '#008000', // Volkswagen green
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
            <div className="aspect-video overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 to-black/80">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute inset-0 backdrop-blur-3xl bg-white/5"></div>
              <div className="relative z-10 flex items-center justify-center w-1/3 h-1/3 rounded-full" style={{ backgroundColor: item.brandColor }}>
                {getBrandLogo(item.carModel.split(' ')[0])}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <Car className="w-5 h-5 text-cyan-300" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.carModel}</h3>
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