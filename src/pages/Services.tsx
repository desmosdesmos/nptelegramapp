import React from 'react';
import { motion } from 'framer-motion';
import { PageKey } from '../App';
import { mainServices, localCleaningServices } from '../data/services';
import type { Service } from '../types/services';
import ScaleButton from '../components/ScaleButton';
import ServicesHeader from '../components/ServicesHeader'; // Import the new header
import { ServiceIcon } from '../utils/iconMapper';

interface ServicesProps {
  onNavigate: (pageKey: PageKey) => void;
}

// 1. Read-Only "Complex" Card (Keep as is but with improved layout and animations)
const ServiceCardComplex: React.FC<{ service: Service }> = ({ service }) => {
  const cardVariants = { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 } };
  return (
    <motion.div variants={cardVariants} className="relative">
      <ScaleButton>
        <div className="relative w-full p-5 sm:p-6 border rounded-3xl cursor-default bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border-[rgba(255,255,255,0.1)] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-[0.98]">
          <div className="relative z-10 flex flex-col h-full">
            {/* Top Row: Icon + Title */}
            <div className="flex items-start mb-3">
              <ServiceIcon title={service.name} size="sm" />
              <h4 className="text-xl sm:text-2xl font-bold text-white ml-3 flex-1 whitespace-normal break-words">
                {service.name}
              </h4>
            </div>
            {service.description && <p className="text-sm sm:text-base text-white/70 opacity-70 mt-2 mb-4" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
            {/* Footer: Price aligned to bottom-right */}
            <div className="mt-auto pt-4">
              <span className="text-2xl sm:text-4xl font-bold text-cyan-400 self-end whitespace-nowrap">
                {service.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>
      </ScaleButton>
    </motion.div>
  );
};

// 2. Read-Only "Local Service" Row (Keep as is with animations)
const ServiceRow: React.FC<{ service: Service }> = ({ service }) => {
  const rowVariants = { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 } };
  const name = service.name;
  const noteIndex = name.indexOf('(');
  const mainName = noteIndex > -1 ? name.substring(0, noteIndex) : name;
  const note = noteIndex > -1 ? name.substring(noteIndex) : '';

  return (
    <motion.div variants={rowVariants}>
      <div className="flex w-full items-center p-3 sm:p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-[0.98]">
        <div className="flex items-center flex-1 min-w-0">
          <ServiceIcon title={service.name} size="sm" />
          <p className="flex-grow text-left font-medium text-white whitespace-normal min-w-0 ml-3">
            {mainName}
            {note && <span className="text-xs text-white/60 ml-1">{note}</span>}
          </p>
        </div>
        <span className="font-bold text-purple-400 whitespace-nowrap flex-shrink-0">
          {service.price.toLocaleString('ru-RU')} ₽
        </span>
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
        {/* Main page title is gone */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Основные комплексы */}
          <section>
            <ServicesHeader text="Основные комплексы" /> {/* Updated usage */}
            <div className="space-y-6">
              {mainServices.flatMap(cat => cat.services).map(service => (
                <ServiceCardComplex key={service.id} service={service} />
              ))}
            </div>
          </section>

          {/* Химчистка отдельных зон */}
          <section>
            <ServicesHeader text="Локальная химчистка" /> {/* Updated usage */}
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