import React from 'react';
import { motion } from 'framer-motion';
import { PageKey } from '../App';
import { mainServices, localCleaningServices } from '../data/services';
import type { Service } from '../types/services';
import ScaleButton from '../components/ScaleButton';
import ServicesHeader from '../components/ServicesHeader';

interface ServicesProps {
  onNavigate: (pageKey: PageKey) => void;
}

// 1. Read-Only "Complex" Card (Keep as is)
const ServiceCardComplex: React.FC<{ service: Service }> = ({ service }) => {
  const cardVariants = { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 } };
  return (
    <motion.div variants={cardVariants} className="relative">
      <ScaleButton>
        <div className="relative w-full p-6 border rounded-3xl cursor-default bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border-[rgba(255,255,255,0.1)]">
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

// 2. Read-Only "Local Service" Row (Keep as is)
const ServiceRow: React.FC<{ service: Service }> = ({ service }) => {
  const rowVariants = { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 } };
  const name = service.name;
  const noteIndex = name.indexOf('(');
  const mainName = noteIndex > -1 ? name.substring(0, noteIndex) : name;
  const note = noteIndex > -1 ? name.substring(noteIndex) : '';

  return (
    <motion.div variants={rowVariants}>
      <div className="flex items-center justify-between gap-4 p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl">
        {service.icon && <span className="text-2xl flex-shrink-0">{service.icon}</span>}
        <p className="flex-grow text-left font-medium text-white whitespace-normal min-w-0">
          {mainName}
          {note && <span className="text-xs text-white/60 ml-1">{note}</span>}
        </p>
        <span className="font-bold text-purple-400 whitespace-nowrap flex-shrink-0 ml-4">{service.price.toLocaleString('ru-RU')} ₽</span>
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
      <ServicesHeader badge="Прайс-лист" /> {/* Main header for the page */}
      
      <div className="max-w-2xl mx-auto px-4"> {/* Added px-4 for content padding */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Основные комплексы */}
          <section>
            <div className="flex flex-col items-start pb-4 mb-6"> {/* Container for badge and content */}
              <ServicesHeader badge="Основные комплексы" /> {/* Subheader badge */}
            </div>
            <div className="space-y-6">
              {mainServices.flatMap(cat => cat.services).map(service => (
                <ServiceCardComplex key={service.id} service={service} />
              ))}
            </div>
          </section>

          {/* Химчистка отдельных зон */}
          <section>
            <div className="flex flex-col items-start pb-4 mb-6"> {/* Container for badge and content */}
              <ServicesHeader badge="Локальная химчистка" /> {/* Subheader badge */}
            </div>
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
