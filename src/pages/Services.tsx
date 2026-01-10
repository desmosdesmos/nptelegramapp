import React from 'react';
import { motion } from 'framer-motion';
import { PageKey } from '../App';
import { mainServices, localCleaningServices } from '../data/services';
import type { Service } from '../types/services';
import ScaleButton from '../components/ScaleButton';

interface ServicesProps {
  onNavigate: (pageKey: PageKey) => void;
}

// 1. Read-Only "Complex" Card
const ServiceCardComplex: React.FC<{ service: Service }> = ({ service }) => {
  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <motion.div variants={cardVariants} className="relative">
      <ScaleButton>
        <div
          className="relative w-full p-6 border rounded-3xl cursor-default
            bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border-[rgba(255,255,255,0.1)]"
        >
          <div className="relative z-10">
            <h4 className="text-2xl font-bold mb-2 text-white">{service.name}</h4>
            {service.description && <p className="text-base text-white/70 mb-4 opacity-70" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
            <span className="text-4xl font-bold text-cyan-400">{service.price.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </ScaleButton>
    </motion.div>
  );
};

// 2. Read-Only "Local Service" Row
const ServiceRow: React.FC<{ service: Service }> = ({ service }) => {
  const rowVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
  };

  return (
    <motion.div variants={rowVariants}>
      <div className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl">
        <div className="flex items-center gap-4">
          {service.icon && <span className="text-2xl">{service.icon}</span>}
          <span className="font-medium text-white whitespace-nowrap">{service.name.split('(')[0]}
            {service.name.includes('(') && <span className="text-sm opacity-60 ml-1">({service.name.split('(')[1]}</span>}
          </span>
        </div>
        <span className="font-bold text-purple-400">{service.price.toLocaleString('ru-RU')} ₽</span>
      </div>
    </motion.div>
  );
};

// 3. Main Services Screen
const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  return (
    <div className="bg-transparent" style={{ paddingBottom: '180px' }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center text-white">Услуги и цены</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          <section>
            <h3 className="text-2xl font-semibold pb-4 mb-6 text-white/90">
              Основные комплексы
            </h3>
            <div className="space-y-6">
              {mainServices.flatMap(cat => cat.services).map(service => (
                <ServiceCardComplex key={service.id} service={service} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold pb-4 mb-6 text-white/90">
              Локальная химчистка
            </h3>
            <div className="space-y-3">
              {localCleaningServices.flatMap(cat => cat.services).map(service => (
                <ServiceRow key={service.id} service={service} />
              ))}
            </div>
          </section>
        </motion.div>

        <div className="mt-12">
          <ScaleButton>
            <button
              onClick={() => onNavigate('Booking')}
              className="w-full h-16 bg-[linear-gradient(90deg,#3b82f6_0%,#8b5cf6_100%)] text-white font-bold uppercase rounded-2xl"
              style={{ boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)' }}
            >
              Перейти к записи
            </button>
          </ScaleButton>
        </div>
      </div>
    </div>
  );
};

export default Services;
